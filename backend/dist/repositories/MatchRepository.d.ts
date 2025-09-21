import { Match } from '../entities/Match';
export declare class MatchRepository {
    private repository;
    constructor();
    findUpcomingMatches(limit?: number): Promise<Match[]>;
    findMatchesBySport(sportId: string): Promise<Match[]>;
    findMatchesByLeague(leagueId: string): Promise<Match[]>;
    findMatchesWithAvailableTickets(): Promise<Match[]>;
    findById(matchId: string): Promise<Match | null>;
    updateTicketsSold(matchId: string): Promise<void>;
}
//# sourceMappingURL=MatchRepository.d.ts.map