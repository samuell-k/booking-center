"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const BaseEntity_1 = require("./BaseEntity");
const Ticket_1 = require("./Ticket");
let User = class User extends BaseEntity_1.BaseEntity {
    // Hooks
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(12);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
    normalizePhoneNumber() {
        // Normalize phone number format for Rwanda
        this.phone_number = this.phone_number.replace(/\D/g, '');
        if (this.phone_number.startsWith('0')) {
            this.phone_number = '250' + this.phone_number.substring(1);
        }
        if (!this.phone_number.startsWith('250')) {
            this.phone_number = '250' + this.phone_number;
        }
    }
    // Methods
    async validatePassword(password) {
        if (!this.password)
            return false;
        return bcrypt.compare(password, this.password);
    }
    hasWalletBalance(amount) {
        return this.wallet_balance >= amount;
    }
    deductFromWallet(amount) {
        if (this.hasWalletBalance(amount)) {
            this.wallet_balance = Number(this.wallet_balance) - amount;
        }
        else {
            throw new Error('Insufficient wallet balance');
        }
    }
    addToWallet(amount) {
        this.wallet_balance = Number(this.wallet_balance) + amount;
    }
    toJSON() {
        const { password, ...result } = this;
        return result;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 15,
        unique: true,
        comment: 'Phone number for USSD integration',
    }),
    __metadata("design:type", String)
], User.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        select: false, // Don't select password by default
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
    }),
    __metadata("design:type", String)
], User.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
        comment: 'Account status for USSD access',
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], User.prototype, "last_login_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.00,
        comment: 'User wallet balance for mobile payments',
    }),
    __metadata("design:type", Number)
], User.prototype, "wallet_balance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 10,
        default: 'en',
        comment: 'Language preference for USSD',
    }),
    __metadata("design:type", String)
], User.prototype, "preferred_language", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ticket_1.Ticket, (ticket) => ticket.user),
    __metadata("design:type", Array)
], User.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "normalizePhoneNumber", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)(['phone_number'], { unique: true }),
    (0, typeorm_1.Index)(['email'], { unique: true })
], User);
//# sourceMappingURL=User.js.map