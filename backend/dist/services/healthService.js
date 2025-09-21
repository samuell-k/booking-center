const { db } = require('../config/database');
const { redis } = require('../config/redis');
const axios = require('axios');
const logger = require('../utils/logger');
class HealthService {
    constructor() {
        this.checks = new Map();
        this.initializeChecks();
    }
    initializeChecks() {
        // Database health check
        this.checks.set('database', {
            name: 'PostgreSQL Database',
            check: this.checkDatabase.bind(this),
            timeout: 5000,
            critical: true
        });
        // Redis health check
        this.checks.set('redis', {
            name: 'Redis Cache',
            check: this.checkRedis.bind(this),
            timeout: 3000,
            critical: true
        });
        // External services health checks
        this.checks.set('mtn_momo', {
            name: 'MTN MoMo API',
            check: this.checkMTNMoMo.bind(this),
            timeout: 10000,
            critical: false
        });
        this.checks.set('airtel_money', {
            name: 'Airtel Money API',
            check: this.checkAirtelMoney.bind(this),
            timeout: 10000,
            critical: false
        });
        this.checks.set('rswitch', {
            name: 'RSwitch Payment Gateway',
            check: this.checkRSwitch.bind(this),
            timeout: 10000,
            critical: false
        });
        // System resource checks
        this.checks.set('memory', {
            name: 'Memory Usage',
            check: this.checkMemory.bind(this),
            timeout: 1000,
            critical: false
        });
        this.checks.set('disk', {
            name: 'Disk Space',
            check: this.checkDisk.bind(this),
            timeout: 2000,
            critical: false
        });
    }
    async checkDatabase() {
        try {
            const start = Date.now();
            // Test basic connectivity
            await db.raw('SELECT 1 as health_check');
            // Test write capability
            await db.raw(`
        CREATE TEMP TABLE IF NOT EXISTS health_check_temp (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
            await db.raw('INSERT INTO health_check_temp DEFAULT VALUES');
            const duration = Date.now() - start;
            // Get connection pool stats
            const poolStats = {
                used: db.client.pool.numUsed(),
                free: db.client.pool.numFree(),
                pending: db.client.pool.numPendingAcquires(),
                max: db.client.pool.max,
                min: db.client.pool.min
            };
            // Get database size
            const sizeResult = await db.raw(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `);
            return {
                status: 'healthy',
                response_time: duration,
                details: {
                    connection_pool: poolStats,
                    database_size: sizeResult.rows[0].size,
                    version: await this.getDatabaseVersion()
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                details: {
                    connection_pool: {
                        used: 0,
                        free: 0,
                        pending: 0,
                        max: 0,
                        min: 0
                    }
                }
            };
        }
    }
    async checkRedis() {
        try {
            const start = Date.now();
            // Test basic connectivity
            await redis.ping();
            // Test read/write operations
            const testKey = `health_check:${Date.now()}`;
            await redis.set(testKey, 'test', 'EX', 10);
            const value = await redis.get(testKey);
            await redis.del(testKey);
            if (value !== 'test') {
                throw new Error('Redis read/write test failed');
            }
            const duration = Date.now() - start;
            // Get Redis info
            const info = await redis.info();
            const memory = await redis.info('memory');
            return {
                status: 'healthy',
                response_time: duration,
                details: {
                    version: this.parseRedisInfo(info, 'redis_version'),
                    connected_clients: this.parseRedisInfo(info, 'connected_clients'),
                    used_memory: this.parseRedisInfo(memory, 'used_memory_human'),
                    keyspace_hits: this.parseRedisInfo(info, 'keyspace_hits'),
                    keyspace_misses: this.parseRedisInfo(info, 'keyspace_misses')
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
    async checkMTNMoMo() {
        try {
            const start = Date.now();
            // Check MTN MoMo API status endpoint
            const response = await axios.get(`${process.env.MTN_MOMO_BASE_URL}/v1_0/apiuser`, {
                headers: {
                    'X-Reference-Id': process.env.MTN_MOMO_USER_ID,
                    'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY
                },
                timeout: 8000
            });
            const duration = Date.now() - start;
            return {
                status: response.status === 200 ? 'healthy' : 'degraded',
                response_time: duration,
                details: {
                    http_status: response.status,
                    environment: process.env.MTN_MOMO_ENVIRONMENT || 'sandbox'
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                details: {
                    environment: process.env.MTN_MOMO_ENVIRONMENT || 'sandbox'
                }
            };
        }
    }
    async checkAirtelMoney() {
        try {
            const start = Date.now();
            // For Airtel Money, we'll check if we can get an access token
            const response = await axios.post(`${process.env.AIRTEL_MONEY_BASE_URL}/auth/oauth2/token`, {
                client_id: process.env.AIRTEL_MONEY_CLIENT_ID,
                client_secret: process.env.AIRTEL_MONEY_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 8000
            });
            const duration = Date.now() - start;
            return {
                status: response.status === 200 ? 'healthy' : 'degraded',
                response_time: duration,
                details: {
                    http_status: response.status,
                    has_access_token: !!response.data.access_token
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
    async checkRSwitch() {
        try {
            const start = Date.now();
            // Check RSwitch API health endpoint
            const response = await axios.get(`${process.env.RSWITCH_BASE_URL}/health`, {
                headers: {
                    'Authorization': `Bearer ${process.env.RSWITCH_API_KEY}`
                },
                timeout: 8000
            });
            const duration = Date.now() - start;
            return {
                status: response.status === 200 ? 'healthy' : 'degraded',
                response_time: duration,
                details: {
                    http_status: response.status
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
    async checkMemory() {
        try {
            const memUsage = process.memoryUsage();
            const totalMemory = require('os').totalmem();
            const freeMemory = require('os').freemem();
            const usedMemoryPercent = ((totalMemory - freeMemory) / totalMemory) * 100;
            const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
            const status = usedMemoryPercent > 90 ? 'unhealthy' :
                usedMemoryPercent > 80 ? 'degraded' : 'healthy';
            return {
                status,
                details: {
                    heap_used: Math.round(memUsage.heapUsed / 1024 / 1024),
                    heap_total: Math.round(memUsage.heapTotal / 1024 / 1024),
                    heap_used_percent: Math.round(heapUsedPercent),
                    system_memory_used_percent: Math.round(usedMemoryPercent),
                    rss: Math.round(memUsage.rss / 1024 / 1024),
                    external: Math.round(memUsage.external / 1024 / 1024)
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
    async checkDisk() {
        try {
            const fs = require('fs').promises;
            const stats = await fs.stat('.');
            // This is a simplified disk check
            // In production, you'd want to check actual disk usage
            return {
                status: 'healthy',
                details: {
                    note: 'Disk space monitoring requires additional system tools'
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
    async runHealthCheck(checkName = null) {
        if (checkName) {
            const check = this.checks.get(checkName);
            if (!check) {
                throw new Error(`Health check '${checkName}' not found`);
            }
            return await this.executeCheck(checkName, check);
        }
        // Run all checks
        const results = {};
        const promises = [];
        for (const [name, check] of this.checks) {
            promises.push(this.executeCheck(name, check).then(result => {
                results[name] = result;
            }));
        }
        await Promise.all(promises);
        // Determine overall status
        const criticalChecks = Array.from(this.checks.entries())
            .filter(([_, check]) => check.critical)
            .map(([name, _]) => name);
        const overallStatus = this.determineOverallStatus(results, criticalChecks);
        return {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            checks: results
        };
    }
    async executeCheck(name, check) {
        const start = Date.now();
        try {
            const result = await Promise.race([
                check.check(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), check.timeout))
            ]);
            return {
                ...result,
                name: check.name,
                duration: Date.now() - start,
                critical: check.critical
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                name: check.name,
                error: error.message,
                duration: Date.now() - start,
                critical: check.critical
            };
        }
    }
    determineOverallStatus(results, criticalChecks) {
        const criticalUnhealthy = criticalChecks.some(name => results[name]?.status === 'unhealthy');
        if (criticalUnhealthy) {
            return 'unhealthy';
        }
        const anyDegraded = Object.values(results).some(result => result.status === 'degraded');
        if (anyDegraded) {
            return 'degraded';
        }
        return 'healthy';
    }
    async getDatabaseVersion() {
        try {
            const result = await db.raw('SELECT version()');
            return result.rows[0].version.split(' ')[1];
        }
        catch (error) {
            return 'unknown';
        }
    }
    parseRedisInfo(info, key) {
        const lines = info.split('\r\n');
        for (const line of lines) {
            if (line.startsWith(`${key}:`)) {
                return line.split(':')[1];
            }
        }
        return 'unknown';
    }
}
module.exports = new HealthService();
//# sourceMappingURL=healthService.js.map