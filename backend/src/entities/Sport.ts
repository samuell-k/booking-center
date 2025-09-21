import {
  Entity,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { League } from './League';

@Entity('sports')
@Index(['slug'], { unique: true })
@Index(['is_active'])
export class Sport extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
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
    length: 255,
    nullable: true,
  })
  icon?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'int',
    default: 0,
  })
  sort_order: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  // Relationships
  @OneToMany(() => League, (league) => league.sport)
  leagues: League[];

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
  getActiveLeagues(): Promise<League[]> {
    return League.find({
      where: { sport_id: this.id, is_active: true },
      order: { name: 'ASC' },
    });
  }
}