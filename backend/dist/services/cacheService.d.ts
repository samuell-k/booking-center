declare const _exports: CacheService;
export = _exports;
declare class CacheService {
    DEFAULT_TTL: number;
    SHORT_TTL: number;
    LONG_TTL: number;
    /**
     * Cache events with smart invalidation
     */
    cacheEvent(eventId: any, ttl?: number): Promise<any>;
    /**
     * Get cached event or fetch from database
     */
    getEvent(eventId: any): Promise<any>;
    /**
     * Cache event list with pagination
     */
    cacheEventList(filters?: {}, page?: number, limit?: number): Promise<any>;
    /**
     * Cache ticket availability for an event
     */
    cacheTicketAvailability(eventId: any): Promise<any[]>;
    /**
     * Cache user profile with related data
     */
    cacheUserProfile(userId: any): Promise<any>;
    /**
     * Cache payment statistics
     */
    cachePaymentStats(period?: string): Promise<any[]>;
    /**
     * Invalidate cache for an event and related data
     */
    invalidateEventCache(eventId: any): Promise<void>;
    /**
     * Invalidate event list caches
     */
    invalidateEventListCache(): Promise<void>;
    /**
     * Invalidate user cache
     */
    invalidateUserCache(userId: any): Promise<void>;
    /**
     * Warm up cache with frequently accessed data
     */
    warmUpCache(): Promise<void>;
    /**
     * Get cache statistics
     */
    getCacheStats(): Promise<{
        memory: any;
        keyspace: any;
        timestamp: string;
    }>;
}
//# sourceMappingURL=cacheService.d.ts.map