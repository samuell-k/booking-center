const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { db } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const paymentService = require('../services/paymentService');
const reservationService = require('../services/reservationService');
const logger = require('../utils/logger');
const router = express.Router();
// Rate limiting for payment endpoints
const paymentRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 payment requests per windowMs
    message: {
        error: 'Too many payment requests, please try again later',
        retryAfter: 15 * 60
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const webhookRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Allow more webhook requests
    message: {
        error: 'Too many webhook requests',
        retryAfter: 60
    }
});
/**
 * @swagger
 * /payments/initiate:
 *   post:
 *     summary: Initiate payment with idempotency support
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - ticket_type
 *               - quantity
 *               - payment_method
 *               - customer_name
 *               - customer_phone
 *             properties:
 *               event_id:
 *                 type: string
 *                 format: uuid
 *               ticket_type:
 *                 type: string
 *                 enum: [regular, vip, student, child]
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               payment_method:
 *                 type: string
 *                 enum: [mtn_momo, airtel_money, bank_transfer, credit_card, wallet]
 *               customer_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               customer_phone:
 *                 type: string
 *                 pattern: '^(\+250|250)?[0-9]{9}$'
 *               customer_email:
 *                 type: string
 *                 format: email
 *               reservation_token:
 *                 type: string
 *                 description: Token from seat reservation
 *     responses:
 *       201:
 *         description: Payment initiated successfully
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/initiate', paymentRateLimit, [
    body('event_id').isUUID().withMessage('Valid event ID required'),
    body('ticket_type').isIn(['regular', 'vip', 'student', 'child']).withMessage('Invalid ticket type'),
    body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
    body('payment_method').isIn(['mtn_momo', 'airtel_money', 'bank_transfer', 'credit_card', 'wallet']).withMessage('Invalid payment method'),
    body('customer_phone').matches(/^(\+250|250)?[0-9]{9}$/).withMessage('Valid Rwandan phone number required'),
    body('customer_name').trim().isLength({ min: 2, max: 100 }).withMessage('Customer name must be 2-100 characters'),
    body('customer_email').optional().isEmail().withMessage('Valid email required'),
    body('reservation_token').optional().isString().withMessage('Invalid reservation token')
], catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    // Extract idempotency key from headers
    const idempotencyKey = req.headers['idempotency-key'];
    const paymentData = {
        ...req.body,
        user_id: req.user?.id,
        idempotency_key: idempotencyKey
    };
    const payment = await paymentService.initiatePayment(paymentData);
    res.status(201).json({
        success: true,
        message: 'Payment initiated successfully',
        data: payment
    });
}));
/**
 * @swagger
 * /payments/{id}/status:
 *   get:
 *     summary: Check payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *       404:
 *         description: Payment not found
 */
router.get('/:id/status', [
    param('id').isUUID().withMessage('Valid payment ID required')
], catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    // Check payment status with real-time updates
    const payment = await paymentService.checkPaymentStatus(req.params.id);
    if (!payment) {
        throw new AppError('Payment not found', 404);
    }
    res.json({
        success: true,
        data: {
            payment: {
                id: payment.id,
                reference: payment.payment_reference,
                status: payment.status,
                amount: payment.total_amount,
                method: payment.payment_method,
                initiated_at: payment.initiated_at,
                completed_at: payment.completed_at,
                expires_at: payment.expires_at,
                fraud_score: payment.fraud_score
            }
        }
    });
}));
/**
 * @swagger
 * /payments/webhook/{provider}:
 *   post:
 *     summary: Payment webhook endpoint with signature verification
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mtn, airtel, rswitch]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       401:
 *         description: Invalid signature
 *       404:
 *         description: Payment not found
 */
router.post('/webhook/:provider', webhookRateLimit, [
    param('provider').isIn(['mtn', 'airtel', 'rswitch']).withMessage('Invalid provider')
], catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    const { provider } = req.params;
    const signature = req.headers['x-signature'] || req.headers['signature'];
    if (!signature) {
        throw new AppError('Missing webhook signature', 401);
    }
    const result = await paymentService.processWebhook(req.body, signature, provider);
    logger.info('Payment webhook processed', {
        provider,
        status: result.status,
        payment_id: result.payment?.id
    });
    res.json({
        success: true,
        message: 'Webhook processed successfully',
        data: result
    });
}));
/**
 * @swagger
 * /payments/{id}/retry:
 *   post:
 *     summary: Retry failed payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 */
router.post('/:id/retry', authenticate, [
    param('id').isUUID().withMessage('Valid payment ID required')
], catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    const payment = await paymentService.retryPayment(req.params.id);
    res.json({
        success: true,
        message: 'Payment retry initiated',
        data: payment
    });
}));
/**
 * @swagger
 * /payments/user/{userId}:
 *   get:
 *     summary: Get user payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, failed, cancelled]
 */
router.get('/user/:userId', authenticate, [
    param('userId').isUUID().withMessage('Valid user ID required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'processing', 'completed', 'failed', 'cancelled']).withMessage('Invalid status')
], catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    const { userId } = req.params;
    const { page = 1, limit = 20, status } = req.query;
    // Check if user can access these payments
    if (req.user.id !== userId && !['super_admin', 'admin'].includes(req.user.role)) {
        throw new AppError('Access denied', 403);
    }
    const conditions = { user_id: userId };
    if (status) {
        conditions.status = status;
    }
    const result = await db('payments')
        .leftJoin('events', 'payments.event_id', 'events.id')
        .select([
        'payments.id',
        'payments.payment_reference',
        'payments.total_amount',
        'payments.payment_method',
        'payments.status',
        'payments.initiated_at',
        'payments.completed_at',
        'events.title as event_title',
        'events.start_datetime'
    ])
        .where(conditions)
        .orderBy('payments.initiated_at', 'desc')
        .paginate({ perPage: limit, currentPage: page });
    res.json({
        success: true,
        data: {
            payments: result.data,
            pagination: {
                page: result.pagination.currentPage,
                limit: result.pagination.perPage,
                total: result.pagination.total,
                totalPages: result.pagination.lastPage
            }
        }
    });
}));
module.exports = router;
//# sourceMappingURL=payments.js.map