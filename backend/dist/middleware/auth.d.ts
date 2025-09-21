export function authenticate(req: any, res: any, next: any): Promise<void>;
export function authorize(...roles: any[]): (req: any, res: any, next: any) => void;
export function generateToken(payload: any): never;
//# sourceMappingURL=auth.d.ts.map