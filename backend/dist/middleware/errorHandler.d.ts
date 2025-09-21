export class AppError extends Error {
    constructor(message: any, statusCode: any, code?: any);
    statusCode: any;
    status: string;
    isOperational: boolean;
    code: any;
}
export function errorHandler(err: any, req: any, res: any, next: any): void;
export function catchAsync(fn: any): (req: any, res: any, next: any) => void;
//# sourceMappingURL=errorHandler.d.ts.map