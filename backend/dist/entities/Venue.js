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
exports.Venue = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Match_1 = require("./Match");
let Venue = class Venue extends BaseEntity_1.BaseEntity {
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
    getUpcomingMatches() {
        return Match_1.Match.find({
            where: {
                venue_id: this.id,
            },
            relations: ['home_team', 'away_team', 'league'],
            order: { match_date: 'ASC' },
            take: 10,
        });
    }
    calculateTicketPrice(basePrice) {
        return basePrice * Number(this.price_multiplier);
    }
    getAvailableCapacity(matchId) {
        // This would typically involve a more complex query
        return Promise.resolve(this.capacity);
    }
};
exports.Venue = Venue;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
    }),
    __metadata("design:type", String)
], Venue.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        unique: true,
    }),
    __metadata("design:type", String)
], Venue.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Venue.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], Venue.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], Venue.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], Venue.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 8,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Venue.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 11,
        scale: 8,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Venue.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Venue.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: true,
        comment: 'Venue facilities and amenities',
    }),
    __metadata("design:type", Array)
], Venue.prototype, "facilities", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], Venue.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 1.0,
        comment: 'Price multiplier for this venue',
    }),
    __metadata("design:type", Number)
], Venue.prototype, "price_multiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], Venue.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: 'outdoor',
        comment: 'indoor, outdoor, covered',
    }),
    __metadata("design:type", String)
], Venue.prototype, "venue_type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Match_1.Match, (match) => match.venue),
    __metadata("design:type", Array)
], Venue.prototype, "matches", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Venue.prototype, "generateSlug", null);
exports.Venue = Venue = __decorate([
    (0, typeorm_1.Entity)('venues'),
    (0, typeorm_1.Index)(['slug'], { unique: true }),
    (0, typeorm_1.Index)(['city']),
    (0, typeorm_1.Index)(['is_active'])
], Venue);
//# sourceMappingURL=Venue.js.map