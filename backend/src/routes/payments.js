const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const PaymentService = require('../services/paymentService');
const logger = require('../utils/logger');

const router = express.Router();
const paymentService = PaymentService;

/**
 * @swagger
 * /payments/initiate:
 *   post:
 *     summary: Initiate payment
 *     tags: [Payments]
 */
router.post('/initiate', [
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount required'),
  body('payment_method').isIn(['mtn', 'airtel', 'bank_transfer', 'wallet']).withMessage('Invalid payment method'),
  body('customer_phone').isMobilePhone().withMessage('Valid phone number required'),
  body('customer_name').trim().isLength({ min: 2 }).withMessage('Customer name required')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const payment = await paymentService.initiatePayment(req.body);

  res.status(201).json({
    success: true,
    data: { payment }
  });
}));

/**
 * @swagger
 * /payments/{id}/status:
 *   get:
 *     summary: Check payment status
 *     tags: [Payments]
 */
router.get('/:id/status', catchAsync(async (req, res) => {
  const payment = await db('payments')
    .where({ id: req.params.id })
    .first();

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
        method: payment.payment_method
      }
    }
  });
}));

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Payment webhook
 *     tags: [Payments]
 */
router.post('/webhook', catchAsync(async (req, res) => {
  // Handle payment webhooks
  logger.logInfo('Payment webhook received', req.body);
  
  res.json({
    success: true,
    message: 'Webhook received'
  });
}));

module.exports = router;
