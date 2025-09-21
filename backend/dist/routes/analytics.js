const express = require('express');
const { db } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const router = express.Router();
/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/dashboard', authenticate, authorize(['super_admin', 'admin']), catchAsync(async (req, res) => {
    // Basic analytics for now
    const stats = {
        totalEvents: 0,
        totalTickets: 0,
        totalRevenue: 0,
        activeUsers: 0
    };
    res.json({
        success: true,
        data: { stats }
    });
}));
module.exports = router;
//# sourceMappingURL=analytics.js.map