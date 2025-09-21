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
exports.Ticket = exports.PaymentMethod = exports.TicketStatus = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const User_1 = require("./User");
const Match_1 = require("./Match");
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["ACTIVE"] = "active";
    TicketStatus["USED"] = "used";
    TicketStatus["CANCELLED"] = "cancelled";
    TicketStatus["EXPIRED"] = "expired";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["USSD"] = "ussd";
    PaymentMethod["MOBILE_MONEY"] = "mobile_money";
    PaymentMethod["WALLET"] = "wallet";
    PaymentMethod["CASH"] = "cash";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let Ticket = class Ticket extends BaseEntity_1.BaseEntity {
    // Hooks
    generateTicketCode() {
        if (!this.ticket_code) {
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            this.ticket_code = `TKT${timestamp}${random}`;
        }
        if (!this.expires_at) {
            // Ticket expires 24 hours after match
            this.expires_at = new Date(this.match.match_date.getTime() + (24 * 60 * 60 * 1000));
        }
    }
    // Methods
    isValid() {
        const now = new Date();
        return this.status === TicketStatus.ACTIVE &&
            (!this.expires_at || now <= this.expires_at);
    }
    canBeUsed() {
        return this.isValid() && !this.used_at;
    }
    markAsUsed() {
        this.status = TicketStatus.USED;
        this.used_at = new Date();
    }
    cancel() {
        this.status = TicketStatus.CANCELLED;
    }
    isExpired() {
        if (!this.expires_at)
            return false;
        return new Date() > this.expires_at;
    }
    getQRCodeData() {
        return JSON.stringify({
            code: this.ticket_code,
            match_id: this.match_id,
            user_id: this.user_id,
            issued_at: this.created_at,
        });
    }
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Ticket.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'match_id' }),
    __metadata("design:type", String)
], Ticket.prototype, "match_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        unique: true,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "ticket_code", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 8,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Ticket.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.USSD,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "payment_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: 'general',
        comment: 'general, vip, premium',
    }),
    __metadata("design:type", String)
], Ticket.prototype, "seat_category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "seat_number", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Ticket.prototype, "used_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 15,
        nullable: true,
        comment: 'Phone number used for purchase via USSD',
    }),
    __metadata("design:type", String)
], Ticket.prototype, "purchase_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: true,
        comment: 'Additional ticket metadata',
    }),
    __metadata("design:type", Object)
], Ticket.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Ticket.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.tickets, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], Ticket.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Match_1.Match, (match) => match.tickets, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'match_id' }),
    __metadata("design:type", Match_1.Match)
], Ticket.prototype, "match", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Ticket.prototype, "generateTicketCode", null);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)('tickets'),
    (0, typeorm_1.Index)(['user_id']),
    (0, typeorm_1.Index)(['match_id']),
    (0, typeorm_1.Index)(['ticket_code'], { unique: true }),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['payment_method'])
], Ticket);
//# sourceMappingURL=Ticket.js.map