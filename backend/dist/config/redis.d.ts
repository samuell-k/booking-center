export const redis: any;
export function connectRedis(): Promise<any>;
export function closeRedis(): Promise<void>;
export function checkRedisHealth(): Promise<{
    status: string;
    ping: any;
    server_info: any;
    error?: undefined;
} | {
    status: string;
    error: any;
    ping?: undefined;
    server_info?: undefined;
}>;
export namespace cache {
    function set(key: any, value: any, ttl?: number): Promise<boolean>;
    function get(key: any): Promise<any>;
    function del(key: any): Promise<boolean>;
    function exists(key: any): Promise<boolean>;
    function expire(key: any, ttl: any): Promise<boolean>;
    function mget(keys: any): Promise<any>;
    function mset(keyValuePairs: any, ttl?: number): Promise<boolean>;
    function incr(key: any, amount?: number): Promise<any>;
    function sadd(key: any, ...members: any[]): Promise<any>;
    function smembers(key: any): Promise<any>;
    function srem(key: any, ...members: any[]): Promise<any>;
}
export namespace session {
    function create(userId: any, sessionData: any, ttl?: number): Promise<boolean>;
    function get(userId: any): Promise<any>;
    function update(userId: any, sessionData: any, ttl?: number): Promise<boolean>;
    function destroy(userId: any): Promise<boolean>;
    function exists(userId: any): Promise<boolean>;
}
export namespace rateLimit {
    function check(key: any, limit: any, window: any): Promise<{
        current: any;
        remaining: number;
        resetTime: any;
    } | {
        current: number;
        remaining: any;
        resetTime: any;
    }>;
    function reset(key: any): Promise<boolean>;
}
export namespace pubsub {
    function publish(channel: any, message: any): Promise<any>;
    function subscribe(channel: any, callback: any): any;
}
//# sourceMappingURL=redis.d.ts.map