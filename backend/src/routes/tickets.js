const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const QRService = require('../services/qrService');
const PaymentService = require('../services/paymentService');
const EmailService = require('../services/emailService');
const logger = require('../utils/logger');

const router = express.Router();
const qrService = QRService;
const paymentService = PaymentService;
const emailService = EmailService;

/**
 * @swagger
 * /tickets/purchase:
 *   post:
 *     summary: Purchase tickets with individual QR codes
 *     tags: [Tickets]
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
 *               ticket_type:
 *                 type: string
 *                 enum: [regular, vip, student]
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               payment_method:
 *                 type: string
 *                 enum: [mtn, airtel, bank_transfer, wallet]
 *               customer_name:
 *                 type: string
 *               customer_phone:
 *                 type: string
 *               customer_email:
 *                 type: string
 */
router.post('/purchase', [
  body('event_id').isUUID().withMessage('Valid event ID required'),
  body('ticket_type').isIn(['regular', 'vip', 'student']).withMessage('Invalid ticket type'),
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
  body('payment_method').isIn(['mtn', 'airtel', 'bank_transfer', 'wallet']).withMessage('Invalid payment method'),
  body('customer_name').trim().isLength({ min: 2, max: 100 }).withMessage('Customer name required'),
  body('customer_phone').isMobilePhone().withMessage('Valid phone number required'),
  body('customer_email').optional().isEmail().withMessage('Valid email required')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    event_id,
    ticket_type,
    quantity,
    payment_method,
    customer_name,
    customer_phone,
    customer_email
  } = req.body;

  const trx = await db.transaction();

  try {
    // Check if event exists and is active
    const event = await trx('events')
      .where({ id: event_id, status: 'active' })
      .first();

    if (!event) {
      throw new AppError('Event not found or not available', 404);
    }

    // Check ticket availability
    const availableTickets = await trx('tickets')
      .where({
        event_id,
        ticket_type,
        status: 'available'
      })
      .limit(quantity);

    if (availableTickets.length < quantity) {
      throw new AppError(`Only ${availableTickets.length} tickets available`, 400);
    }

    // Calculate pricing
    const ticketPrice = availableTickets[0].price;
    const subtotal = ticketPrice * quantity;
    const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
    const vatAmount = Math.round((subtotal + serviceFee) * 0.18); // 18% VAT
    const totalAmount = subtotal + serviceFee + vatAmount;

    // Create payment record
    const paymentData = {
      user_id: req.user?.id || null,
      event_id,
      ticket_ids: availableTickets.map(t => t.id),
      amount: totalAmount,
      payment_method,
      customer_phone,
      customer_email,
      customer_name
    };

    const payment = await paymentService.initiatePayment(paymentData);

    // Generate individual QR codes for each ticket
    const qrData = {
      event_id,
      user_id: req.user?.id || null,
      ticket_type,
      quantity,
      payment_reference: payment.payment_reference,
      customer_name,
      customer_phone,
      customer_email
    };

    const qrResult = await qrService.generateIndividualTicketQRs(qrData);

    // Update tickets with purchase information
    const ticketUpdates = [];
    for (let i = 0; i < quantity; i++) {
      const ticket = availableTickets[i];
      const qrCode = qrResult.qrCodes[i];
      
      ticketUpdates.push({
        id: ticket.id,
        status: 'sold',
        qr_code: qrCode.qrCode,
        ticket_number: qrCode.ticketNumber,
        payment_id: payment.id,
        holder_name: customer_name,
        holder_phone: customer_phone,
        holder_email: customer_email,
        purchased_at: new Date()
      });
    }

    // Update all tickets
    for (const update of ticketUpdates) {
      await trx('tickets')
        .where({ id: update.id })
        .update({
          status: update.status,
          qr_code: update.qr_code,
          ticket_number: update.ticket_number,
          payment_id: update.payment_id,
          holder_name: update.holder_name,
          holder_phone: update.holder_phone,
          holder_email: update.holder_email,
          purchased_at: update.purchased_at
        });
    }

    await trx.commit();

    // Send confirmation email with QR codes
    if (customer_email) {
      try {
        await emailService.sendTicketConfirmation(
          { 
            first_name: customer_name.split(' ')[0],
            last_name: customer_name.split(' ').slice(1).join(' '),
            email: customer_email 
          },
          ticketUpdates,
          event,
          payment
        );
      } catch (emailError) {
        logger.error('Failed to send confirmation email:', emailError);
      }
    }

    logger.logBusiness('Tickets Purchased', {
      paymentId: payment.id,
      eventId: event_id,
      quantity,
      totalAmount,
      customerName: customer_name,
      paymentMethod: payment_method
    });

    res.status(201).json({
      success: true,
      message: 'Tickets purchased successfully',
      data: {
        payment: {
          id: payment.id,
          reference: payment.payment_reference,
          total_amount: totalAmount,
          status: payment.status
        },
        tickets: ticketUpdates.map((ticket, index) => ({
          id: ticket.id,
          ticket_number: ticket.ticket_number,
          qr_code: ticket.qr_code,
          qr_image: qrResult.qrCodes[index].qrImage,
          type: ticket_type,
          price: ticketPrice
        })),
        qr_codes: qrResult.qrCodes.map(qr => ({
          ticket_id: qr.ticketId,
          ticket_number: qr.ticketNumber,
          qr_image: qr.qrImage,
          download_url: `/api/v1/tickets/qr/${qr.ticketId}/download`
        }))
      }
    });

  } catch (error) {
    await trx.rollback();
    throw error;
  }
}));

