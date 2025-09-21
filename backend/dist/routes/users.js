const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { db } = require('../config/database');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const router = express.Router();
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/profile', authenticate, catchAsync(async (req, res) => {
    const user = await db('users')
        .select([
        'id', 'first_name', 'last_name', 'email', 'phone', 'avatar_url',
        'date_of_birth', 'gender', 'city', 'province', 'country',
        'email_verified', 'phone_verified', 'role', 'created_at'
    ])
        .where({ id: req.user.id })
        .first();
    if (!user) {
        throw new AppError('User not found', 404);
    }
    res.json({
        success: true,
        data: { user }
    });
}));
/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put('/profile', authenticate, [
    body('first_name').optional().trim().isLength({ min: 2, max: 100 }),
    body('last_name').optional().trim().isLength({ min: 2, max: 100 }),
    body('phone').optional().isMobilePhone('rw-RW'),
    body('date_of_birth').optional().isISO8601(),
    body('gender').optional().isIn(['male', 'female', 'other']),
], catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    const allowedFields = [
        'first_name', 'last_name', 'phone', 'date_of_birth', 'gender',
        'address_line1', 'address_line2', 'city', 'province', 'country'
    ];
    const updateData = {};
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No valid fields to update'
        });
    }
    updateData.updated_at = new Date();
    const [updatedUser] = await db('users')
        .where({ id: req.user.id })
        .update(updateData)
        .returning([
        'id', 'first_name', 'last_name', 'email', 'phone', 'avatar_url',
        'date_of_birth', 'gender', 'city', 'province', 'country'
    ]);
    logger.logInfo('User profile updated', {
        userId: req.user.id,
        updatedFields: Object.keys(updateData)
    });
    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
    });
}));
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, authorize('super_admin'), catchAsync(async (req, res) => {
    const { page = 1, limit = 20, search, status, role } = req.query;
    const offset = (page - 1) * limit;
    let query = db('users').select([
        'id', 'first_name', 'last_name', 'email', 'phone', 'role', 'status',
        'email_verified', 'phone_verified', 'created_at', 'last_login'
    ]);
    // Apply filters
    if (search) {
        query = query.where(function () {
            this.where('first_name', 'ilike', `%${search}%`)
                .orWhere('last_name', 'ilike', `%${search}%`)
                .orWhere('email', 'ilike', `%${search}%`);
        });
    }
    if (status) {
        query = query.where('status', status);
    }
    if (role) {
        query = query.where('role', role);
    }
    // Get total count
    const totalQuery = query.clone();
    const [{ count: total }] = await totalQuery.count('* as count');
    // Get paginated results
    const users = await query
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset);
    res.json({
        success: true,
        data: {
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total),
                totalPages: Math.ceil(total / limit)
            }
        }
    });
}));
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticate, authorize('super_admin'), catchAsync(async (req, res) => {
    const user = await db('users')
        .select([
        'id', 'first_name', 'last_name', 'email', 'phone', 'avatar_url',
        'date_of_birth', 'gender', 'address_line1', 'address_line2',
        'city', 'province', 'country', 'role', 'status', 'email_verified',
        'phone_verified', 'created_at', 'updated_at', 'last_login'
    ])
        .where({ id: req.params.id })
        .first();
    if (!user) {
        throw new AppError('User not found', 404);
    }
    // Get user statistics
    const stats = await db('tickets')
        .select(db.raw('COUNT(*) as total_tickets'), db.raw('SUM(total_amount) as total_spent'))
        .where('user_id', user.id)
        .first();
    res.json({
        success: true,
        data: {
            user: {
                ...user,
                stats: {
                    totalTickets: parseInt(stats.total_tickets) || 0,
                    totalSpent: parseFloat(stats.total_spent) || 0
                }
            }
        }
    });
}));
/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Update user status (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', authenticate, authorize('super_admin'), [
    body('status').isIn(['active', 'inactive', 'suspended', 'banned']).withMessage('Invalid status')
], catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    const { status } = req.body;
    const userId = req.params.id;
    const [updatedUser] = await db('users')
        .where({ id: userId })
        .update({ status, updated_at: new Date() })
        .returning(['id', 'first_name', 'last_name', 'email', 'status']);
    if (!updatedUser) {
        throw new AppError('User not found', 404);
    }
    logger.logInfo('User status updated', {
        adminId: req.user.id,
        userId,
        newStatus: status
    });
    res.json({
        success: true,
        message: 'User status updated successfully',
        data: { user: updatedUser }
    });
}));
/**
 * @swagger
 * /users/stats:
 *   get:
 *     summary: Get user statistics (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats/overview', authenticate, authorize('super_admin'), catchAsync(async (req, res) => {
    const stats = await db('users')
        .select(db.raw('COUNT(*) as total_users'), db.raw('COUNT(CASE WHEN status = \'active\' THEN 1 END) as active_users'), db.raw('COUNT(CASE WHEN created_at >= NOW() - INTERVAL \'30 days\' THEN 1 END) as new_users_30d'), db.raw('COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users'))
        .first();
    const roleStats = await db('users')
        .select('role')
        .count('* as count')
        .groupBy('role');
    res.json({
        success: true,
        data: {
            overview: {
                totalUsers: parseInt(stats.total_users),
                activeUsers: parseInt(stats.active_users),
                newUsers30d: parseInt(stats.new_users_30d),
                verifiedUsers: parseInt(stats.verified_users)
            },
            roleDistribution: roleStats.reduce((acc, item) => {
                acc[item.role] = parseInt(item.count);
                return acc;
            }, {})
        }
    });
}));
module.exports = router;
//# sourceMappingURL=users.js.map