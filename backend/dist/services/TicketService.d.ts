import { Ticket, PaymentMethod } from '../entities/Ticket';
interface PurchaseTicketData {
    userId: string;
    matchId: string;
    paymentMethod: PaymentMethod;
    purchasePhone?: string;
    seatCategory?: string;
}
export declare class TicketService {
    private ticketRepository;
    private userRepository;
    private matchRepository;
    constructor();
    purchaseTicket(data: PurchaseTicketData): Promise<Ticket>;
    validateTicket(ticketCode: string): Promise<Ticket | null>;
    useTicket(ticketCode: string): Promise<boolean>;
    getUserTickets(userId: string): Promise<Ticket[]>;
    getMatchTicketStats(matchId: string): Promise<any>;
}
export {};
//# sourceMappingURL=TicketService.d.ts.map