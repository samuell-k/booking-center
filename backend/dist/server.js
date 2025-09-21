"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const redis_1 = require("redis");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
require("express-async-errors");
// Load environment variables
dotenv_1.default.config();
// Import TypeORM data source
const data_source_1 = require("./config/data-source");
// Import utilities and middleware
const logger_1 = __importDefault(require("./utils/logger"));
const errorHandler_1 = require("./middleware/errorHandler");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const events_1 = __importDefault(require("./routes/events"));
const tickets_1 = __importDefault(require("./routes/tickets"));
const payments_1 = __importDefault(require("./routes/payments"));
const reservations_1 = __importDefault(require("./routes/reservations"));
const wallet_1 = __importDefault(require("./routes/wallet"));
const teams_1 = __importDefault(require("./routes/teams"));
const venues_1 = __importDefault(require("./routes/venues"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const scanner_1 = __importDefault(require("./routes/scanner"));
const admin_1 = __importDefault(require("./routes/admin"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
// Import security middleware
const security_1 = require("./middleware/security");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false
}));
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://smartsports.rw',
            'https://www.smartsports.rw',
            'https://admin.smartsports.rw'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
// Compression middleware
app.use((0, compression_1.default)({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression_1.default.filter(req, res);
    },
    level: 6,
    threshold: 1024
}));
// Body parsing middleware
app.use(express_1.default.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Security middleware
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, xss_clean_1.default)());
app.use((0, hpp_1.default)());
// Custom security middleware
app.use(security_1.correlationId);
app.use(security_1.securityHeaders);
app.use(security_1.sanitizeInput);
// Logging middleware
if (NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('combined', {
        stream: {
            write: (message) => logger_1.default.info(message.trim())
        }
    }));
}
app.use(security_1.requestLogger);
// Rate limiting
app.use('/api/auth', security_1.rateLimits.auth);
app.use('/api/payments', security_1.rateLimits.payment);
app.use('/api/tickets', security_1.rateLimits.ticket);
app.use('/api', security_1.rateLimits.general);
// Speed limiting
app.use(security_1.speedLimiter);
// Swagger documentation
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SmartSports Rwanda API',
            version: '1.0.0',
            description: 'Professional Sports Ticketing System API for Rwanda',
            contact: {
                name: 'SmartSports Rwanda',
                email: 'support@smartsports.rw',
                url: 'https://smartsports.rw'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server'
            },
            {
                url: 'https://api.smartsports.rw',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.js', './src/routes/*.ts']
};
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SmartSports Rwanda API Documentation'
}));
// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const health = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: NODE_ENV,
            version: process.env.npm_package_version || '1.0.0',
            services: {
                database: 'checking...',
                redis: 'checking...'
            }
        };
        // Check database connection
        try {
            if (data_source_1.AppDataSource.isInitialized) {
                await data_source_1.AppDataSource.query('SELECT 1');
                health.services.database = 'connected';
            }
            else {
                health.services.database = 'disconnected';
            }
        }
        catch (error) {
            health.services.database = 'error';
        }
        // Check Redis connection (if available)
        try {
            const redisClient = (0, redis_1.createClient)({
                url: process.env.REDIS_URL || 'redis://localhost:6379'
            });
            await redisClient.ping();
            health.services.redis = 'connected';
            await redisClient.quit();
        }
        catch (error) {
            health.services.redis = 'error';
        }
        const isHealthy = health.services.database === 'connected';
        res.status(isHealthy ? 200 : 503).json(health);
    }
    catch (error) {
        res.status(503).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            error: 'Health check failed'
        });
    }
});
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/events', events_1.default);
app.use('/api/tickets', tickets_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/reservations', reservations_1.default);
app.use('/api/wallet', wallet_1.default);
app.use('/api/teams', teams_1.default);
app.use('/api/venues', venues_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/scanner', scanner_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/webhooks', webhooks_1.default);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Socket.IO connection handling
io.on('connection', (socket) => {
    logger_1.default.info(`Socket connected: ${socket.id}`);
    socket.on('disconnect', () => {
        logger_1.default.info(`Socket disconnected: ${socket.id}`);
    });
});
// Graceful shutdown
const gracefulShutdown = async (signal) => {
    logger_1.default.info(`Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
        logger_1.default.info('HTTP server closed');
        try {
            if (data_source_1.AppDataSource.isInitialized) {
                await data_source_1.AppDataSource.destroy();
                logger_1.default.info('Database connection closed');
            }
        }
        catch (error) {
            logger_1.default.error('Error closing database connection:', error);
        }
        process.exit(0);
    });
    // Force close after 30 seconds
    setTimeout(() => {
        logger_1.default.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Start server
const startServer = async () => {
    try {
        // Initialize database
        if (NODE_ENV !== 'test') {
            await (0, data_source_1.initializeDatabase)();
        }
        else {
            logger_1.default.info('⚠️  Skipping database connection for testing');
        }
        server.listen(PORT, () => {
            logger_1.default.info(`🚀 SmartSports Rwanda API Server running on port ${PORT}`);
            logger_1.default.info(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
            logger_1.default.info(`🏥 Health Check: http://localhost:${PORT}/health`);
            logger_1.default.info(`🌍 Environment: ${NODE_ENV}`);
        });
    }
    catch (error) {
        logger_1.default.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Start the server
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map