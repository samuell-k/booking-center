const express = require('express');
const { catchAsync } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /webhooks/payment:
 *   post:
 *     summary: Payment webhook
 *     tags: [Webhooks]
 */
router.post('/payment', catchAsync(async (req, res) => {
  logger.logInfo('Payment webhook received', req.body);
  
  res.json({
    success: true,
    message: 'Webhook received'
  });
}));

module.exports = router;
