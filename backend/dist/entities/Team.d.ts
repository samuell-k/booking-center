import { BaseEntity } from './BaseEntity';
import { League } from './League';
import { Match } from './Match';
export declare class Team extends BaseEntity {
    league_id: string;
    name: string;
    slug: string;
    address?: string;
    city?: string;
    province?: string;
    capacity?: number;
    latitude?: number;
    longitude?: number;
    logo?: string;
    description?: string;
    founded_year?: number;
    primary_color: string;
    secondary_color: string;
    is_active: boolean;
    league: League;
    home_matches: Match[];
    away_matches: Match[];
    generateSlug(): void;
    getAllMatches(): Promise<Match[]>;
    getUpcomingMatches(): Promise<Match[]>;
}
//# sourceMappingURL=Team.d.ts.map