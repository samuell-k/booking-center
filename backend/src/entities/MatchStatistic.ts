import {
  Entity,
  Column,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Match } from './Match';

@Entity('match_statistics')
@Index(['match_id'], { unique: true })
export class MatchStatistic extends BaseEntity {
  @Column({ name: 'match_id' })
  match_id: string;

  @Column({
    type: 'int',
    default: 0,
  })
  total_tickets_sold: number;

  @Column({
    type: 'int',
    default: 0,
  })
  total_revenue: number;

  @Column({
    type: 'int',
    default: 0,
  })
  tickets_scanned: number;

  @Column({
    type: 'int',
    default: 0,
  })
  web_sales: number;

  @Column({
    type: 'int',
    default: 0,
  })
  mobile_sales: number;

  @Column({
    type: 'int',
    default: 0,
  })
  ussd_sales: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: 'Attendance percentage',
  })
  attendance_rate: number;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Hourly sales data',
  })
  sales_by_hour?: Record<string, number>;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Payment method breakdown',
  })
  payment_methods?: Record<string, number>;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  peak_sales_time?: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  cancelled_tickets: number;

  // Relationships
  @OneToOne(() => Match, (match) => match.statistics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'match_id' })
  match: Match;

  // Methods
  calculateAttendanceRate(): number {
    if (this.total_tickets_sold === 0) return 0;
    return (this.tickets_scanned / this.total_tickets_sold) * 100;
  }

  getRevenue(): number {
    return Number(this.total_revenue);
  }

  updateSalesStats(paymentMethod: string): void {
    this.total_tickets_sold += 1;
    
    switch (paymentMethod) {
      case 'ussd':
        this.ussd_sales += 1;
        break;
      case 'mobile_money':
        this.mobile_sales += 1;
        break;
      default:
        this.web_sales += 1;
    }
  }
}