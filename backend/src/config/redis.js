const Redis = require('ioredis');
const logger = require('../utils/logger');

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
  retryDelayOnClusterDown: 300,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  showFriendlyErrorStack: process.env.NODE_ENV === 'development'
};

// Create Redis client
const redis = new Redis(redisConfig);

// Redis event handlers
redis.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

redis.on('ready', () => {
  logger.info('✅ Redis ready to accept commands');
});

redis.on('error', (error) => {
  logger.error('❌ Redis connection error:', error.message);
});

redis.on('close', () => {
  logger.warn('⚠️  Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('🔄 Redis reconnecting...');
});

// Connect to Redis
async function connectRedis() {
  try {
    await redis.connect();
    return redis;
  } catch (error) {
    logger.error('❌ Failed to connect to Redis:', error.message);
    throw error;
  }
}

// Redis health check
async function checkRedisHealth() {
  try {
    const pong = await redis.ping();
    const info = await redis.info('server');
    return {
      status: 'healthy',
      ping: pong,
      server_info: info
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

// Cache utilities
const cache = {
  // Set cache with expiration
  async set(key, value, ttl = 3600) {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await redis.setex(key, ttl, serializedValue);
      } else {
        await redis.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      logger.error('Cache set error:', error.message);
      return false;
    }
  },

  // Get cache
  async get(key) {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', error.message);
      return null;
    }
  },

  // Delete cache
  async del(key) {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error.message);
      return false;
    }
  },

  // Check if key exists
  async exists(key) {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error.message);
      return false;
    }
  },

  // Set expiration
  async expire(key, ttl) {
    try {
      await redis.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error('Cache expire error:', error.message);
      return false;
    }
  },

  // Get multiple keys
  async mget(keys) {
    try {
      const values = await redis.mget(keys);
      return values.map(value => value ? JSON.parse(value) : null);
    } catch (error) {
      logger.error('Cache mget error:', error.message);
      return [];
    }
  },

  // Set multiple keys
  async mset(keyValuePairs, ttl = 3600) {
    try {
      const pipeline = redis.pipeline();
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        const serializedValue = JSON.stringify(value);
        pipeline.setex(key, ttl, serializedValue);
      }
      
      await pipeline.exec();
      return true;
    } catch (error) {
      logger.error('Cache mset error:', error.message);
      return false;
    }
  },

  // Increment counter
  async incr(key, amount = 1) {
    try {
      return await redis.incrby(key, amount);
    } catch (error) {
      logger.error('Cache incr error:', error.message);
      return 0;
    }
  },

  // Add to set
  async sadd(key, ...members) {
    try {
      return await redis.sadd(key, ...members);
    } catch (error) {
      logger.error('Cache sadd error:', error.message);
      return 0;
    }
  },

  // Get set members
  async smembers(key) {
    try {
      return await redis.smembers(key);
    } catch (error) {
      logger.error('Cache smembers error:', error.message);
      return [];
    }
  },

  // Remove from set
  async srem(key, ...members) {
    try {
      return await redis.srem(key, ...members);
    } catch (error) {
      logger.error('Cache srem error:', error.message);
      return 0;
    }
  }
};

// Session management
const session = {
  // Create user session
  async create(userId, sessionData, ttl = 86400) {
    const sessionKey = `session:${userId}`;
    return await cache.set(sessionKey, sessionData, ttl);
  },

  // Get user session
  async get(userId) {
    const sessionKey = `session:${userId}`;
    return await cache.get(sessionKey);
  },

  // Update user session
  async update(userId, sessionData, ttl = 86400) {
    const sessionKey = `session:${userId}`;
    return await cache.set(sessionKey, sessionData, ttl);
  },

  // Delete user session
  async destroy(userId) {
    const sessionKey = `session:${userId}`;
    return await cache.del(sessionKey);
  },

  // Check if session exists
  async exists(userId) {
    const sessionKey = `session:${userId}`;
    return await cache.exists(sessionKey);
  }
};

// Rate limiting utilities
const rateLimit = {
  // Check rate limit
  async check(key, limit, window) {
    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, window);
      }
      return {
        current,
        remaining: Math.max(0, limit - current),
        resetTime: await redis.ttl(key)
      };
    } catch (error) {
      logger.error('Rate limit check error:', error.message);
      return { current: 0, remaining: limit, resetTime: window };
    }
  },

  // Reset rate limit
  async reset(key) {
    return await cache.del(key);
  }
};

// Pub/Sub utilities
const pubsub = {
  // Publish message
  async publish(channel, message) {
    try {
      const serializedMessage = JSON.stringify(message);
      return await redis.publish(channel, serializedMessage);
    } catch (error) {
      logger.error('PubSub publish error:', error.message);
      return 0;
    }
  },

  // Subscribe to channel
  subscribe(channel, callback) {
    const subscriber = new Redis(redisConfig);
    subscriber.subscribe(channel);
    subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        try {
          const parsedMessage = JSON.parse(message);
          callback(parsedMessage);
        } catch (error) {
          logger.error('PubSub message parse error:', error.message);
        }
      }
    });
    return subscriber;
  }
};

// Close Redis connection
async function closeRedis() {
  try {
    await redis.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis connection:', error.message);
  }
}

module.exports = {
  redis,
  connectRedis,
  closeRedis,
  checkRedisHealth,
  cache,
  session,
  rateLimit,
  pubsub
};
