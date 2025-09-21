const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const QRService = require('../services/qrService');
const logger = require('../utils/logger');

const router = express.Router();
const qrService = QRService;

/**
 * @swagger
 * /scanner/validate:
 *   post:
 *     summary: Validate QR code
 *     tags: [Scanner]
 *     security:
 *       - bearerAuth: []
 */
router.post('/validate', authenticate, authorize(['super_admin', 'scanner']), [
  body('qr_code').notEmpty().withMessage('QR code required')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { qr_code } = req.body;

  try {
    const qrData = JSON.parse(qr_code);
    const isValid = qrService.verifySignature(qrData, qrData.sig);

    if (!isValid) {
      throw new AppError('Invalid QR code signature', 400);
    }

    // Check if ticket exists and is valid
    const ticket = await db('tickets')
      .where({ id: qrData.id })
      .first();

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    if (ticket.status === 'used') {
      throw new AppError('Ticket already used', 400);
    }

    res.json({
      success: true,
      data: {
        valid: true,
        ticket: {
          id: ticket.id,
          ticket_number: ticket.ticket_number,
          event_id: ticket.event_id,
          ticket_type: ticket.ticket_type,
          status: ticket.status
        }
      }
    });

  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AppError('Invalid QR code format', 400);
    }
    throw error;
  }
}));

/**
 * @swagger
 * /scanner/scan:
 *   post:
 *     summary: Process ticket scan
 *     tags: [Scanner]
 *     security:
 *       - bearerAuth: []
 */
router.post('/scan', authenticate, authorize(['super_admin', 'scanner']), [
  body('ticket_id').isUUID().withMessage('Valid ticket ID required'),
  body('scanner_location').optional().trim()
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { ticket_id, scanner_location } = req.body;

  const trx = await db.transaction();

  try {
    // Get and update ticket
    const ticket = await trx('tickets')
      .where({ id: ticket_id })
      .first();

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    if (ticket.status === 'used') {
      throw new AppError('Ticket already used', 400);
    }

    // Mark ticket as used
    await trx('tickets')
      .where({ id: ticket_id })
      .update({
        status: 'used',
        used_at: new Date(),
        used_by_scanner: req.user.id,
        scanner_location: scanner_location || 'Main Entrance'
      });

    // Log the scan
    await trx('scanner_logs').insert({
      ticket_id,
      scanner_user_id: req.user.id,
      scan_result: 'success',
      scan_location: scanner_location || 'Main Entrance',
      scanned_at: new Date()
    });

    await trx.commit();

    logger.logBusiness('Ticket Scanned', {
      ticketId: ticket_id,
      scannerId: req.user.id,
      location: scanner_location
    });

    res.json({
      success: true,
      message: 'Ticket scanned successfully',
      data: {
        ticket: {
          id: ticket.id,
          ticket_number: ticket.ticket_number,
          status: 'used',
          used_at: new Date()
        }
      }
    });

  } catch (error) {
    await trx.rollback();
    throw error;
  }
}));

module.exports = router;
