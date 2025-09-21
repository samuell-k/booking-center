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
 * /venues:
 *   get:
 *     summary: Get all venues
 *     tags: [Venues]
 */
router.get('/', catchAsync(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const venues = await db('venues')
        .select('*')
        .orderBy('name', 'asc')
        .limit(limit)
        .offset(offset);
    const total = await db('venues')
        .count('* as count')
        .first();
    res.json({
        success: true,
        data: {
            venues,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total.count),
                totalPages: Math.ceil(total.count / limit)
            }
        }
    });
}));
/**
 * @swagger
 * /venues/{id}:
 *   get:
 *     summary: Get venue by ID
 *     tags: [Venues]
 */
router.get('/:id', catchAsync(async (req, res) => {
    const venue = await db('venues')
        .where({ id: req.params.id })
        .first();
    if (!venue) {
        throw new AppError('Venue not found', 404);
    }
    res.json({
        success: true,
        data: { venue }
    });
}));
module.exports = router;
//# sourceMappingURL=venues.js.map