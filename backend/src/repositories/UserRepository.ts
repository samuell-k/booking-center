import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.repository.findOne({
      where: { phone_number: phoneNumber },
      relations: ['tickets'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['tickets'],
    });
  }

  async createUSSDUser(phoneNumber: string, fullName: string): Promise<User> {
    const user = this.repository.create({
      phone_number: phoneNumber,
      full_name: fullName,
      is_active: true,
    });
    return this.repository.save(user);
  }

  async updateWalletBalance(userId: string, amount: number): Promise<void> {
    await this.repository.update(userId, { wallet_balance: amount });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.repository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async getUserTickets(userId: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id: userId },
      relations: ['tickets', 'tickets.match', 'tickets.match.home_team', 'tickets.match.away_team'],
    });
  }
}