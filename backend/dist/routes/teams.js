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
 * /teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 */
router.get('/', catchAsync(async (req, res) => {
    const { sport, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = db('teams').select('*');
    if (sport) {
        query = query.where('sport', sport);
    }
    const teams = await query
        .orderBy('name', 'asc')
        .limit(limit)
        .offset(offset);
    const total = await db('teams')
        .count('* as count')
        .where(sport ? { sport } : {})
        .first();
    res.json({
        success: true,
        data: {
            teams,
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
 * /teams/{id}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Teams]
 */
router.get('/:id', catchAsync(async (req, res) => {
    const team = await db('teams')
        .where({ id: req.params.id })
        .first();
    if (!team) {
        throw new AppError('Team not found', 404);
    }
    res.json({
        success: true,
        data: { team }
    });
}));
module.exports = router;
//# sourceMappingURL=teams.js.map