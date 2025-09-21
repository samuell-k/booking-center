const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { authenticate } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const reservationService = require('../services/reservationService');
const cacheService = require('../services/cacheService');
const logger = require('../utils/logger');

const router = express.Router();

// Rate limiting for reservation endpoints
const reservationRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 20 reservation requests per windowMs
  message: {
    error: 'Too many reservation requests, please try again later',
    retryAfter: 5 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /reservations/reserve:
 *   post:
 *     summary: Reserve seats to prevent overselling
 *     tags: [Reservations]
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
 *               session_id:
 *                 type: string
 *                 description: Session ID for anonymous users
 *     responses:
 *       201:
 *         description: Seats reserved successfully
 *       400:
 *         description: Validation error or insufficient seats
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/reserve', reservationRateLimit, [
  body('event_id').isUUID().withMessage('Valid event ID required'),
  body('ticket_type').isIn(['regular', 'vip', 'student', 'child']).withMessage('Invalid ticket type'),
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
  body('session_id').optional().isString().withMessage('Invalid session ID')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { event_id, ticket_type, quantity, session_id } = req.body;
  const userId = req.user?.id;

  if (!userId && !session_id) {
    throw new AppError('User ID or session ID required', 400);
  }

  const reservation = await reservationService.reserveSeats(
    event_id,
    ticket_type,
    quantity,
    userId,
    session_id
  );

  logger.info('Seats reserved successfully', {
    reservation_token: reservation.reservationToken,
    event_id,
    ticket_type,
    quantity,
    user_id: userId
  });

  res.status(201).json({
    success: true,
    message: 'Seats reserved successfully',
    data: reservation
  });
}));

/**
 * @swagger
 * /reservations/{token}:
 *   get:
 *     summary: Get reservation details
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:token', [
  param('token').isString().withMessage('Valid reservation token required')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const reservation = await reservationService.getReservation(req.params.token);

  res.json({
    success: true,
    data: reservation
  });
}));

/**
 * @swagger
 * /reservations/{token}/cancel:
 *   post:
 *     summary: Cancel reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 enum: [user_cancelled, timeout, insufficient_funds]
 */
router.post('/:token/cancel', [
  param('token').isString().withMessage('Valid reservation token required'),
  body('reason').optional().isIn(['user_cancelled', 'timeout', 'insufficient_funds']).withMessage('Invalid cancellation reason')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { reason = 'user_cancelled' } = req.body;
  
  await reservationService.cancelReservation(req.params.token, reason);

  logger.info('Reservation cancelled', {
    reservation_token: req.params.token,
    reason
  });

  res.json({
    success: true,
    message: 'Reservation cancelled successfully'
  });
}));

/**
 * @swagger
 * /reservations/user/{userId}:
 *   get:
 *     summary: Get user's active reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 */
router.get('/user/:userId', authenticate, [
  param('userId').isUUID().withMessage('Valid user ID required')
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

  // Check if user can access these reservations
  if (req.user.id !== userId && !['super_admin', 'admin'].includes(req.user.role)) {
    throw new AppError('Access denied', 403);
  }

  const reservations = await reservationService.getUserReservations(userId);

  res.json({
    success: true,
    data: {
      reservations
    }
  });
}));

/**
 * @swagger
 * /reservations/availability/{eventId}:
 *   get:
 *     summary: Get real-time ticket availability for an event
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 */
router.get('/availability/:eventId', [
  param('eventId').isUUID().withMessage('Valid event ID required')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { eventId } = req.params;

  // Get cached availability or fetch from database
  const availability = await cacheService.cacheTicketAvailability(eventId);

  // Get current reservations
  const reservationCounts = {};
  for (const item of availability) {
    const reservedCount = await reservationService.getReservedTicketCount(eventId, item.ticket_type);
    reservationCounts[item.ticket_type] = reservedCount;
  }

  const result = availability.map(item => ({
    ticket_type: item.ticket_type,
    total: parseInt(item.total),
    available: parseInt(item.available),
    sold: parseInt(item.sold),
    reserved: reservationCounts[item.ticket_type] || 0,
    actual_available: parseInt(item.available) - (reservationCounts[item.ticket_type] || 0)
  }));

  res.json({
    success: true,
    data: {
      event_id: eventId,
      availability: result,
      last_updated: new Date().toISOString()
    }
  });
}));

module.exports = router;
