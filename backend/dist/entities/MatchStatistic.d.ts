import { BaseEntity } from './BaseEntity';
import { Match } from './Match';
export declare class MatchStatistic extends BaseEntity {
    match_id: string;
    total_tickets_sold: number;
    total_revenue: number;
    tickets_scanned: number;
    web_sales: number;
    mobile_sales: number;
    ussd_sales: number;
    attendance_rate: number;
    sales_by_hour?: Record<string, number>;
    payment_methods?: Record<string, number>;
    peak_sales_time?: Date;
    cancelled_tickets: number;
    match: Match;
    calculateAttendanceRate(): number;
    getRevenue(): number;
    updateSalesStats(paymentMethod: string): void;
}
//# sourceMappingURL=MatchStatistic.d.ts.map