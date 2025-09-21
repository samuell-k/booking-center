const logger = require('../utils/logger');
// Custom error class
class AppError extends Error {
    constructor(message, statusCode, code = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
// Handle cast errors (invalid IDs)
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400, 'INVALID_ID');
};
// Handle duplicate field errors
const handleDuplicateFieldsError = (err) => {
    let field = 'field';
    let value = 'value';
    if (err.constraint) {
        // PostgreSQL unique constraint error
        if (err.constraint.includes('email')) {
            field = 'email';
            value = err.detail?.match(/\(([^)]+)\)/)?.[1] || 'email';
        }
        else if (err.constraint.includes('phone')) {
            field = 'phone';
            value = err.detail?.match(/\(([^)]+)\)/)?.[1] || 'phone';
        }
        else if (err.constraint.includes('username')) {
            field = 'username';
            value = err.detail?.match(/\(([^)]+)\)/)?.[1] || 'username';
        }
    }
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    return new AppError(message, 409, 'DUPLICATE_FIELD');
};
// Handle validation errors
const handleValidationError = (err) => {
    const errors = Object.values(err.errors || {}).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400, 'VALIDATION_ERROR');
};
// Handle JWT errors
const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again!', 401, 'INVALID_TOKEN');
};
const handleJWTExpiredError = () => {
    return new AppError('Your token has expired! Please log in again.', 401, 'EXPIRED_TOKEN');
};
// Handle database connection errors
const handleDatabaseError = (err) => {
    logger.error('Database error:', err);
    if (err.code === 'ECONNREFUSED') {
        return new AppError('Database connection failed', 503, 'DATABASE_CONNECTION_ERROR');
    }
    if (err.code === '23505') { // PostgreSQL unique violation
        return handleDuplicateFieldsError(err);
    }
    if (err.code === '23503') { // PostgreSQL foreign key violation
        return new AppError('Referenced record does not exist', 400, 'FOREIGN_KEY_ERROR');
    }
    if (err.code === '23502') { // PostgreSQL not null violation
        const field = err.column || 'field';
        return new AppError(`${field} is required`, 400, 'REQUIRED_FIELD');
    }
    return new AppError('Database operation failed', 500, 'DATABASE_ERROR');
};
// Handle Redis errors
const handleRedisError = (err) => {
    logger.error('Redis error:', err);
    return new AppError('Cache service unavailable', 503, 'CACHE_ERROR');
};
// Handle file upload errors
const handleMulterError = (err) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return new AppError('File too large', 413, 'FILE_TOO_LARGE');
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
        return new AppError('Too many files', 413, 'TOO_MANY_FILES');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return new AppError('Unexpected file field', 400, 'UNEXPECTED_FILE');
    }
    return new AppError('File upload failed', 400, 'UPLOAD_ERROR');
};
// Send error response in development
const sendErrorDev = (err, req, res) => {
    // API error
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            code: err.code,
            stack: err.stack,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            method: req.method
        });
    }
    // Rendered website error
    res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    });
};
// Send error response in production
const sendErrorProd = (err, req, res) => {
    // API error
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                success: false,
                message: err.message,
                code: err.code,
                timestamp: new Date().toISOString()
            });
        }
        // Programming or other unknown error: don't leak error details
        logger.error('ERROR:', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            code: 'INTERNAL_SERVER_ERROR',
            timestamp: new Date().toISOString()
        });
    }
    // Rendered website error
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
    // Programming or other unknown error
    logger.error('ERROR:', err);
    res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
};
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else {
        let error = { ...err };
        error.message = err.message;
        // Handle specific error types
        if (error.name === 'CastError')
            error = handleCastError(error);
        if (error.code === 23505)
            error = handleDuplicateFieldsError(error);
        if (error.name === 'ValidationError')
            error = handleValidationError(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        if (error.code && error.code.startsWith('23'))
            error = handleDatabaseError(error);
        if (error.name === 'RedisError')
            error = handleRedisError(error);
        if (error.name === 'MulterError')
            error = handleMulterError(error);
        sendErrorProd(error, req, res);
    }
};
// Async error wrapper
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    logger.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});
module.exports = {
    AppError,
    errorHandler,
    catchAsync
};
//# sourceMappingURL=errorHandler.js.map