declare const _exports: HealthService;
export = _exports;
declare class HealthService {
    checks: Map<any, any>;
    initializeChecks(): void;
    checkDatabase(): Promise<{
        status: string;
        response_time: number;
        details: {
            connection_pool: {
                used: any;
                free: any;
                pending: any;
                max: any;
                min: any;
            };
            database_size: any;
            version: any;
        };
        error?: undefined;
    } | {
        status: string;
        error: any;
        details: {
            connection_pool: {
                used: number;
                free: number;
                pending: number;
                max: number;
                min: number;
            };
            database_size?: undefined;
            version?: undefined;
        };
        response_time?: undefined;
    }>;
    checkRedis(): Promise<{
        status: string;
        response_time: number;
        details: {
            version: any;
            connected_clients: any;
            used_memory: any;
            keyspace_hits: any;
            keyspace_misses: any;
        };
        error?: undefined;
    } | {
        status: string;
        error: any;
        response_time?: undefined;
        details?: undefined;
    }>;
    checkMTNMoMo(): Promise<{
        status: string;
        response_time: number;
        details: {
            http_status: any;
            environment: string;
        };
        error?: undefined;
    } | {
        status: string;
        error: any;
        details: {
            environment: string;
            http_status?: undefined;
        };
        response_time?: undefined;
    }>;
    checkAirtelMoney(): Promise<{
        status: string;
        response_time: number;
        details: {
            http_status: any;
            has_access_token: boolean;
        };
        error?: undefined;
    } | {
        status: string;
        error: any;
        response_time?: undefined;
        details?: undefined;
    }>;
    checkRSwitch(): Promise<{
        status: string;
        response_time: number;
        details: {
            http_status: any;
        };
        error?: undefined;
    } | {
        status: string;
        error: any;
        response_time?: undefined;
        details?: undefined;
    }>;
    checkMemory(): Promise<{
        status: string;
        details: {
            heap_used: number;
            heap_total: number;
            heap_used_percent: number;
            system_memory_used_percent: number;
            rss: number;
            external: number;
        };
        error?: undefined;
    } | {
        status: string;
        error: any;
        details?: undefined;
    }>;
    checkDisk(): Promise<{
        status: string;
        details: {
            note: string;
        };
        error?: undefined;
    } | {
        status: string;
        error: any;
        details?: undefined;
    }>;
    runHealthCheck(checkName?: any): Promise<any>;
    executeCheck(name: any, check: any): Promise<any>;
    determineOverallStatus(results: any, criticalChecks: any): "healthy" | "unhealthy" | "degraded";
    getDatabaseVersion(): Promise<any>;
    parseRedisInfo(info: any, key: any): any;
}
//# sourceMappingURL=healthService.d.ts.map