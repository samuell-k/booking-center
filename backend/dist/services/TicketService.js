"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const TicketRepository_1 = require("../repositories/TicketRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const MatchRepository_1 = require("../repositories/MatchRepository");
const Ticket_1 = require("../entities/Ticket");
class TicketService {
    constructor() {
        this.ticketRepository = new TicketRepository_1.TicketRepository();
        this.userRepository = new UserRepository_1.UserRepository();
        this.matchRepository = new MatchRepository_1.MatchRepository();
    }
    async purchaseTicket(data) {
        // Get user and match
        const user = await this.userRepository.findByPhoneNumber(data.userId);
        if (!user)
            throw new Error('User not found');
        const match = await this.matchRepository.findById(data.matchId);
        if (!match)
            throw new Error('Match not found');
        // Check if match allows ticket sales
        if (!match.canSellTickets()) {
            throw new Error('Tickets are not available for this match');
        }
        // Check user wallet balance for wallet payments
        if (data.paymentMethod === Ticket_1.PaymentMethod.WALLET) {
            if (!user.hasWalletBalance(match.ticket_price)) {
                throw new Error('Insufficient wallet balance');
            }
        }
        // Create ticket
        const ticket = await this.ticketRepository.createTicket({
            user_id: user.id,
            match_id: match.id,
            price: match.ticket_price,
            payment_method: data.paymentMethod,
            purchase_phone: data.purchasePhone,
            seat_category: data.seatCategory || 'general',
            status: Ticket_1.TicketStatus.ACTIVE,
        });
        // Update match tickets sold
        await this.matchRepository.updateTicketsSold(match.id);
        // Deduct from wallet if applicable
        if (data.paymentMethod === Ticket_1.PaymentMethod.WALLET) {
            user.deductFromWallet(match.ticket_price);
            await user.save();
        }
        return ticket;
    }
    async validateTicket(ticketCode) {
        const ticket = await this.ticketRepository.findByTicketCode(ticketCode);
        if (!ticket || !ticket.canBeUsed()) {
            return null;
        }
        return ticket;
    }
    async useTicket(ticketCode) {
        const ticket = await this.validateTicket(ticketCode);
        if (!ticket)
            return false;
        await this.ticketRepository.markTicketAsUsed(ticketCode);
        return true;
    }
    async getUserTickets(userId) {
        return this.ticketRepository.findUserTickets(userId);
    }
    async getMatchTicketStats(matchId) {
        return this.ticketRepository.getTicketSalesStats(matchId);
    }
}
exports.TicketService = TicketService;
//# sourceMappingURL=TicketService.js.map