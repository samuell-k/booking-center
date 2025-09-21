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
exports.League = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Sport_1 = require("./Sport");
const Team_1 = require("./Team");
const Match_1 = require("./Match");
let League = class League extends BaseEntity_1.BaseEntity {
    // Hooks
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
    isCurrentSeason() {
        const now = new Date();
        return (!this.start_date || now >= this.start_date) &&
            (!this.end_date || now <= this.end_date);
    }
    getUpcomingMatches() {
        return Match_1.Match.find({
            where: { league_id: this.id },
            relations: ['home_team', 'away_team', 'venue'],
            order: { match_date: 'ASC' },
            take: 10,
        });
    }
};
exports.League = League;
__decorate([
    (0, typeorm_1.Column)({ name: 'sport_id' }),
    __metadata("design:type", String)
], League.prototype, "sport_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
    }),
    __metadata("design:type", String)
], League.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        unique: true,
    }),
    __metadata("design:type", String)
], League.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", String)
], League.prototype, "season", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], League.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], League.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], League.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], League.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], League.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], League.prototype, "total_teams", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 8,
        scale: 2,
        default: 1000.00,
        comment: 'Base ticket price for this league',
    }),
    __metadata("design:type", Number)
], League.prototype, "base_ticket_price", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Sport_1.Sport, (sport) => sport.leagues, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'sport_id' }),
    __metadata("design:type", Sport_1.Sport)
], League.prototype, "sport", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Team_1.Team, (team) => team.league),
    __metadata("design:type", Array)
], League.prototype, "teams", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Match_1.Match, (match) => match.league),
    __metadata("design:type", Array)
], League.prototype, "matches", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], League.prototype, "generateSlug", null);
exports.League = League = __decorate([
    (0, typeorm_1.Entity)('leagues'),
    (0, typeorm_1.Index)(['sport_id']),
    (0, typeorm_1.Index)(['slug'], { unique: true }),
    (0, typeorm_1.Index)(['is_active'])
], League);
//# sourceMappingURL=League.js.map