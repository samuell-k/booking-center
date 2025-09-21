import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { League } from './League';
import { Team } from './Team';
import { Venue } from './Venue';
import { Ticket } from './Ticket';
import { MatchStatistic } from './MatchStatistic';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
}

@Entity('matches')
@Index(['home_team_id'])
@Index(['away_team_id'])
@Index(['venue_id'])
@Index(['league_id'])
@Index(['match_date'])
@Index(['status'])
export class Match extends BaseEntity {
  @Column({ name: 'home_team_id' })
  home_team_id: string;

  @Column({ name: 'away_team_id' })
  away_team_id: string;

  @Column({ name: 'venue_id' })
  venue_id: string;

  @Column({ name: 'league_id' })
  league_id: string;

  @Column({
    type: 'timestamp',
  })
  match_date: Date;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;

  @Column({
    type: 'int',
    nullable: true,
  })
  home_score?: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  away_score?: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    comment: 'Match-specific ticket price',
  })
  ticket_price: number;

  @Column({
    type: 'int',
    default: 0,
  })
  tickets_sold: number;

  @Column({
    type: 'int',
    default: 0,
  })
  max_tickets: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  ticket_sale_start?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  ticket_sale_end?: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  tickets_available: boolean;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Additional match metadata',
  })
  metadata?: Record<string, any>;

  // Relationships
  @ManyToOne(() => Team, (team) => team.home_matches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'home_team_id' })
  home_team: Team;

  @ManyToOne(() => Team, (team) => team.away_matches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'away_team_id' })
  away_team: Team;

  @ManyToOne(() => Venue, (venue) => venue.matches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @ManyToOne(() => League, (league) => league.matches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'league_id' })
  league: League;

  @OneToMany(() => Ticket, (ticket) => ticket.match)
  tickets: Ticket[];

  @OneToOne(() => MatchStatistic, (stats) => stats.match)
  statistics: MatchStatistic;

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  setDefaults() {
    if (!this.title) {
      // Title will be set after teams are loaded
    }
    
    if (!this.ticket_sale_start) {
      this.ticket_sale_start = new Date();
    }
    
    if (!this.ticket_sale_end) {
      // Set ticket sale end to 1 hour before match
      this.ticket_sale_end = new Date(this.match_date.getTime() - (60 * 60 * 1000));
    }
  }

  // Methods
  isLive(): boolean {
    return this.status === MatchStatus.LIVE;
  }

  isFinished(): boolean {
    return this.status === MatchStatus.FINISHED;
  }

  isUpcoming(): boolean {
    return this.status === MatchStatus.SCHEDULED && this.match_date > new Date();
  }

  canSellTickets(): boolean {
    const now = new Date();
    return this.tickets_available && 
           this.status === MatchStatus.SCHEDULED &&
           (!this.ticket_sale_start || now >= this.ticket_sale_start) &&
           (!this.ticket_sale_end || now <= this.ticket_sale_end) &&
           this.tickets_sold < this.max_tickets;
  }

  getAvailableTickets(): number {
    return this.max_tickets - this.tickets_sold;
  }

  getMatchTitle(): string {
    return this.title || `${this.home_team?.name} vs ${this.away_team?.name}`;
  }

  incrementTicketsSold(): void {
    this.tickets_sold += 1;
  }
}