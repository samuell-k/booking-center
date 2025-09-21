const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { v4: uuidv4 } = require('uuid');
const { cache } = require('../config/redis');
const { db } = require('../config/database');
const logger = require('../utils/logger');
const { AppError } = require('./errorHandler');
// Advanced rate limiting with different tiers
const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            error: message,
            retryAfter: Math.ceil(windowMs / 1000)
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,
        keyGenerator: (req) => {
            // Use user ID if authenticated, otherwise IP
            return req.user?.id || req.ip;
        },
        onLimitReached: (req, res, options) => {
            logger.warn('Rate limit exceeded', {
                ip: req.ip,
                user_id: req.user?.id,
                path: req.path,
                method: req.method
            });
        }
    });
};
// Different rate limits for different endpoints
const rateLimits = {
    // General API rate limit
    general: createRateLimit(15 * 60 * 1000, // 15 minutes
    1000, // 1000 requests per window
    'Too many requests, please try again later'),
    // Authentication endpoints
    auth: createRateLimit(15 * 60 * 1000, // 15 minutes
    10, // 10 attempts per window
    'Too many authentication attempts, please try again later'),
    // Payment endpoints
    payment: createRateLimit(15 * 60 * 1000, // 15 minutes
    20, // 20 payment requests per window
    'Too many payment requests, please try again later'),
    // Ticket purchase endpoints
    ticketPurchase: createRateLimit(5 * 60 * 1000, // 5 minutes
    10, // 10 ticket purchases per window
    'Too many ticket purchase attempts, please try again later'),
    // Search endpoints
    search: createRateLimit(1 * 60 * 1000, // 1 minute
    60, // 60 searches per minute
    'Too many search requests, please try again later')
};
// Slow down middleware for suspicious activity
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // allow 100 requests per windowMs without delay
    delayMs: 500, // add 500ms delay per request after delayAfter
    maxDelayMs: 20000, // max delay of 20 seconds
    keyGenerator: (req) => req.user?.id || req.ip
});
// Brute force protection for login attempts
const bruteForceProtection = async (req, res, next) => {
    const key = `brute_force:${req.ip}:${req.body.email || req.body.phone}`;
    try {
        const attempts = await cache.get(key) || 0;
        if (attempts >= 5) {
            const lockTime = await cache.get(`${key}:lock`);
            if (lockTime && Date.now() < lockTime) {
                throw new AppError('Account temporarily locked due to too many failed attempts', 429);
            }
        }
        req.bruteForceKey = key;
        next();
    }
    catch (error) {
        next(error);
    }
};
// Record failed login attempt
const recordFailedAttempt = async (key) => {
    const attempts = await cache.get(key) || 0;
    const newAttempts = attempts + 1;
    await cache.set(key, newAttempts, 15 * 60); // 15 minutes
    if (newAttempts >= 5) {
        // Lock for 1 hour
        await cache.set(`${key}:lock`, Date.now() + 60 * 60 * 1000, 60 * 60);
    }
};
// Clear failed attempts on successful login
const clearFailedAttempts = async (key) => {
    await cache.del(key);
    await cache.del(`${key}:lock`);
};
// Request correlation ID middleware
const correlationId = (req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    next();
};
// Request logging middleware
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    // Log request
    logger.info('Request started', {
        correlation_id: req.correlationId,
        method: req.method,
        path: req.path,
        ip: req.ip,
        user_agent: req.get('User-Agent'),
        user_id: req.user?.id
    });
    // Override res.json to log response
    const originalJson = res.json;
    res.json = function (data) {
        const responseTime = Date.now() - startTime;
        logger.info('Request completed', {
            correlation_id: req.correlationId,
            method: req.method,
            path: req.path,
            status_code: res.statusCode,
            response_time: responseTime,
            user_id: req.user?.id
        });
        // Store in database for analytics (async)
        setImmediate(async () => {
            try {
                await db('api_request_logs').insert({
                    correlation_id: req.correlationId,
                    method: req.method,
                    path: req.path,
                    query_params: JSON.stringify(req.query),
                    headers: JSON.stringify({
                        'user-agent': req.get('User-Agent'),
                        'content-type': req.get('Content-Type')
                    }),
                    request_body: req.method !== 'GET' ? JSON.stringify(req.body) : null,
                    status_code: res.statusCode,
                    response_time_ms: responseTime,
                    user_id: req.user?.id,
                    ip_address: req.ip,
                    user_agent: req.get('User-Agent'),
                    started_at: new Date(startTime),
                    completed_at: new Date()
                });
            }
            catch (error) {
                logger.error('Failed to log request to database:', error);
            }
        });
        return originalJson.call(this, data);
    };
    next();
};
// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
    // Remove null bytes
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj.replace(/\0/g, '');
        }
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                obj[key] = sanitize(obj[key]);
            }
        }
        return obj;
    };
    if (req.body) {
        req.body = sanitize(req.body);
    }
    if (req.query) {
        req.query = sanitize(req.query);
    }
    if (req.params) {
        req.params = sanitize(req.params);
    }
    next();
};
// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Remove server information
    res.removeHeader('X-Powered-By');
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    // HSTS for HTTPS
    if (req.secure) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
};
// IP whitelist middleware for admin endpoints
const ipWhitelist = (allowedIPs = []) => {
    return (req, res, next) => {
        if (allowedIPs.length === 0) {
            return next();
        }
        const clientIP = req.ip || req.connection.remoteAddress;
        if (!allowedIPs.includes(clientIP)) {
            logger.warn('Unauthorized IP access attempt', {
                ip: clientIP,
                path: req.path,
                user_id: req.user?.id
            });
            throw new AppError('Access denied from this IP address', 403);
        }
        next();
    };
};
// Suspicious activity detection
const suspiciousActivityDetection = async (req, res, next) => {
    try {
        const key = `activity:${req.ip}`;
        const activity = await cache.get(key) || { requests: 0, patterns: [] };
        activity.requests += 1;
        activity.patterns.push({
            path: req.path,
            method: req.method,
            timestamp: Date.now(),
            user_agent: req.get('User-Agent')
        });
        // Keep only last 100 requests
        if (activity.patterns.length > 100) {
            activity.patterns = activity.patterns.slice(-100);
        }
        // Check for suspicious patterns
        const recentRequests = activity.patterns.filter(p => Date.now() - p.timestamp < 60000 // Last minute
        );
        // Too many requests in short time
        if (recentRequests.length > 100) {
            logger.warn('Suspicious activity detected: High request rate', {
                ip: req.ip,
                requests_per_minute: recentRequests.length
            });
        }
        // Same endpoint hit too frequently
        const pathCounts = {};
        recentRequests.forEach(r => {
            pathCounts[r.path] = (pathCounts[r.path] || 0) + 1;
        });
        for (const [path, count] of Object.entries(pathCounts)) {
            if (count > 20) {
                logger.warn('Suspicious activity detected: Path flooding', {
                    ip: req.ip,
                    path,
                    count
                });
            }
        }
        await cache.set(key, activity, 3600); // Store for 1 hour
        next();
    }
    catch (error) {
        logger.error('Suspicious activity detection failed:', error);
        next();
    }
};
module.exports = {
    rateLimits,
    speedLimiter,
    bruteForceProtection,
    recordFailedAttempt,
    clearFailedAttempts,
    correlationId,
    requestLogger,
    sanitizeInput,
    securityHeaders,
    ipWhitelist,
    suspiciousActivityDetection
};
//# sourceMappingURL=security.js.map