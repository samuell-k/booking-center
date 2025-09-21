import { BaseEntity } from './BaseEntity';
import { Ticket } from './Ticket';
export declare class User extends BaseEntity {
    phone_number: string;
    email?: string;
    password?: string;
    full_name: string;
    is_active: boolean;
    last_login_at?: Date;
    wallet_balance: number;
    preferred_language: string;
    tickets: Ticket[];
    hashPassword(): Promise<void>;
    normalizePhoneNumber(): void;
    validatePassword(password: string): Promise<boolean>;
    hasWalletBalance(amount: number): boolean;
    deductFromWallet(amount: number): void;
    addToWallet(amount: number): void;
    toJSON(): Omit<this, "hasId" | "save" | "remove" | "softRemove" | "recover" | "reload" | "password" | "hashPassword" | "normalizePhoneNumber" | "validatePassword" | "hasWalletBalance" | "deductFromWallet" | "addToWallet" | "toJSON">;
}
//# sourceMappingURL=User.d.ts.map