/**
 * @swagger
 * /tickets/qr/{ticketId}/download:
 *   get:
 *     summary: Download QR code as PNG
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/qr/:ticketId/download', catchAsync(async (req, res) => {
  const { ticketId } = req.params;

  // Get ticket with QR code
  const ticket = await db('tickets')
    .where({ id: ticketId })
    .first();

  if (!ticket || !ticket.qr_code) {
    throw new AppError('Ticket or QR code not found', 404);
  }

  // Generate QR code buffer
  const qrResult = await qrService.generateTicketQR({
    ticket_id: ticket.id,
    ticket_number: ticket.ticket_number,
    event_id: ticket.event_id,
    user_id: ticket.user_id,
    ticket_type: ticket.ticket_type,
    seat_number: ticket.seat_number,
    section: ticket.section,
    row: ticket.row
  });

  res.set({
    'Content-Type': 'image/png',
    'Content-Disposition': `attachment; filename="ticket-${ticket.ticket_number}-qr.png"`
  });

  res.send(qrResult.qrCodeBuffer);
}));

/**
 * @swagger
 * /tickets/user/{userId}:
 *   get:
 *     summary: Get user tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.get('/user/:userId', authenticate, catchAsync(async (req, res) => {
  const { userId } = req.params;

  // Check if user can access these tickets
  if (req.user.id !== userId && !['super_admin', 'admin'].includes(req.user.role)) {
    throw new AppError('Access denied', 403);
  }

  const tickets = await db('tickets')
    .join('events', 'tickets.event_id', 'events.id')
    .join('venues', 'events.venue_id', 'venues.id')
    .select([
      'tickets.*',
      'events.title as event_title',
      'events.start_datetime',
      'events.end_datetime',
      'venues.name as venue_name',
      'venues.address as venue_address'
    ])
    .where('tickets.user_id', userId)
    .orderBy('tickets.purchased_at', 'desc');

  res.json({
    success: true,
    data: {
      tickets: tickets.map(ticket => ({
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        event: {
          title: ticket.event_title,
          start_datetime: ticket.start_datetime,
          end_datetime: ticket.end_datetime,
          venue: {
            name: ticket.venue_name,
            address: ticket.venue_address
          }
        },
        ticket_type: ticket.ticket_type,
        price: parseFloat(ticket.price),
        status: ticket.status,
        purchased_at: ticket.purchased_at,
        qr_download_url: `/api/v1/tickets/qr/${ticket.id}/download`
      }))
    }
  });
}));

module.exports = router;
