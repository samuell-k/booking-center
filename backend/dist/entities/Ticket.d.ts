import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { Match } from './Match';
export declare enum TicketStatus {
    ACTIVE = "active",
    USED = "used",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare enum PaymentMethod {
    USSD = "ussd",
    MOBILE_MONEY = "mobile_money",
    WALLET = "wallet",
    CASH = "cash"
}
export declare class Ticket extends BaseEntity {
    user_id: string;
    match_id: string;
    ticket_code: string;
    price: number;
    status: TicketStatus;
    payment_method: PaymentMethod;
    payment_reference?: string;
    seat_category: string;
    seat_number?: string;
    used_at?: Date;
    purchase_phone?: string;
    metadata?: Record<string, any>;
    expires_at?: Date;
    user: User;
    match: Match;
    generateTicketCode(): void;
    isValid(): boolean;
    canBeUsed(): boolean;
    markAsUsed(): void;
    cancel(): void;
    isExpired(): boolean;
    getQRCodeData(): string;
}
//# sourceMappingURL=Ticket.d.ts.map