const { cache, redis } = require('../config/redis');
const { db } = require('../config/database');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.DEFAULT_TTL = 3600; // 1 hour
    this.SHORT_TTL = 300; // 5 minutes
    this.LONG_TTL = 86400; // 24 hours
  }

  /**
   * Cache events with smart invalidation
   */
  async cacheEvent(eventId, ttl = this.DEFAULT_TTL) {
    try {
      const event = await db('events')
        .leftJoin('venues', 'events.venue_id', 'venues.id')
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
        ])
        .where('events.id', eventId)
        .first();

      if (event) {
        const cacheKey = `event:${eventId}`;
        await cache.set(cacheKey, event, ttl);
        
        // Cache event in multiple indexes for different query patterns
        await Promise.all([
          cache.sadd(`events:sport:${event.sport}`, eventId),
          cache.sadd(`events:venue:${event.venue_id}`, eventId),
          cache.sadd(`events:status:${event.status}`, eventId),
          cache.expire(`events:sport:${event.sport}`, ttl),
          cache.expire(`events:venue:${event.venue_id}`, ttl),
          cache.expire(`events:status:${event.status}`, ttl)
        ]);

        return event;
      }
      
      return null;
    } catch (error) {
      logger.error('Failed to cache event:', error);
      return null;
    }
  }

  /**
   * Get cached event or fetch from database
   */
  async getEvent(eventId) {
    const cacheKey = `event:${eventId}`;
    let event = await cache.get(cacheKey);
    
    if (!event) {
      event = await this.cacheEvent(eventId);
    }
    
    return event;
  }

  /**
   * Cache event list with pagination
   */
  async cacheEventList(filters = {}, page = 1, limit = 20) {
    const cacheKey = `events:list:${JSON.stringify(filters)}:${page}:${limit}`;
    
    let result = await cache.get(cacheKey);
    if (result) {
      return result;
    }

    try {
      let query = db('events')
        .leftJoin('venues', 'events.venue_id', 'venues.id')
        .select([
          'events.id',
          'events.title',
          'events.start_datetime',
          'events.end_datetime',
          'events.sport',
          'events.status',
          'events.regular_price',
          'events.vip_price',
          'events.tickets_available_count',
          'events.image_url',
          'venues.name as venue_name',
          'venues.city as venue_city'
        ]);

      // Apply filters
      if (filters.sport) {
        query = query.where('events.sport', filters.sport);
      }
      if (filters.status) {
        query = query.where('events.status', filters.status);
      }
      if (filters.venue_id) {
        query = query.where('events.venue_id', filters.venue_id);
      }
      if (filters.date_from) {
        query = query.where('events.start_datetime', '>=', filters.date_from);
      }
      if (filters.date_to) {
        query = query.where('events.start_datetime', '<=', filters.date_to);
      }

      const offset = (page - 1) * limit;
      const [events, totalCount] = await Promise.all([
        query.orderBy('events.start_datetime', 'asc').limit(limit).offset(offset),
        db('events').where(filters).count('* as count')
      ]);

      result = {
        events,
        pagination: {
          page,
          limit,
          total: parseInt(totalCount[0].count),
          totalPages: Math.ceil(parseInt(totalCount[0].count) / limit)
        }
      };

      // Cache for shorter time for dynamic lists
      await cache.set(cacheKey, result, this.SHORT_TTL);
      return result;

    } catch (error) {
      logger.error('Failed to cache event list:', error);
      return { events: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }
  }

  /**
   * Cache ticket availability for an event
   */
  async cacheTicketAvailability(eventId) {
    try {
      const availability = await db('tickets')
        .select('ticket_type')
        .count('* as total')
        .sum(db.raw("CASE WHEN status = 'available' THEN 1 ELSE 0 END as available"))
        .sum(db.raw("CASE WHEN status = 'sold' THEN 1 ELSE 0 END as sold"))
        .where('event_id', eventId)
        .groupBy('ticket_type');

      const cacheKey = `tickets:availability:${eventId}`;
      await cache.set(cacheKey, availability, this.SHORT_TTL);

      // Also cache individual counts for quick access
      for (const item of availability) {
        await Promise.all([
          cache.set(`tickets:available:${eventId}:${item.ticket_type}`, item.available, this.SHORT_TTL),
          cache.set(`tickets:sold:${eventId}:${item.ticket_type}`, item.sold, this.SHORT_TTL)
        ]);
      }

      return availability;
    } catch (error) {
      logger.error('Failed to cache ticket availability:', error);
      return [];
    }
  }

  /**
   * Cache user profile with related data
   */
  async cacheUserProfile(userId) {
    try {
      const user = await db('users')
        .leftJoin('wallets', 'users.id', 'wallets.user_id')
        .select([
          'users.id',
          'users.first_name',
          'users.last_name',
          'users.email',
          'users.phone',
          'users.avatar_url',
          'users.status',
          'users.role',
          'users.total_tickets_purchased',
          'users.total_amount_spent',
          'wallets.balance as wallet_balance',
          'wallets.wallet_number'
        ])
        .where('users.id', userId)
        .first();

      if (user) {
        const cacheKey = `user:profile:${userId}`;
        await cache.set(cacheKey, user, this.DEFAULT_TTL);
        return user;
      }

      return null;
    } catch (error) {
      logger.error('Failed to cache user profile:', error);
      return null;
    }
  }

  /**
   * Cache payment statistics
   */
  async cachePaymentStats(period = 'daily') {
    try {
      let dateFilter;
      let cacheKey = `stats:payments:${period}`;
      
      switch (period) {
        case 'daily':
          dateFilter = db.raw("DATE(completed_at) = CURRENT_DATE");
          break;
        case 'weekly':
          dateFilter = db.raw("completed_at >= CURRENT_DATE - INTERVAL '7 days'");
          break;
        case 'monthly':
          dateFilter = db.raw("completed_at >= CURRENT_DATE - INTERVAL '30 days'");
          break;
        default:
          dateFilter = db.raw("DATE(completed_at) = CURRENT_DATE");
      }

      const stats = await db('payments')
        .select([
          db.raw('COUNT(*) as total_transactions'),
          db.raw('SUM(total_amount) as total_revenue'),
          db.raw('AVG(total_amount) as average_transaction'),
          db.raw('COUNT(DISTINCT user_id) as unique_customers')
        ])
        .where('status', 'completed')
        .where(dateFilter)
        .first();

      await cache.set(cacheKey, stats, this.SHORT_TTL);
      return stats;

    } catch (error) {
      logger.error('Failed to cache payment stats:', error);
      return null;
    }
  }

  /**
   * Invalidate cache for an event and related data
   */
  async invalidateEventCache(eventId) {
    try {
      const keys = [
        `event:${eventId}`,
        `tickets:availability:${eventId}`,
        `tickets:available:${eventId}:*`,
        `tickets:sold:${eventId}:*`,
        `reserved:${eventId}:*`
      ];

      // Use pipeline for better performance
      const pipeline = redis.pipeline();
      
      for (const key of keys) {
        if (key.includes('*')) {
          // Handle wildcard patterns
          const matchingKeys = await redis.keys(key);
          matchingKeys.forEach(k => pipeline.del(k));
        } else {
          pipeline.del(key);
        }
      }

      await pipeline.exec();

      // Also invalidate event lists that might contain this event
      await this.invalidateEventListCache();

      logger.info(`Cache invalidated for event ${eventId}`);
    } catch (error) {
      logger.error('Failed to invalidate event cache:', error);
    }
  }

  /**
   * Invalidate event list caches
   */
  async invalidateEventListCache() {
    try {
      const pattern = 'events:list:*';
      const keys = await redis.keys(pattern);
      
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error('Failed to invalidate event list cache:', error);
    }
  }

  /**
   * Invalidate user cache
   */
  async invalidateUserCache(userId) {
    try {
      const keys = [
        `user:profile:${userId}`,
        `user_reservation:${userId}:*`,
        `session:${userId}`
      ];

      const pipeline = redis.pipeline();
      
      for (const key of keys) {
        if (key.includes('*')) {
          const matchingKeys = await redis.keys(key);
          matchingKeys.forEach(k => pipeline.del(k));
        } else {
          pipeline.del(key);
        }
      }

      await pipeline.exec();
      logger.info(`Cache invalidated for user ${userId}`);
    } catch (error) {
      logger.error('Failed to invalidate user cache:', error);
    }
  }

  /**
   * Warm up cache with frequently accessed data
   */
  async warmUpCache() {
    try {
      logger.info('Starting cache warm-up...');

      // Cache upcoming events
      const upcomingEvents = await db('events')
        .where('start_datetime', '>', new Date())
        .where('status', 'published')
        .orderBy('start_datetime', 'asc')
        .limit(50)
        .select('id');

      for (const event of upcomingEvents) {
        await this.cacheEvent(event.id);
        await this.cacheTicketAvailability(event.id);
      }

      // Cache popular events list
      await this.cacheEventList({ status: 'published' }, 1, 20);

      // Cache payment statistics
      await Promise.all([
        this.cachePaymentStats('daily'),
        this.cachePaymentStats('weekly'),
        this.cachePaymentStats('monthly')
      ]);

      logger.info('Cache warm-up completed');
    } catch (error) {
      logger.error('Failed to warm up cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    try {
      const info = await redis.info('memory');
      const keyspace = await redis.info('keyspace');
      
      return {
        memory: info,
        keyspace: keyspace,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to get cache stats:', error);
      return null;
    }
  }
}

module.exports = new CacheService();
