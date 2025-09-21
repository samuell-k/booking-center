declare const _exports: MetricsService;
export = _exports;
declare class MetricsService {
    register: client.Registry<"text/plain; version=0.0.4; charset=utf-8">;
    initializeMetrics(): void;
    httpRequestDuration: client.Histogram<"route" | "method" | "status_code">;
    httpRequestTotal: client.Counter<"route" | "method" | "status_code">;
    dbConnectionsActive: client.Gauge<string>;
    dbQueryDuration: client.Histogram<"operation" | "table">;
    dbQueryTotal: client.Counter<"status" | "operation" | "table">;
    redisConnectionsActive: client.Gauge<string>;
    redisCacheHits: client.Counter<"operation">;
    redisCacheMisses: client.Counter<"operation">;
    ticketsSold: client.Counter<"event_id" | "ticket_type">;
    paymentsProcessed: client.Counter<"status" | "payment_method">;
    paymentAmount: client.Histogram<"status" | "payment_method">;
    reservationsActive: client.Gauge<string>;
    fraudScore: client.Histogram<"payment_method">;
    errorRate: client.Counter<"type" | "severity">;
    activeUsers: client.Gauge<string>;
    recordHttpRequest(method: any, route: any, statusCode: any, duration: any): void;
    recordDbQuery(operation: any, table: any, duration: any, status?: string): void;
    recordCacheHit(operation: any): void;
    recordCacheMiss(operation: any): void;
    recordTicketSale(eventId: any, ticketType: any, quantity?: number): void;
    recordPayment(paymentMethod: any, status: any, amount: any): void;
    recordFraudScore(paymentMethod: any, score: any): void;
    recordError(type: any, severity?: string): void;
    updateGaugeMetrics(): Promise<void>;
    getDbConnectionStats(): Promise<{
        active: any;
        idle: any;
        total: any;
    }>;
    parseRedisInfo(info: any, key: any): number;
    getActiveReservationsCount(): Promise<any>;
    getActiveUsersCount(): Promise<number>;
    getMetrics(): Promise<string>;
    getMetricsJson(): Promise<client.MetricObjectWithValues<client.MetricValue<string>>[]>;
    getHealthMetrics(): Promise<{
        database: {
            status: string;
            response_time: number;
            connections: {
                active: any;
                idle: any;
                total: any;
            };
            error?: undefined;
        } | {
            status: string;
            error: any;
            response_time?: undefined;
            connections?: undefined;
        };
        redis: {
            status: string;
            response_time: number;
            error?: undefined;
        } | {
            status: string;
            error: any;
            response_time?: undefined;
        };
        timestamp: string;
    }>;
    checkDbHealth(): Promise<{
        status: string;
        response_time: number;
        connections: {
            active: any;
            idle: any;
            total: any;
        };
        error?: undefined;
    } | {
        status: string;
        error: any;
        response_time?: undefined;
        connections?: undefined;
    }>;
    checkRedisHealth(): Promise<{
        status: string;
        response_time: number;
        error?: undefined;
    } | {
        status: string;
        error: any;
        response_time?: undefined;
    }>;
}
import client = require("prom-client");
//# sourceMappingURL=metricsService.d.ts.map