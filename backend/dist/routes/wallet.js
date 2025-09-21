const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const router = express.Router();
/**
 * @swagger
 * /wallet/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.get('/balance', authenticate, catchAsync(async (req, res) => {
    const wallet = await db('wallets')
        .where({ user_id: req.user.id })
        .first();
    if (!wallet) {
        throw new AppError('Wallet not found', 404);
    }
    res.json({
        success: true,
        data: {
            balance: parseFloat(wallet.balance),
            currency: 'RWF'
        }
    });
}));
/**
 * @swagger
 * /wallet/transactions:
 *   get:
 *     summary: Get wallet transactions
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.get('/transactions', authenticate, catchAsync(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const transactions = await db('wallet_transactions')
        .where({ user_id: req.user.id })
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset);
    const total = await db('wallet_transactions')
        .where({ user_id: req.user.id })
        .count('* as count')
        .first();
    res.json({
        success: true,
        data: {
            transactions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total.count),
                totalPages: Math.ceil(total.count / limit)
            }
        }
    });
}));
module.exports = router;
//# sourceMappingURL=wallet.js.map