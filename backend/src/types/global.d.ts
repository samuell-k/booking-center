// Type declarations for modules without @types packages

declare module 'xss-clean' {
  import { RequestHandler } from 'express';
  function xss(): RequestHandler;
  export = xss;
}

declare module 'express-mongo-sanitize' {
  import { RequestHandler } from 'express';
  function mongoSanitize(options?: any): RequestHandler;
  export = mongoSanitize;
}

declare module 'connect-redis' {
  import { Store } from 'express-session';
  import { RedisClientType } from 'redis';
  
  interface RedisStoreOptions {
    client: RedisClientType;
    prefix?: string;
    ttl?: number;
  }
  
  class RedisStore extends Store {
    constructor(options: RedisStoreOptions);
  }
  
  export default RedisStore;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
      correlationId?: string;
      user?: {
        id: string;
        email: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}

export {};
