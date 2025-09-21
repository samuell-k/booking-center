import { BaseEntity } from './BaseEntity';
import { League } from './League';
import { Team } from './Team';
import { Venue } from './Venue';
import { Ticket } from './Ticket';
import { MatchStatistic } from './MatchStatistic';
export declare enum MatchStatus {
    SCHEDULED = "scheduled",
    LIVE = "live",
    FINISHED = "finished",
    CANCELLED = "cancelled",
    POSTPONED = "postponed"
}
export declare class Match extends BaseEntity {
    home_team_id: string;
    away_team_id: string;
    venue_id: string;
    league_id: string;
    match_date: Date;
    title: string;
    description?: string;
    status: MatchStatus;
    home_score?: number;
    away_score?: number;
    ticket_price: number;
    tickets_sold: number;
    max_tickets: number;
    ticket_sale_start?: Date;
    ticket_sale_end?: Date;
    tickets_available: boolean;
    metadata?: Record<string, any>;
    home_team: Team;
    away_team: Team;
    venue: Venue;
    league: League;
    tickets: Ticket[];
    statistics: MatchStatistic;
    setDefaults(): void;
    isLive(): boolean;
    isFinished(): boolean;
    isUpcoming(): boolean;
    canSellTickets(): boolean;
    getAvailableTickets(): number;
    getMatchTitle(): string;
    incrementTicketsSold(): void;
}
//# sourceMappingURL=Match.d.ts.map