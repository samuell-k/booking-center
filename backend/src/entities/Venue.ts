import {
  Entity,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Match } from './Match';

@Entity('venues')
@Index(['slug'], { unique: true })
@Index(['city'])
@Index(['is_active'])
export class Venue extends BaseEntity {
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
    default: 0,
  })
  capacity: number;

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
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Venue facilities and amenities',
  })
  facilities?: string[];

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  image_url?: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 1.0,
    comment: 'Price multiplier for this venue',
  })
  price_multiplier: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'outdoor',
    comment: 'indoor, outdoor, covered',
  })
  venue_type: string;

  // Relationships
  @OneToMany(() => Match, (match) => match.venue)
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
  getUpcomingMatches(): Promise<Match[]> {
    return Match.find({
      where: { 
        venue_id: this.id,
      },
      relations: ['home_team', 'away_team', 'league'],
      order: { match_date: 'ASC' },
      take: 10,
    });
  }

  calculateTicketPrice(basePrice: number): number {
    return basePrice * Number(this.price_multiplier);
  }

  getAvailableCapacity(matchId: string): Promise<number> {
    // This would typically involve a more complex query
    return Promise.resolve(this.capacity);
  }
}