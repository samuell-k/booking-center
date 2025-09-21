const knex = require('knex');
const logger = require('../utils/logger');

// Database configuration optimized for high-scale operations
const dbConfig = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'smartsports_rwanda',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // Connection-level optimizations
    application_name: 'smartsports-api',
    statement_timeout: 30000, // 30 seconds
    query_timeout: 30000,
    connectionTimeoutMillis: 10000,
    // Enable prepared statements
    options: '--enable_seqscan=off --enable_bitmapscan=off'
  },
  pool: {
    // Optimized pool settings for high concurrency
    min: process.env.NODE_ENV === 'production' ? 10 : 2,
    max: process.env.NODE_ENV === 'production' ? 50 : 10,
    createTimeoutMillis: 10000,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 300000, // 5 minutes
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
    propagateCreateError: false,
    // Connection validation
    afterCreate: function (conn, done) {
      // Set connection-level optimizations
      conn.query(`
        SET statement_timeout = '30s';
        SET lock_timeout = '10s';
        SET idle_in_transaction_session_timeout = '60s';
        SET search_path = public;
      `, function (err) {
        done(err, conn);
      });
    }
  },
  // Enable query debugging in development
  debug: process.env.NODE_ENV === 'development' && process.env.DEBUG_SQL === 'true',
  // Async stack traces for better debugging
  asyncStackTraces: process.env.NODE_ENV === 'development',
  migrations: {
    directory: './src/database/migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './src/database/seeds'
  },
  // Acquire connection timeout
  acquireConnectionTimeout: 60000
};

// Create database connections
const db = knex(dbConfig);

// Read replica configuration for scaling read operations
const readReplicaConfig = {
  ...dbConfig,
  connection: process.env.READ_REPLICA_URL || dbConfig.connection,
  pool: {
    ...dbConfig.pool,
    // Smaller pool for read replicas
    min: process.env.NODE_ENV === 'production' ? 5 : 1,
    max: process.env.NODE_ENV === 'production' ? 25 : 5,
  }
};

const readDb = process.env.READ_REPLICA_URL ? knex(readReplicaConfig) : db;

