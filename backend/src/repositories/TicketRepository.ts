import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Ticket, TicketStatus } from '../entities/Ticket';

export class TicketRepository {
  private repository: Repository<Ticket>;

  constructor() {
    this.repository = AppDataSource.getRepository(Ticket);
  }

  async createTicket(ticketData: Partial<Ticket>): Promise<Ticket> {
    const ticket = this.repository.create(ticketData);
    return this.repository.save(ticket);
  }

  async findByTicketCode(ticketCode: string): Promise<Ticket | null> {
    return this.repository.findOne({
      where: { ticket_code: ticketCode },
      relations: ['user', 'match', 'match.home_team', 'match.away_team', 'match.venue'],
    });
  }

  async findUserTickets(userId: string): Promise<Ticket[]> {
    return this.repository.find({
      where: { user_id: userId },
      relations: ['match', 'match.home_team', 'match.away_team', 'match.venue'],
      order: { created_at: 'DESC' },
    });
  }

  async findActiveTickets(userId: string): Promise<Ticket[]> {
    return this.repository.find({
      where: { 
        user_id: userId,
        status: TicketStatus.ACTIVE,
      },
      relations: ['match', 'match.home_team', 'match.away_team', 'match.venue'],
      order: { created_at: 'DESC' },
    });
  }

  async findMatchTickets(matchId: string): Promise<Ticket[]> {
    return this.repository.find({
      where: { match_id: matchId },
      relations: ['user'],
      order: { created_at: 'ASC' },
    });
  }

  async markTicketAsUsed(ticketCode: string): Promise<void> {
    await this.repository.update(
      { ticket_code: ticketCode },
      { 
        status: TicketStatus.USED,
        used_at: new Date(),
      }
    );
  }

  async cancelTicket(ticketId: string): Promise<void> {
    await this.repository.update(ticketId, { status: TicketStatus.CANCELLED });
  }

  async getTicketSalesStats(matchId: string): Promise<any> {
    return this.repository
      .createQueryBuilder('ticket')
      .select('COUNT(*)', 'total_sold')
      .addSelect('SUM(ticket.price)', 'total_revenue')
      .addSelect('ticket.payment_method', 'payment_method')
      .where('ticket.match_id = :matchId', { matchId })
      .andWhere('ticket.status != :cancelled', { cancelled: TicketStatus.CANCELLED })
      .groupBy('ticket.payment_method')
      .getRawMany();
  }
}