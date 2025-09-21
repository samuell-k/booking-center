const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { generateToken, generateRefreshToken, verifyToken, hashPassword, comparePassword, authenticate, blacklistToken } = require('../middleware/auth');
const { db } = require('../config/database');
const { cache } = require('../config/redis');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const router = express.Router();
// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registrations per hour per IP
    message: {
        success: false,
        message: 'Too many registration attempts, please try again later.'
    }
});
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post('/register', registerLimiter, [
    body('first_name').trim().isLength({ min: 2, max: 100 }).withMessage('First name must be 2-100 characters'),
    body('last_name').trim().isLength({ min: 2, max: 100 }).withMessage('Last name must be 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').isMobilePhone('rw-RW').withMessage('Valid Rwandan phone number is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and number'),
], catchAsync(async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    const { first_name, last_name, email, phone, password } = req.body;
    // Check if user already exists
    const existingUser = await db('users')
        .where('email', email)
        .orWhere('phone', phone)
        .first();
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
        });
    }
    // Hash password
    const passwordHash = await hashPassword(password);
    // Generate verification tokens
    const emailVerificationToken = generateToken({ email, type: 'email_verification' }, '24h');
    const phoneVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    // Generate referral code
    const referralCode = `SSR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    // Create user
    const [user] = await db('users').insert({
        first_name,
        last_name,
        email,
        phone,
        password_hash: passwordHash,
        email_verification_token: emailVerificationToken,
        phone_verification_token: phoneVerificationToken,
        referral_code: referralCode,
        status: 'active'
    }).returning(['id', 'first_name', 'last_name', 'email', 'phone', 'referral_code']);
    // Create wallet for user
    const walletNumber = `SSW${Date.now()}${Math.floor(Math.random() * 1000)}`;
    await db('wallets').insert({
        user_id: user.id,
        wallet_number: walletNumber,
        wallet_name: `${first_name} ${last_name}'s Wallet`
    });
    // Send verification email
    try {
        await emailService.sendEmailVerification(user, emailVerificationToken);
    }
    catch (error) {
        logger.error('Failed to send verification email:', error);
    }
    // Send verification SMS
    try {
        await smsService.sendVerificationCode(phone, phoneVerificationToken);
    }
    catch (error) {
        logger.error('Failed to send verification SMS:', error);
    }
    logger.logBusiness('User Registration', {
        userId: user.id,
        email: user.email,
        phone: user.phone
    });
    res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email and phone number.',
        data: {
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                referral_code: user.referral_code
            }
        }
    });
}));
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       423:
 *         description: Account locked
 */
router.post('/login', authLimiter, [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    const { email, password } = req.body;
    // Get user with password
    const user = await db('users')
        .where({ email })
        .first();
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
        return res.status(423).json({
            success: false,
            message: 'Account is temporarily locked due to too many failed login attempts'
        });
    }
    // Check password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
        // Increment failed login attempts
        const failedAttempts = (user.failed_login_attempts || 0) + 1;
        const updateData = { failed_login_attempts: failedAttempts };
        // Lock account after 5 failed attempts
        if (failedAttempts >= 5) {
            updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        }
        await db('users').where({ id: user.id }).update(updateData);
        logger.logSecurity('Failed Login Attempt', {
            userId: user.id,
            email: user.email,
            ip: req.ip,
            failedAttempts
        });
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
    // Check if user is active
    if (user.status !== 'active') {
        return res.status(401).json({
            success: false,
            message: 'Account is not active'
        });
    }
    // Reset failed login attempts
    await db('users').where({ id: user.id }).update({
        failed_login_attempts: 0,
        locked_until: null,
        last_login: new Date(),
        last_login_ip: req.ip
    });
    // Generate tokens
    const accessToken = generateToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });
    // Store refresh token
    await cache.set(`refresh_token:${user.id}`, refreshToken, 30 * 24 * 60 * 60); // 30 days
    logger.logBusiness('User Login', {
        userId: user.id,
        email: user.email,
        ip: req.ip
    });
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                email_verified: user.email_verified,
                phone_verified: user.phone_verified
            },
            tokens: {
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: '7d'
            }
        }
    });
}));
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authenticate, catchAsync(async (req, res) => {
    const token = req.headers.authorization.substring(7);
    // Blacklist the token
    await blacklistToken(token);
    // Remove refresh token
    await cache.del(`refresh_token:${req.user.id}`);
    logger.logBusiness('User Logout', {
        userId: req.user.id,
        email: req.user.email
    });
    res.json({
        success: true,
        message: 'Logout successful'
    });
}));
module.exports = router;
//# sourceMappingURL=auth.js.map