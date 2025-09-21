export namespace rateLimits {
    let general: any;
    let auth: any;
    let payment: any;
    let ticketPurchase: any;
    let search: any;
}
export const speedLimiter: any;
export function bruteForceProtection(req: any, res: any, next: any): Promise<void>;
export function recordFailedAttempt(key: any): Promise<void>;
export function clearFailedAttempts(key: any): Promise<void>;
export function correlationId(req: any, res: any, next: any): void;
export function requestLogger(req: any, res: any, next: any): void;
export function sanitizeInput(req: any, res: any, next: any): void;
export function securityHeaders(req: any, res: any, next: any): void;
export function ipWhitelist(allowedIPs?: any[]): (req: any, res: any, next: any) => any;
export function suspiciousActivityDetection(req: any, res: any, next: any): Promise<void>;
//# sourceMappingURL=security.d.ts.map