const express = require('express');
const { db } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const router = express.Router();
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, catchAsync(async (req, res) => {
    const notifications = [];
    res.json({
        success: true,
        data: { notifications }
    });
}));
module.exports = router;
//# sourceMappingURL=notifications.js.map