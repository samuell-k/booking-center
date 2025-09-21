const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { db } = require('../config/database');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: sport
 *         schema:
 *           type: string
 *         description: Filter by sport
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 */
router.get('/', catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    sport, 
    status = 'active', 
    search,
    venue_id,
    team_id,
    start_date,
    end_date
  } = req.query;
  
  const offset = (page - 1) * limit;

  let query = db('events')
    .join('venues', 'events.venue_id', 'venues.id')
    .leftJoin('teams as home_team', 'events.home_team_id', 'home_team.id')
    .leftJoin('teams as away_team', 'events.away_team_id', 'away_team.id')
    .select([
      'events.*',
      'venues.name as venue_name',
      'venues.address as venue_address',
      'venues.capacity as venue_capacity',
      'home_team.name as home_team_name',
      'home_team.logo_url as home_team_logo',
      'away_team.name as away_team_name',
      'away_team.logo_url as away_team_logo'
    ]);

  // Apply filters
  if (sport) {
    query = query.where('events.sport', sport);
  }

  if (status) {
    query = query.where('events.status', status);
  }

  if (search) {
    query = query.where(function() {
      this.where('events.title', 'ilike', `%${search}%`)
          .orWhere('events.description', 'ilike', `%${search}%`);
    });
  }

  if (venue_id) {
    query = query.where('events.venue_id', venue_id);
  }

  if (team_id) {
    query = query.where(function() {
      this.where('events.home_team_id', team_id)
          .orWhere('events.away_team_id', team_id);
    });
  }

  if (start_date) {
    query = query.where('events.start_datetime', '>=', start_date);
  }

  if (end_date) {
    query = query.where('events.start_datetime', '<=', end_date);
  }

  // Get total count
  const totalQuery = query.clone();
  const [{ count: total }] = await totalQuery.count('events.id as count');

  // Get paginated results
  const events = await query
    .orderBy('events.start_datetime', 'asc')
    .limit(limit)
    .offset(offset);

  // Get ticket availability for each event
  const eventsWithAvailability = await Promise.all(
    events.map(async (event) => {
      const ticketStats = await db('tickets')
        .select(
          db.raw('COUNT(*) as total_tickets'),
          db.raw('COUNT(CASE WHEN status = \'sold\' THEN 1 END) as sold_tickets')
        )
        .where('event_id', event.id)
        .first();

      return {
        ...event,
        ticket_stats: {
          total: parseInt(ticketStats.total_tickets) || 0,
          sold: parseInt(ticketStats.sold_tickets) || 0,
          available: (parseInt(ticketStats.total_tickets) || 0) - (parseInt(ticketStats.sold_tickets) || 0)
        }
      };
    })
  );

  res.json({
    success: true,
    data: {
      events: eventsWithAvailability,
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
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 */
router.get('/:id', catchAsync(async (req, res) => {
  const event = await db('events')
    .join('venues', 'events.venue_id', 'venues.id')
    .leftJoin('teams as home_team', 'events.home_team_id', 'home_team.id')
    .leftJoin('teams as away_team', 'events.away_team_id', 'away_team.id')
    .select([
      'events.*',
      'venues.name as venue_name',
      'venues.address as venue_address',
      'venues.capacity as venue_capacity',
      'venues.facilities',
      'home_team.name as home_team_name',
      'home_team.logo_url as home_team_logo',
      'home_team.description as home_team_description',
      'away_team.name as away_team_name',
      'away_team.logo_url as away_team_logo',
      'away_team.description as away_team_description'
    ])
    .where('events.id', req.params.id)
    .first();

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Get ticket types and availability
  const ticketTypes = await db('tickets')
    .select([
      'ticket_type',
      'price',
      db.raw('COUNT(*) as total'),
      db.raw('COUNT(CASE WHEN status = \'available\' THEN 1 END) as available'),
      db.raw('COUNT(CASE WHEN status = \'sold\' THEN 1 END) as sold')
    ])
    .where('event_id', event.id)
    .groupBy('ticket_type', 'price')
    .orderBy('price', 'asc');

  res.json({
    success: true,
    data: {
      event: {
        ...event,
        ticket_types: ticketTypes.map(type => ({
          type: type.ticket_type,
          price: parseFloat(type.price),
          total: parseInt(type.total),
          available: parseInt(type.available),
          sold: parseInt(type.sold)
        }))
      }
    }
  });
}));

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, authorize(['super_admin', 'venue_admin']), [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('sport').isIn(['football', 'basketball', 'volleyball', 'tennis', 'rugby', 'athletics', 'other']),
  body('event_type').isIn(['match', 'tournament', 'training', 'friendly', 'concert', 'other']),
  body('start_datetime').isISO8601().withMessage('Invalid start datetime'),
  body('end_datetime').isISO8601().withMessage('Invalid end datetime'),
  body('venue_id').isUUID().withMessage('Invalid venue ID'),
  body('home_team_id').optional().isUUID(),
  body('away_team_id').optional().isUUID(),
  body('ticket_price_regular').isFloat({ min: 0 }).withMessage('Invalid regular ticket price'),
  body('ticket_price_vip').optional().isFloat({ min: 0 }),
  body('ticket_price_student').optional().isFloat({ min: 0 }),
  body('max_tickets_per_user').optional().isInt({ min: 1, max: 20 })
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
    title,
    description,
    sport,
    event_type,
    start_datetime,
    end_datetime,
    venue_id,
    home_team_id,
    away_team_id,
    ticket_price_regular,
    ticket_price_vip,
    ticket_price_student,
    max_tickets_per_user = 10,
    image_url
  } = req.body;

  // Validate datetime
  if (new Date(start_datetime) >= new Date(end_datetime)) {
    return res.status(400).json({
      success: false,
      message: 'End datetime must be after start datetime'
    });
  }

  // Check if venue exists
  const venue = await db('venues').where({ id: venue_id }).first();
  if (!venue) {
    throw new AppError('Venue not found', 404);
  }

  // Check if teams exist (if provided)
  if (home_team_id) {
    const homeTeam = await db('teams').where({ id: home_team_id }).first();
    if (!homeTeam) {
      throw new AppError('Home team not found', 404);
    }
  }

  if (away_team_id) {
    const awayTeam = await db('teams').where({ id: away_team_id }).first();
    if (!awayTeam) {
      throw new AppError('Away team not found', 404);
    }
  }

  const trx = await db.transaction();

  try {
    // Create event
    const [event] = await trx('events')
      .insert({
        title,
        description,
        sport,
        event_type,
        start_datetime,
        end_datetime,
        venue_id,
        home_team_id,
        away_team_id,
        max_tickets_per_user,
        image_url,
        status: 'active',
        created_by: req.user.id
      })
      .returning('*');

    // Create tickets based on venue capacity
    const ticketTypes = [
      { type: 'regular', price: ticket_price_regular, percentage: 0.7 },
      ...(ticket_price_vip ? [{ type: 'vip', price: ticket_price_vip, percentage: 0.2 }] : []),
      ...(ticket_price_student ? [{ type: 'student', price: ticket_price_student, percentage: 0.1 }] : [])
    ];

    const totalCapacity = venue.capacity;
    let ticketsCreated = 0;

    for (const ticketType of ticketTypes) {
      const typeCapacity = Math.floor(totalCapacity * ticketType.percentage);
      const tickets = [];

      for (let i = 1; i <= typeCapacity; i++) {
        tickets.push({
          event_id: event.id,
          ticket_type: ticketType.type,
          price: ticketType.price,
          seat_number: `${ticketType.type.toUpperCase()}-${String(i).padStart(4, '0')}`,
          status: 'available'
        });
      }

      if (tickets.length > 0) {
        await trx('tickets').insert(tickets);
        ticketsCreated += tickets.length;
      }
    }

    await trx.commit();

    logger.logBusiness('Event Created', {
      eventId: event.id,
      title: event.title,
      createdBy: req.user.id,
      ticketsCreated
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: {
        event: {
          ...event,
          tickets_created: ticketsCreated
        }
      }
    });

  } catch (error) {
    await trx.rollback();
    throw error;
  }
}));

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, authorize(['super_admin', 'venue_admin']), [
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('start_datetime').optional().isISO8601(),
  body('end_datetime').optional().isISO8601(),
  body('status').optional().isIn(['active', 'cancelled', 'postponed', 'completed'])
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const eventId = req.params.id;
  const updateData = { ...req.body, updated_at: new Date() };

  // Check if event exists
  const existingEvent = await db('events').where({ id: eventId }).first();
  if (!existingEvent) {
    throw new AppError('Event not found', 404);
  }

  // Authorization check for venue admin
  if (req.user.role === 'venue_admin') {
    const venue = await db('venues').where({ id: existingEvent.venue_id, admin_user_id: req.user.id }).first();
    if (!venue) {
      throw new AppError('Not authorized to update this event', 403);
    }
  }

  const [updatedEvent] = await db('events')
    .where({ id: eventId })
    .update(updateData)
    .returning('*');

  logger.logInfo('Event updated', {
    eventId,
    updatedBy: req.user.id,
    changes: Object.keys(updateData)
  });

  res.json({
    success: true,
    message: 'Event updated successfully',
    data: { event: updatedEvent }
  });
}));

module.exports = router;
