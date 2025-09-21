"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
class UserRepository {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async findByPhoneNumber(phoneNumber) {
        return this.repository.findOne({
            where: { phone_number: phoneNumber },
            relations: ['tickets'],
        });
    }
    async findByEmail(email) {
        return this.repository.findOne({
            where: { email },
            relations: ['tickets'],
        });
    }
    async createUSSDUser(phoneNumber, fullName) {
        const user = this.repository.create({
            phone_number: phoneNumber,
            full_name: fullName,
            is_active: true,
        });
        return this.repository.save(user);
    }
    async updateWalletBalance(userId, amount) {
        await this.repository.update(userId, { wallet_balance: amount });
    }
    async findActiveUsers() {
        return this.repository.find({
            where: { is_active: true },
            order: { created_at: 'DESC' },
        });
    }
    async getUserTickets(userId) {
        return this.repository.findOne({
            where: { id: userId },
            relations: ['tickets', 'tickets.match', 'tickets.match.home_team', 'tickets.match.away_team'],
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map