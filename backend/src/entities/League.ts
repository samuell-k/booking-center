import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Sport } from './Sport';
import { Team } from './Team';
import { Match } from './Match';

@Entity('leagues')
@Index(['sport_id'])
@Index(['slug'], { unique: true })
@Index(['is_active'])
export class League extends BaseEntity {
  @Column({ name: 'sport_id' })
  sport_id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  season?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  logo?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  start_date?: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  end_date?: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @Column({
    type: 'int',
    default: 0,
  })
  total_teams: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 1000.00,
    comment: 'Base ticket price for this league',
  })
  base_ticket_price: number;

  // Relationships
  @ManyToOne(() => Sport, (sport) => sport.leagues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sport_id' })
  sport: Sport;

  @OneToMany(() => Team, (team) => team.league)
  teams: Team[];

  @OneToMany(() => Match, (match) => match.league)
  matches: Match[];

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (!this.slug && this.name) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
  }

  // Methods
  isCurrentSeason(): boolean {
    const now = new Date();
    return (!this.start_date || now >= this.start_date) && 
           (!this.end_date || now <= this.end_date);
  }

  getUpcomingMatches(): Promise<Match[]> {
    return Match.find({
      where: { league_id: this.id },
      relations: ['home_team', 'away_team', 'venue'],
      order: { match_date: 'ASC' },
      take: 10,
    });
  }
}