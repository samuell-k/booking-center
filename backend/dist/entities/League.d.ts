import { BaseEntity } from './BaseEntity';
import { Sport } from './Sport';
import { Team } from './Team';
import { Match } from './Match';
export declare class League extends BaseEntity {
    sport_id: string;
    name: string;
    slug: string;
    season?: string;
    logo?: string;
    description?: string;
    start_date?: Date;
    end_date?: Date;
    is_active: boolean;
    total_teams: number;
    base_ticket_price: number;
    sport: Sport;
    teams: Team[];
    matches: Match[];
    generateSlug(): void;
    isCurrentSeason(): boolean;
    getUpcomingMatches(): Promise<Match[]>;
}
//# sourceMappingURL=League.d.ts.map