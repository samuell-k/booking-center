"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initializeDatabase = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Team_1 = require("../entities/Team");
const Match_1 = require("../entities/Match");
const Ticket_1 = require("../entities/Ticket");
const Venue_1 = require("../entities/Venue");
const Sport_1 = require("../entities/Sport");
const League_1 = require("../entities/League");
const MatchStatistic_1 = require("../entities/MatchStatistic");
// Load environment variables
const { DB_HOST = 'localhost', DB_PORT = '5432', DB_USERNAME = 'postgres', DB_PASSWORD = 'password', DB_NAME = 'smartsports_rw', NODE_ENV = 'development' } = process.env;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: NODE_ENV === 'development', // Only in development
    logging: NODE_ENV === 'development',
    entities: [
        User_1.User,
        Team_1.Team,
        Match_1.Match,
        Ticket_1.Ticket,
        Venue_1.Venue,
        Sport_1.Sport,
        League_1.League,
        MatchStatistic_1.MatchStatistic
    ],
    migrations: [
        'src/database/migrations/*.ts'
    ],
    subscribers: [
        'src/database/subscribers/*.ts'
    ],
    // Connection pool settings for high performance
    extra: {
        connectionLimit: 100,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true,
        // Performance optimizations
        statement_timeout: 30000,
        query_timeout: 30000,
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        max: 100, // Maximum number of connections
        min: 10, // Minimum number of connections
    },
    // Enable connection pooling
    poolSize: 100,
    // Cache settings
    cache: {
        type: 'redis',
        options: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
        },
        duration: 30000, // 30 seconds cache
    },
});
// Initialize the data source
const initializeDatabase = async () => {
    try {
        if (!exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.initialize();
            console.log('✅ Database connection established successfully');
        }
    }
    catch (error) {
        console.error('❌ Error during Data Source initialization:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
// Close the data source
const closeDatabase = async () => {
    try {
        if (exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.destroy();
            console.log('✅ Database connection closed successfully');
        }
    }
    catch (error) {
        console.error('❌ Error closing database connection:', error);
        throw error;
    }
};
exports.closeDatabase = closeDatabase;
exports.default = exports.AppDataSource;
//# sourceMappingURL=data-source.js.map