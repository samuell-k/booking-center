import { User } from '../entities/User';
export declare class UserRepository {
    private repository;
    constructor();
    findByPhoneNumber(phoneNumber: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    createUSSDUser(phoneNumber: string, fullName: string): Promise<User>;
    updateWalletBalance(userId: string, amount: number): Promise<void>;
    findActiveUsers(): Promise<User[]>;
    getUserTickets(userId: string): Promise<User | null>;
}
//# sourceMappingURL=UserRepository.d.ts.map