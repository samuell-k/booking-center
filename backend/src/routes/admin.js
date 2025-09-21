const express = require('express');
const { db } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get admin statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', authenticate, authorize(['super_admin']), catchAsync(async (req, res) => {
  const stats = {
    totalUsers: 0,
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: 0
  };

  res.json({
    success: true,
    data: { stats }
  });
}));

module.exports = router;
