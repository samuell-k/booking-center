import { TicketRepository } from '../repositories/TicketRepository';
import { UserRepository } from '../repositories/UserRepository';
import { MatchRepository } from '../repositories/MatchRepository';
import { Ticket, PaymentMethod, TicketStatus } from '../entities/Ticket';

interface PurchaseTicketData {
  userId: string;
  matchId: string;
  paymentMethod: PaymentMethod;
  purchasePhone?: string;
  seatCategory?: string;
}

export class TicketService {
  private ticketRepository: TicketRepository;
  private userRepository: UserRepository;
  private matchRepository: MatchRepository;

  constructor() {
    this.ticketRepository = new TicketRepository();
    this.userRepository = new UserRepository();
    this.matchRepository = new MatchRepository();
  }

  async purchaseTicket(data: PurchaseTicketData): Promise<Ticket> {
    // Get user and match
    const user = await this.userRepository.findByPhoneNumber(data.userId);
    if (!user) throw new Error('User not found');

    const match = await this.matchRepository.findById(data.matchId);
    if (!match) throw new Error('Match not found');

    // Check if match allows ticket sales
    if (!match.canSellTickets()) {
      throw new Error('Tickets are not available for this match');
    }

    // Check user wallet balance for wallet payments
    if (data.paymentMethod === PaymentMethod.WALLET) {
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
      status: TicketStatus.ACTIVE,
    });

    // Update match tickets sold
    await this.matchRepository.updateTicketsSold(match.id);

    // Deduct from wallet if applicable
    if (data.paymentMethod === PaymentMethod.WALLET) {
      user.deductFromWallet(match.ticket_price);
      await user.save();
    }

    return ticket;
  }

  async validateTicket(ticketCode: string): Promise<Ticket | null> {
    const ticket = await this.ticketRepository.findByTicketCode(ticketCode);
    
    if (!ticket || !ticket.canBeUsed()) {
      return null;
    }

    return ticket;
  }

  async useTicket(ticketCode: string): Promise<boolean> {
    const ticket = await this.validateTicket(ticketCode);
    
    if (!ticket) return false;

    await this.ticketRepository.markTicketAsUsed(ticketCode);
    return true;
  }

  async getUserTickets(userId: string): Promise<Ticket[]> {
    return this.ticketRepository.findUserTickets(userId);
  }

  async getMatchTicketStats(matchId: string): Promise<any> {
    return this.ticketRepository.getTicketSalesStats(matchId);
  }
}