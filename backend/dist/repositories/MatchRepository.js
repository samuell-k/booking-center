"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchRepository = void 0;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../config/data-source");
const Match_1 = require("../entities/Match");
class MatchRepository {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(Match_1.Match);
    }
    async findUpcomingMatches(limit = 10) {
        return this.repository.find({
            where: {
                match_date: (0, typeorm_1.Between)(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                status: Match_1.MatchStatus.SCHEDULED,
            },
            relations: ['home_team', 'away_team', 'venue', 'league'],
            order: { match_date: 'ASC' },
            take: limit,
        });
    }
    async findMatchesBySport(sportId) {
        return this.repository
            .createQueryBuilder('match')
            .leftJoinAndSelect('match.league', 'league')
            .leftJoinAndSelect('match.home_team', 'home_team')
            .leftJoinAndSelect('match.away_team', 'away_team')
            .leftJoinAndSelect('match.venue', 'venue')
            .where('league.sport_id = :sportId', { sportId })
            .andWhere('match.status = :status', { status: Match_1.MatchStatus.SCHEDULED })
            .orderBy('match.match_date', 'ASC')
            .getMany();
    }
    async findMatchesByLeague(leagueId) {
        return this.repository.find({
            where: { league_id: leagueId },
            relations: ['home_team', 'away_team', 'venue'],
            order: { match_date: 'ASC' },
        });
    }
    async findMatchesWithAvailableTickets() {
        return this.repository
            .createQueryBuilder('match')
            .where('match.tickets_available = :available', { available: true })
            .andWhere('match.tickets_sold < match.max_tickets')
            .andWhere('match.status = :status', { status: Match_1.MatchStatus.SCHEDULED })
            .andWhere('match.match_date > :now', { now: new Date() })
            .leftJoinAndSelect('match.home_team', 'home_team')
            .leftJoinAndSelect('match.away_team', 'away_team')
            .leftJoinAndSelect('match.venue', 'venue')
            .leftJoinAndSelect('match.league', 'league')
            .orderBy('match.match_date', 'ASC')
            .getMany();
    }
    async findById(matchId) {
        return this.repository.findOne({
            where: { id: matchId },
            relations: ['home_team', 'away_team', 'venue', 'league'],
        });
    }
    async updateTicketsSold(matchId) {
        await this.repository.increment({ id: matchId }, 'tickets_sold', 1);
    }
}
exports.MatchRepository = MatchRepository;
//# sourceMappingURL=MatchRepository.js.map