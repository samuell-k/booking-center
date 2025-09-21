import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Team } from '../entities/Team';
import { Match } from '../entities/Match';
import { Ticket } from '../entities/Ticket';
import { Venue } from '../entities/Venue';
import { Sport } from '../entities/Sport';
import { League } from '../entities/League';
import { MatchStatistic } from '../entities/MatchStatistic';

// Load environment variables
const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USERNAME = 'postgres',
  DB_PASSWORD = 'password',
  DB_NAME = 'smartsports_rw',
  NODE_ENV = 'development'
} = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: NODE_ENV === 'development', // Only in development
  logging: NODE_ENV === 'development',
  entities: [
    User,
    Team,
    Match,
    Ticket,
    Venue,
    Sport,
    League,
    MatchStatistic
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
    min: 10,  // Minimum number of connections
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
export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connection established successfully');
    }
  } catch (error) {
    console.error('❌ Error during Data Source initialization:', error);
    throw error;
  }
};

// Close the data source
export const closeDatabase = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✅ Database connection closed successfully');
    }
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
};

export default AppDataSource;
