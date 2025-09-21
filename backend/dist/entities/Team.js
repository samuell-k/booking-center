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
exports.Team = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const League_1 = require("./League");
const Match_1 = require("./Match");
let Team = class Team extends BaseEntity_1.BaseEntity {
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
    getAllMatches() {
        return Match_1.Match.createQueryBuilder('match')
            .where('match.home_team_id = :teamId OR match.away_team_id = :teamId', {
            teamId: this.id
        })
            .leftJoinAndSelect('match.home_team', 'home_team')
            .leftJoinAndSelect('match.away_team', 'away_team')
            .leftJoinAndSelect('match.venue', 'venue')
            .orderBy('match.match_date', 'DESC')
            .getMany();
    }
    getUpcomingMatches() {
        return Match_1.Match.createQueryBuilder('match')
            .where('match.home_team_id = :teamId OR match.away_team_id = :teamId', {
            teamId: this.id
        })
            .andWhere('match.match_date > :now', { now: new Date() })
            .leftJoinAndSelect('match.home_team', 'home_team')
            .leftJoinAndSelect('match.away_team', 'away_team')
            .leftJoinAndSelect('match.venue', 'venue')
            .orderBy('match.match_date', 'ASC')
            .take(5)
            .getMany();
    }
};
exports.Team = Team;
__decorate([
    (0, typeorm_1.Column)({ name: 'league_id' }),
    __metadata("design:type", String)
], Team.prototype, "league_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
    }),
    __metadata("design:type", String)
], Team.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        unique: true,
    }),
    __metadata("design:type", String)
], Team.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Team.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], Team.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], Team.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], Team.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 8,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Team.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 11,
        scale: 8,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Team.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], Team.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Team.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], Team.prototype, "founded_year", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 7,
        default: '#000000',
        comment: 'Team primary color',
    }),
    __metadata("design:type", String)
], Team.prototype, "primary_color", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 7,
        default: '#FFFFFF',
        comment: 'Team secondary color',
    }),
    __metadata("design:type", String)
], Team.prototype, "secondary_color", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], Team.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => League_1.League, (league) => league.teams, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'league_id' }),
    __metadata("design:type", League_1.League)
], Team.prototype, "league", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Match_1.Match, (match) => match.home_team),
    __metadata("design:type", Array)
], Team.prototype, "home_matches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Match_1.Match, (match) => match.away_team),
    __metadata("design:type", Array)
], Team.prototype, "away_matches", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Team.prototype, "generateSlug", null);
exports.Team = Team = __decorate([
    (0, typeorm_1.Entity)('teams'),
    (0, typeorm_1.Index)(['league_id']),
    (0, typeorm_1.Index)(['slug'], { unique: true })
], Team);
//# sourceMappingURL=Team.js.map