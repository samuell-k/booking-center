import {
  Entity,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from './BaseEntity';
import { Ticket } from './Ticket';

@Entity('users')
@Index(['phone_number'], { unique: true })
@Index(['email'], { unique: true })
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 15,
    unique: true,
    comment: 'Phone number for USSD integration',
  })
  phone_number: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
  })
  email?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false, // Don't select password by default
  })
  password?: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  full_name: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Account status for USSD access',
  })
  is_active: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  last_login_at?: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.00,
    comment: 'User wallet balance for mobile payments',
  })
  wallet_balance: number;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'en',
    comment: 'Language preference for USSD',
  })
  preferred_language: string;

  // Relationships
  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeInsert()
  normalizePhoneNumber() {
    // Normalize phone number format for Rwanda
    this.phone_number = this.phone_number.replace(/\D/g, '');
    if (this.phone_number.startsWith('0')) {
      this.phone_number = '250' + this.phone_number.substring(1);
    }
    if (!this.phone_number.startsWith('250')) {
      this.phone_number = '250' + this.phone_number;
    }
  }

  // Methods
  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }

  hasWalletBalance(amount: number): boolean {
    return this.wallet_balance >= amount;
  }

  deductFromWallet(amount: number): void {
    if (this.hasWalletBalance(amount)) {
      this.wallet_balance = Number(this.wallet_balance) - amount;
    } else {
      throw new Error('Insufficient wallet balance');
    }
  }

  addToWallet(amount: number): void {
    this.wallet_balance = Number(this.wallet_balance) + amount;
  }

  toJSON() {
    const { password, ...result } = this;
    return result;
  }
}