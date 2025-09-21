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
import { League } from './League';
import { Match } from './Match';

@Entity('teams')
@Index(['league_id'])
@Index(['slug'], { unique: true })
export class Team extends BaseEntity {
  @Column({ name: 'league_id' })
  league_id: string;

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
    type: 'text',
    nullable: true,
  })
  address?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  city?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  province?: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  capacity?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  latitude?: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  longitude?: number;

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
    type: 'int',
    nullable: true,
  })
  founded_year?: number;

  @Column({
    type: 'varchar',
    length: 7,
    default: '#000000',
    comment: 'Team primary color',
  })
  primary_color: string;

  @Column({
    type: 'varchar',
    length: 7,
    default: '#FFFFFF',
    comment: 'Team secondary color',
  })
  secondary_color: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  // Relationships
  @ManyToOne(() => League, (league) => league.teams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'league_id' })
  league: League;

  @OneToMany(() => Match, (match) => match.home_team)
  home_matches: Match[];

  @OneToMany(() => Match, (match) => match.away_team)
  away_matches: Match[];

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
  getAllMatches(): Promise<Match[]> {
    return Match.createQueryBuilder('match')
      .where('match.home_team_id = :teamId OR match.away_team_id = :teamId', { 
        teamId: this.id 
      })
      .leftJoinAndSelect('match.home_team', 'home_team')
      .leftJoinAndSelect('match.away_team', 'away_team')
      .leftJoinAndSelect('match.venue', 'venue')
      .orderBy('match.match_date', 'DESC')
      .getMany();
  }

  getUpcomingMatches(): Promise<Match[]> {
    return Match.createQueryBuilder('match')
      .where('match.home_team_id = :teamId OR match.away_team_id = :teamId', { 
        teamId: this.id 
      })
      .andWhere('match.match_date > :now', { now: new Date() })
      .leftJoinAndSelect('match.home_team', 'home_team')
      .leftJoinAndSelect('match.away_team', 'away_team')
      .leftJoinAndSelect('match.venue', 'venue')
      .orderBy('match.match_date', 'ASC')
      .take(5)
      .getMany();
  }
}