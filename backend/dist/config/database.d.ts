export const db: knex.Knex<any, unknown[]>;
export const readDb: knex.Knex<any, unknown[]>;
export function connectDB(): Promise<knex.Knex<any, unknown[]>>;
export function closeDB(): Promise<void>;
export function checkDBHealth(): Promise<{
    status: string;
    timestamp: any;
    connection_count: any;
    error?: undefined;
} | {
    status: string;
    error: any;
    timestamp?: undefined;
    connection_count?: undefined;
}>;
export function withTransaction(callback: any): Promise<any>;
export namespace dbOperations {
    export function create(table: any, data: any, options?: {}): Promise<any>;
    export function findById(table: any, id: any, useReadReplica?: boolean): Promise<any>;
    export function findOne(table: any, conditions: any, useReadReplica?: boolean): Promise<any>;
    export function findMany(table: any, conditions?: {}, options?: {}): Promise<any[]>;
    export function update(table: any, id: any, data: any, options?: {}): Promise<any>;
    function _delete(table: any, id: any, options?: {}): Promise<any>;
    export { _delete as delete };
    export function count(table: any, conditions?: {}, useReadReplica?: boolean): Promise<number>;
    export function paginate(table: any, conditions?: {}, page?: number, limit?: number, orderBy?: string, direction?: string, useReadReplica?: boolean): Promise<{
        data: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    export function bulkInsert(table: any, data: any, options?: {}): Promise<any>;
    export function bulkUpdate(table: any, updates: any, options?: {}): Promise<any[]>;
}
export function validateSchema(): Promise<void>;
export namespace preparedStatements {
    let findEventById: knex.Knex.Raw<any>;
    let findAvailableTickets: knex.Knex.Raw<any>;
    let findPaymentByReference: knex.Knex.Raw<any>;
    let updatePaymentStatus: knex.Knex.Raw<any>;
    let findUserByEmail: knex.Knex.Raw<any>;
    let findUserByPhone: knex.Knex.Raw<any>;
    let findTicketByQR: knex.Knex.Raw<any>;
    let updateTicketStatus: knex.Knex.Raw<any>;
}
export namespace queryOptimizer {
    function explainQuery(query: any): Promise<any>;
    function getTableStats(tableName: any): Promise<any>;
    function getSlowQueries(limit?: number): Promise<any>;
}
export namespace connectionMonitor {
    function getConnectionStats(): Promise<any>;
    function getActiveQueries(): Promise<any>;
}
import knex = require("knex");
//# sourceMappingURL=database.d.ts.map