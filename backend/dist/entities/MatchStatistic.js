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
exports.MatchStatistic = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Match_1 = require("./Match");
let MatchStatistic = class MatchStatistic extends BaseEntity_1.BaseEntity {
    // Methods
    calculateAttendanceRate() {
        if (this.total_tickets_sold === 0)
            return 0;
        return (this.tickets_scanned / this.total_tickets_sold) * 100;
    }
    getRevenue() {
        return Number(this.total_revenue);
    }
    updateSalesStats(paymentMethod) {
        this.total_tickets_sold += 1;
        switch (paymentMethod) {
            case 'ussd':
                this.ussd_sales += 1;
                break;
            case 'mobile_money':
                this.mobile_sales += 1;
                break;
            default:
                this.web_sales += 1;
        }
    }
};
exports.MatchStatistic = MatchStatistic;
__decorate([
    (0, typeorm_1.Column)({ name: 'match_id' }),
    __metadata("design:type", String)
], MatchStatistic.prototype, "match_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], MatchStatistic.prototype, "total_tickets_sold", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], MatchStatistic.prototype, "total_revenue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], MatchStatistic.prototype, "tickets_scanned", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], MatchStatistic.prototype, "web_sales", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], MatchStatistic.prototype, "mobile_sales", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], MatchStatistic.prototype, "ussd_sales", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
        comment: 'Attendance percentage',
    }),
    __metadata("design:type", Number)
], MatchStatistic.prototype, "attendance_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: true,
        comment: 'Hourly sales data',
    }),
    __metadata("design:type", Object)
], MatchStatistic.prototype, "sales_by_hour", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: true,
        comment: 'Payment method breakdown',
    }),
    __metadata("design:type", Object)
], MatchStatistic.prototype, "payment_methods", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], MatchStatistic.prototype, "peak_sales_time", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], MatchStatistic.prototype, "cancelled_tickets", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Match_1.Match, (match) => match.statistics, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'match_id' }),
    __metadata("design:type", Match_1.Match)
], MatchStatistic.prototype, "match", void 0);
exports.MatchStatistic = MatchStatistic = __decorate([
    (0, typeorm_1.Entity)('match_statistics'),
    (0, typeorm_1.Index)(['match_id'], { unique: true })
], MatchStatistic);
//# sourceMappingURL=MatchStatistic.js.map