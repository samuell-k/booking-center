import { Ticket } from '../entities/Ticket';
export declare class TicketRepository {
    private repository;
    constructor();
    createTicket(ticketData: Partial<Ticket>): Promise<Ticket>;
    findByTicketCode(ticketCode: string): Promise<Ticket | null>;
    findUserTickets(userId: string): Promise<Ticket[]>;
    findActiveTickets(userId: string): Promise<Ticket[]>;
    findMatchTickets(matchId: string): Promise<Ticket[]>;
    markTicketAsUsed(ticketCode: string): Promise<void>;
    cancelTicket(ticketId: string): Promise<void>;
    getTicketSalesStats(matchId: string): Promise<any>;
}
//# sourceMappingURL=TicketRepository.d.ts.map