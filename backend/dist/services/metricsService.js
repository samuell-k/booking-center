const client = require('prom-client');
const { db } = require('../config/database');
const { redis } = require('../config/redis');
const logger = require('../utils/logger');
class MetricsService {
    constructor() {
        // Create a Registry to register the metrics
        this.register = new client.Registry();
        // Add default metrics
        client.collectDefaultMetrics({
            register: this.register,
            prefix: 'smartsports_',
        });
        this.initializeMetrics();
    }
    initializeMetrics() {
        // HTTP Request metrics
        this.httpRequestDuration = new client.Histogram({
            name: 'smartsports_http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
        });
        this.httpRequestTotal = new client.Counter({
            name: 'smartsports_http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status_code']
        });
        // Database metrics
        this.dbConnectionsActive = new client.Gauge({
            name: 'smartsports_db_connections_active',
            help: 'Number of active database connections'
        });
        this.dbQueryDuration = new client.Histogram({
            name: 'smartsports_db_query_duration_seconds',
            help: 'Duration of database queries in seconds',
            labelNames: ['operation', 'table'],
            buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5]
        });
        this.dbQueryTotal = new client.Counter({
            name: 'smartsports_db_queries_total',
            help: 'Total number of database queries',
            labelNames: ['operation', 'table', 'status']
        });
        // Redis metrics
        this.redisConnectionsActive = new client.Gauge({
            name: 'smartsports_redis_connections_active',
            help: 'Number of active Redis connections'
        });
        this.redisCacheHits = new client.Counter({
            name: 'smartsports_redis_cache_hits_total',
            help: 'Total number of Redis cache hits',
            labelNames: ['operation']
        });
        this.redisCacheMisses = new client.Counter({
            name: 'smartsports_redis_cache_misses_total',
            help: 'Total number of Redis cache misses',
            labelNames: ['operation']
        });
        // Business metrics
        this.ticketsSold = new client.Counter({
            name: 'smartsports_tickets_sold_total',
            help: 'Total number of tickets sold',
            labelNames: ['event_id', 'ticket_type']
        });
        this.paymentsProcessed = new client.Counter({
            name: 'smartsports_payments_processed_total',
            help: 'Total number of payments processed',
            labelNames: ['payment_method', 'status']
        });
        this.paymentAmount = new client.Histogram({
            name: 'smartsports_payment_amount_rwf',
            help: 'Payment amounts in RWF',
            labelNames: ['payment_method', 'status'],
            buckets: [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000]
        });
        this.reservationsActive = new client.Gauge({
            name: 'smartsports_reservations_active',
            help: 'Number of active seat reservations'
        });
        this.fraudScore = new client.Histogram({
            name: 'smartsports_fraud_score',
            help: 'Fraud scores for payments',
            labelNames: ['payment_method'],
            buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        });
        // System metrics
        this.errorRate = new client.Counter({
            name: 'smartsports_errors_total',
            help: 'Total number of errors',
            labelNames: ['type', 'severity']
        });
        this.activeUsers = new client.Gauge({
            name: 'smartsports_active_users',
            help: 'Number of active users'
        });
        // Register all metrics
        this.register.registerMetric(this.httpRequestDuration);
        this.register.registerMetric(this.httpRequestTotal);
        this.register.registerMetric(this.dbConnectionsActive);
        this.register.registerMetric(this.dbQueryDuration);
        this.register.registerMetric(this.dbQueryTotal);
        this.register.registerMetric(this.redisConnectionsActive);
        this.register.registerMetric(this.redisCacheHits);
        this.register.registerMetric(this.redisCacheMisses);
        this.register.registerMetric(this.ticketsSold);
        this.register.registerMetric(this.paymentsProcessed);
        this.register.registerMetric(this.paymentAmount);
        this.register.registerMetric(this.reservationsActive);
        this.register.registerMetric(this.fraudScore);
        this.register.registerMetric(this.errorRate);
        this.register.registerMetric(this.activeUsers);
    }
    // HTTP Request metrics
    recordHttpRequest(method, route, statusCode, duration) {
        this.httpRequestDuration
            .labels(method, route, statusCode)
            .observe(duration);
        this.httpRequestTotal
            .labels(method, route, statusCode)
            .inc();
    }
    // Database metrics
    recordDbQuery(operation, table, duration, status = 'success') {
        this.dbQueryDuration
            .labels(operation, table)
            .observe(duration);
        this.dbQueryTotal
            .labels(operation, table, status)
            .inc();
    }
    // Redis metrics
    recordCacheHit(operation) {
        this.redisCacheHits.labels(operation).inc();
    }
    recordCacheMiss(operation) {
        this.redisCacheMisses.labels(operation).inc();
    }
    // Business metrics
    recordTicketSale(eventId, ticketType, quantity = 1) {
        this.ticketsSold.labels(eventId, ticketType).inc(quantity);
    }
    recordPayment(paymentMethod, status, amount) {
        this.paymentsProcessed.labels(paymentMethod, status).inc();
        this.paymentAmount.labels(paymentMethod, status).observe(amount);
    }
    recordFraudScore(paymentMethod, score) {
        this.fraudScore.labels(paymentMethod).observe(score);
    }
    recordError(type, severity = 'error') {
        this.errorRate.labels(type, severity).inc();
    }
    // Update gauge metrics
    async updateGaugeMetrics() {
        try {
            // Update database connections
            const dbStats = await this.getDbConnectionStats();
            this.dbConnectionsActive.set(dbStats.active || 0);
            // Update Redis connections
            const redisInfo = await redis.info('clients');
            const redisConnections = this.parseRedisInfo(redisInfo, 'connected_clients');
            this.redisConnectionsActive.set(redisConnections || 0);
            // Update active reservations
            const activeReservations = await this.getActiveReservationsCount();
            this.reservationsActive.set(activeReservations);
            // Update active users (users active in last 5 minutes)
            const activeUsers = await this.getActiveUsersCount();
            this.activeUsers.set(activeUsers);
        }
        catch (error) {
            logger.error('Failed to update gauge metrics:', error);
        }
    }
    async getDbConnectionStats() {
        try {
            const result = await db.raw(`
        SELECT 
          state,
          COUNT(*) as count
        FROM pg_stat_activity 
        WHERE datname = current_database()
        GROUP BY state
      `);
            const stats = {};
            result.rows.forEach(row => {
                stats[row.state] = parseInt(row.count);
            });
            return {
                active: stats.active || 0,
                idle: stats.idle || 0,
                total: Object.values(stats).reduce((sum, count) => sum + count, 0)
            };
        }
        catch (error) {
            logger.error('Failed to get DB connection stats:', error);
            return { active: 0, idle: 0, total: 0 };
        }
    }
    parseRedisInfo(info, key) {
        const lines = info.split('\r\n');
        for (const line of lines) {
            if (line.startsWith(`${key}:`)) {
                return parseInt(line.split(':')[1]);
            }
        }
        return 0;
    }
    async getActiveReservationsCount() {
        try {
            const keys = await redis.keys('reservation:*');
            return keys.length;
        }
        catch (error) {
            logger.error('Failed to get active reservations count:', error);
            return 0;
        }
    }
    async getActiveUsersCount() {
        try {
            const result = await db('users')
                .where('last_login', '>', new Date(Date.now() - 5 * 60 * 1000))
                .count('* as count');
            return parseInt(result[0].count);
        }
        catch (error) {
            logger.error('Failed to get active users count:', error);
            return 0;
        }
    }
    // Get metrics for Prometheus scraping
    async getMetrics() {
        await this.updateGaugeMetrics();
        return this.register.metrics();
    }
    // Get metrics in JSON format for internal use
    async getMetricsJson() {
        await this.updateGaugeMetrics();
        return this.register.getMetricsAsJSON();
    }
    // Health check metrics
    async getHealthMetrics() {
        try {
            const [dbHealth, redisHealth] = await Promise.all([
                this.checkDbHealth(),
                this.checkRedisHealth()
            ]);
            return {
                database: dbHealth,
                redis: redisHealth,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            logger.error('Failed to get health metrics:', error);
            return {
                database: { status: 'unhealthy', error: error.message },
                redis: { status: 'unhealthy', error: error.message },
                timestamp: new Date().toISOString()
            };
        }
    }
    async checkDbHealth() {
        try {
            const start = Date.now();
            await db.raw('SELECT 1');
            const duration = Date.now() - start;
            return {
                status: 'healthy',
                response_time: duration,
                connections: await this.getDbConnectionStats()
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
    async checkRedisHealth() {
        try {
            const start = Date.now();
            await redis.ping();
            const duration = Date.now() - start;
            return {
                status: 'healthy',
                response_time: duration
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
}
module.exports = new MetricsService();
//# sourceMappingURL=metricsService.js.map