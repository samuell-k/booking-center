"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRepository = void 0;
const data_source_1 = require("../config/data-source");
const Ticket_1 = require("../entities/Ticket");
class TicketRepository {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(Ticket_1.Ticket);
    }
    async createTicket(ticketData) {
        const ticket = this.repository.create(ticketData);
        return this.repository.save(ticket);
    }
    async findByTicketCode(ticketCode) {
        return this.repository.findOne({
            where: { ticket_code: ticketCode },
            relations: ['user', 'match', 'match.home_team', 'match.away_team', 'match.venue'],
        });
    }
    async findUserTickets(userId) {
        return this.repository.find({
            where: { user_id: userId },
            relations: ['match', 'match.home_team', 'match.away_team', 'match.venue'],
            order: { created_at: 'DESC' },
        });
    }
    async findActiveTickets(userId) {
        return this.repository.find({
            where: {
                user_id: userId,
                status: Ticket_1.TicketStatus.ACTIVE,
            },
            relations: ['match', 'match.home_team', 'match.away_team', 'match.venue'],
            order: { created_at: 'DESC' },
        });
    }
    async findMatchTickets(matchId) {
        return this.repository.find({
            where: { match_id: matchId },
            relations: ['user'],
            order: { created_at: 'ASC' },
        });
    }
    async markTicketAsUsed(ticketCode) {
        await this.repository.update({ ticket_code: ticketCode }, {
            status: Ticket_1.TicketStatus.USED,
            used_at: new Date(),
        });
    }
    async cancelTicket(ticketId) {
        await this.repository.update(ticketId, { status: Ticket_1.TicketStatus.CANCELLED });
    }
    async getTicketSalesStats(matchId) {
        return this.repository
            .createQueryBuilder('ticket')
            .select('COUNT(*)', 'total_sold')
            .addSelect('SUM(ticket.price)', 'total_revenue')
            .addSelect('ticket.payment_method', 'payment_method')
            .where('ticket.match_id = :matchId', { matchId })
            .andWhere('ticket.status != :cancelled', { cancelled: Ticket_1.TicketStatus.CANCELLED })
            .groupBy('ticket.payment_method')
            .getRawMany();
    }
}
exports.TicketRepository = TicketRepository;
//# sourceMappingURL=TicketRepository.js.map