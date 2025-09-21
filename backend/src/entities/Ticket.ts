import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { Match } from './Match';

export enum TicketStatus {
  ACTIVE = 'active',
  USED = 'used',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum PaymentMethod {
  USSD = 'ussd',
  MOBILE_MONEY = 'mobile_money',
  WALLET = 'wallet',
  CASH = 'cash',
}

@Entity('tickets')
@Index(['user_id'])
@Index(['match_id'])
@Index(['ticket_code'], { unique: true })
@Index(['status'])
@Index(['payment_method'])
export class Ticket extends BaseEntity {
  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ name: 'match_id' })
  match_id: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  ticket_code: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.ACTIVE,
  })
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.USSD,
  })
  payment_method: PaymentMethod;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  payment_reference?: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'general',
    comment: 'general, vip, premium',
  })
  seat_category: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  seat_number?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  used_at?: Date;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    comment: 'Phone number used for purchase via USSD',
  })
  purchase_phone?: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Additional ticket metadata',
  })
  metadata?: Record<string, any>;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  expires_at?: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Match, (match) => match.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'match_id' })
  match: Match;

  // Hooks
  @BeforeInsert()
  generateTicketCode() {
    if (!this.ticket_code) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      this.ticket_code = `TKT${timestamp}${random}`;
    }

    if (!this.expires_at) {
      // Ticket expires 24 hours after match
      this.expires_at = new Date(this.match.match_date.getTime() + (24 * 60 * 60 * 1000));
    }
  }

  // Methods
  isValid(): boolean {
    const now = new Date();
    return this.status === TicketStatus.ACTIVE && 
           (!this.expires_at || now <= this.expires_at);
  }

  canBeUsed(): boolean {
    return this.isValid() && !this.used_at;
  }

  markAsUsed(): void {
    this.status = TicketStatus.USED;
    this.used_at = new Date();
  }

  cancel(): void {
    this.status = TicketStatus.CANCELLED;
  }

  isExpired(): boolean {
    if (!this.expires_at) return false;
    return new Date() > this.expires_at;
  }

  getQRCodeData(): string {
    return JSON.stringify({
      code: this.ticket_code,
      match_id: this.match_id,
      user_id: this.user_id,
      issued_at: this.created_at,
    });
  }
}