// Test database connection
async function connectDB() {
  try {
    await db.raw('SELECT 1+1 as result');
    logger.info('✅ PostgreSQL Database connected successfully');
    return db;
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

// Close database connection
async function closeDB() {
  try {
    await db.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error.message);
  }
}

// Database health check
async function checkDBHealth() {
  try {
    const result = await db.raw('SELECT NOW() as current_time');
    return {
      status: 'healthy',
      timestamp: result.rows[0].current_time,
      connection_count: await db.raw('SELECT count(*) FROM pg_stat_activity WHERE state = ?', ['active'])
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

// Transaction wrapper
async function withTransaction(callback) {
  const trx = await db.transaction();
  try {
    const result = await callback(trx);
    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

// Enhanced database operations with read/write splitting
const dbOperations = {
  // Generic CRUD operations
  async create(table, data, options = {}) {
    const trx = options.transaction;
    const query = trx ? trx(table) : db(table);
    const [result] = await query.insert(data).returning('*');
    return result;
  },

  async findById(table, id, useReadReplica = true) {
    const connection = useReadReplica ? readDb : db;
    return await connection(table).where('id', id).first();
  },

  async findOne(table, conditions, useReadReplica = true) {
    const connection = useReadReplica ? readDb : db;
    return await connection(table).where(conditions).first();
  },

  async findMany(table, conditions = {}, options = {}) {
    const connection = options.useReadReplica !== false ? readDb : db;
    let query = connection(table);

    if (Object.keys(conditions).length > 0) {
      query = query.where(conditions);
    }

    if (options.orderBy) {
      query = query.orderBy(options.orderBy.column, options.orderBy.direction || 'asc');
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.offset(options.offset);
    }

    return await query;
  },

  async update(table, id, data, options = {}) {
    const trx = options.transaction;
    const query = trx ? trx(table) : db(table);
    const [result] = await query
      .where('id', id)
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return result;
  },

  async delete(table, id, options = {}) {
    const trx = options.transaction;
    const query = trx ? trx(table) : db(table);
    return await query.where('id', id).del();
  },

  async count(table, conditions = {}, useReadReplica = true) {
    const connection = useReadReplica ? readDb : db;
    const result = await connection(table).where(conditions).count('* as count');
    return parseInt(result[0].count);
  },

  // Enhanced pagination with read replica support
  async paginate(table, conditions = {}, page = 1, limit = 10, orderBy = 'created_at', direction = 'desc', useReadReplica = true) {
    const connection = useReadReplica ? readDb : db;
    const offset = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      connection(table)
        .where(conditions)
        .orderBy(orderBy, direction)
        .limit(limit)
        .offset(offset),
      connection(table).where(conditions).count('* as count')
    ]);

    const total = parseInt(totalCount[0].count);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  },

  // Bulk operations for better performance
  async bulkInsert(table, data, options = {}) {
    const trx = options.transaction;
    const query = trx ? trx(table) : db(table);
    const chunkSize = options.chunkSize || 1000;

    if (data.length <= chunkSize) {
      return await query.insert(data).returning('*');
    }

    const results = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const chunkResults = await query.insert(chunk).returning('*');
      results.push(...chunkResults);
    }

    return results;
  },

  async bulkUpdate(table, updates, options = {}) {
    const trx = options.transaction;
    const query = trx ? trx(table) : db(table);

    const results = [];
    for (const update of updates) {
      const { id, data } = update;
      const [result] = await query
        .where('id', id)
        .update({ ...data, updated_at: db.fn.now() })
        .returning('*');
      results.push(result);
    }

    return results;
  }
};

// Database schema validation
async function validateSchema() {
  try {
    const tables = [
      'users', 'teams', 'venues', 'events', 'tickets', 'payments',
      'wallets', 'wallet_transactions', 'notifications', 'analytics',
      'qr_codes', 'scanner_logs', 'user_sessions'
    ];
    
    for (const table of tables) {
      const exists = await db.schema.hasTable(table);
      if (!exists) {
        logger.warn(`⚠️  Table '${table}' does not exist`);
      }
    }
    
    logger.info('✅ Database schema validation completed');
  } catch (error) {
    logger.error('❌ Database schema validation failed:', error.message);
  }
}

// Prepared statements for frequently used queries
const preparedStatements = {
  // Event queries
  findEventById: db.raw('SELECT * FROM events WHERE id = ? AND status = ?'),
  findAvailableTickets: db.raw(`
    SELECT * FROM tickets
    WHERE event_id = ? AND status = 'available' AND ticket_type = ?
    LIMIT ?
  `),

  // Payment queries
  findPaymentByReference: db.raw('SELECT * FROM payments WHERE payment_reference = ?'),
  updatePaymentStatus: db.raw(`
    UPDATE payments
    SET status = ?, completed_at = CASE WHEN ? = 'completed' THEN NOW() ELSE completed_at END,
        failed_at = CASE WHEN ? = 'failed' THEN NOW() ELSE failed_at END
    WHERE id = ?
    RETURNING *
  `),

  // User queries
  findUserByEmail: db.raw('SELECT * FROM users WHERE email = ? AND status = ?'),
  findUserByPhone: db.raw('SELECT * FROM users WHERE phone = ? AND status = ?'),

  // Ticket queries
  findTicketByQR: db.raw('SELECT * FROM tickets WHERE qr_code = ? AND status = ?'),
  updateTicketStatus: db.raw(`
    UPDATE tickets
    SET status = ?, used_at = CASE WHEN ? = 'used' THEN NOW() ELSE used_at END
    WHERE id = ?
    RETURNING *
  `)
};

// Query optimization utilities
const queryOptimizer = {
  // Explain query performance
  async explainQuery(query) {
    try {
      const explanation = await db.raw(`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`);
      return explanation.rows[0]['QUERY PLAN'][0];
    } catch (error) {
      logger.error('Query explanation failed:', error);
      return null;
    }
  },

  // Get table statistics
  async getTableStats(tableName) {
    try {
      const stats = await db.raw(`
        SELECT
          schemaname,
          tablename,
          attname,
          n_distinct,
          correlation,
          most_common_vals,
          most_common_freqs
        FROM pg_stats
        WHERE tablename = ?
      `, [tableName]);

      return stats.rows;
    } catch (error) {
      logger.error('Failed to get table stats:', error);
      return [];
    }
  },

  // Get slow queries
  async getSlowQueries(limit = 10) {
    try {
      const slowQueries = await db.raw(`
        SELECT
          query,
          calls,
          total_time,
          mean_time,
          rows,
          100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
        FROM pg_stat_statements
        ORDER BY total_time DESC
        LIMIT ?
      `, [limit]);

      return slowQueries.rows;
    } catch (error) {
      logger.error('Failed to get slow queries:', error);
      return [];
    }
  }
};

// Connection monitoring
const connectionMonitor = {
  async getConnectionStats() {
    try {
      const stats = await db.raw(`
        SELECT
          state,
          COUNT(*) as count,
          AVG(EXTRACT(EPOCH FROM (now() - state_change))) as avg_duration
        FROM pg_stat_activity
        WHERE datname = current_database()
        GROUP BY state
      `);

      return stats.rows;
    } catch (error) {
      logger.error('Failed to get connection stats:', error);
      return [];
    }
  },

  async getActiveQueries() {
    try {
      const queries = await db.raw(`
        SELECT
          pid,
          usename,
          application_name,
          client_addr,
          state,
          query_start,
          state_change,
          query
        FROM pg_stat_activity
        WHERE datname = current_database()
          AND state != 'idle'
          AND query NOT LIKE '%pg_stat_activity%'
        ORDER BY query_start
      `);

      return queries.rows;
    } catch (error) {
      logger.error('Failed to get active queries:', error);
      return [];
    }
  }
};

// Export database instance and utilities
module.exports = {
  db,
  readDb,
  connectDB,
  closeDB,
  checkDBHealth,
  withTransaction,
  dbOperations,
  validateSchema,
  preparedStatements,
  queryOptimizer,
  connectionMonitor
};
