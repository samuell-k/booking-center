"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = exports.MatchStatus = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const League_1 = require("./League");
const Team_1 = require("./Team");
const Venue_1 = require("./Venue");
const Ticket_1 = require("./Ticket");
const MatchStatistic_1 = require("./MatchStatistic");
var MatchStatus;
(function (MatchStatus) {
    MatchStatus["SCHEDULED"] = "scheduled";
    MatchStatus["LIVE"] = "live";
    MatchStatus["FINISHED"] = "finished";
    MatchStatus["CANCELLED"] = "cancelled";
    MatchStatus["POSTPONED"] = "postponed";
})(MatchStatus || (exports.MatchStatus = MatchStatus = {}));
let Match = class Match extends BaseEntity_1.BaseEntity {
    // Hooks
    setDefaults() {
        if (!this.title) {
            // Title will be set after teams are loaded
        }
        if (!this.ticket_sale_start) {
            this.ticket_sale_start = new Date();
        }
        if (!this.ticket_sale_end) {
            // Set ticket sale end to 1 hour before match
            this.ticket_sale_end = new Date(this.match_date.getTime() - (60 * 60 * 1000));
        }
    }
    // Methods
    isLive() {
        return this.status === MatchStatus.LIVE;
    }
    isFinished() {
        return this.status === MatchStatus.FINISHED;
    }
    isUpcoming() {
        return this.status === MatchStatus.SCHEDULED && this.match_date > new Date();
    }
    canSellTickets() {
        const now = new Date();
        return this.tickets_available &&
            this.status === MatchStatus.SCHEDULED &&
            (!this.ticket_sale_start || now >= this.ticket_sale_start) &&
            (!this.ticket_sale_end || now <= this.ticket_sale_end) &&
            this.tickets_sold < this.max_tickets;
    }
    getAvailableTickets() {
        return this.max_tickets - this.tickets_sold;
    }
    getMatchTitle() {
        return this.title || `${this.home_team?.name} vs ${this.away_team?.name}`;
    }
    incrementTicketsSold() {
        this.tickets_sold += 1;
    }
};
exports.Match = Match;
__decorate([
    (0, typeorm_1.Column)({ name: 'home_team_id' }),
    __metadata("design:type", String)
], Match.prototype, "home_team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'away_team_id' }),
    __metadata("design:type", String)
], Match.prototype, "away_team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'venue_id' }),
    __metadata("design:type", String)
], Match.prototype, "venue_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'league_id' }),
    __metadata("design:type", String)
], Match.prototype, "league_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
    }),
    __metadata("design:type", Date)
], Match.prototype, "match_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
    }),
    __metadata("design:type", String)
], Match.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Match.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MatchStatus,
        default: MatchStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], Match.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], Match.prototype, "home_score", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], Match.prototype, "away_score", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 8,
        scale: 2,
        comment: 'Match-specific ticket price',
    }),
    __metadata("design:type", Number)
], Match.prototype, "ticket_price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], Match.prototype, "tickets_sold", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], Match.prototype, "max_tickets", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Match.prototype, "ticket_sale_start", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Match.prototype, "ticket_sale_end", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], Match.prototype, "tickets_available", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: true,
        comment: 'Additional match metadata',
    }),
    __metadata("design:type", Object)
], Match.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_1.Team, (team) => team.home_matches, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'home_team_id' }),
    __metadata("design:type", Team_1.Team)
], Match.prototype, "home_team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_1.Team, (team) => team.away_matches, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'away_team_id' }),
    __metadata("design:type", Team_1.Team)
], Match.prototype, "away_team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Venue_1.Venue, (venue) => venue.matches, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'venue_id' }),
    __metadata("design:type", Venue_1.Venue)
], Match.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => League_1.League, (league) => league.matches, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'league_id' }),
    __metadata("design:type", League_1.League)
], Match.prototype, "league", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ticket_1.Ticket, (ticket) => ticket.match),
    __metadata("design:type", Array)
], Match.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => MatchStatistic_1.MatchStatistic, (stats) => stats.match),
    __metadata("design:type", MatchStatistic_1.MatchStatistic)
], Match.prototype, "statistics", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Match.prototype, "setDefaults", null);
exports.Match = Match = __decorate([
    (0, typeorm_1.Entity)('matches'),
    (0, typeorm_1.Index)(['home_team_id']),
    (0, typeorm_1.Index)(['away_team_id']),
    (0, typeorm_1.Index)(['venue_id']),
    (0, typeorm_1.Index)(['league_id']),
    (0, typeorm_1.Index)(['match_date']),
    (0, typeorm_1.Index)(['status'])
], Match);
//# sourceMappingURL=Match.js.map