import { BaseEntity } from './BaseEntity';
import { Match } from './Match';
export declare class Venue extends BaseEntity {
    name: string;
    slug: string;
    address?: string;
    city?: string;
    province?: string;
    capacity: number;
    latitude?: number;
    longitude?: number;
    description?: string;
    facilities?: string[];
    image_url?: string;
    price_multiplier: number;
    is_active: boolean;
    venue_type: string;
    matches: Match[];
    generateSlug(): void;
    getUpcomingMatches(): Promise<Match[]>;
    calculateTicketPrice(basePrice: number): number;
    getAvailableCapacity(matchId: string): Promise<number>;
}
//# sourceMappingURL=Venue.d.ts.map