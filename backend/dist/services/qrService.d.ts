declare const _exports: QRService;
export = _exports;
declare class QRService {
    qrOptions: {
        errorCorrectionLevel: string;
        type: string;
        quality: number;
        margin: number;
        color: {
            dark: string;
            light: string;
        };
        width: number;
    };
    generateTicketQR(ticketData: any): Promise<{
        qrString: string;
        qrCodeBuffer: any;
        qrCodeDataURL: any;
        signature: string;
    }>;
    generateSignature(data: any): string;
    verifySignature(data: any, signature: any): boolean;
    validateQR(qrString: any, scannerInfo?: {}): Promise<{
        valid: boolean;
        reason: string;
        code: string;
        usedAt?: undefined;
        allowedFrom?: undefined;
        ticket?: undefined;
    } | {
        valid: boolean;
        reason: string;
        code: string;
        usedAt: any;
        allowedFrom?: undefined;
        ticket?: undefined;
    } | {
        valid: boolean;
        reason: string;
        code: string;
        allowedFrom: Date;
        usedAt?: undefined;
        ticket?: undefined;
    } | {
        valid: boolean;
        ticket: {
            id: any;
            number: any;
            type: any;
            holder: any;
            seat: any;
            section: any;
            row: any;
            event: {
                id: any;
                title: any;
                start: any;
                venue: any;
            };
        };
        reason?: undefined;
        code?: undefined;
        usedAt?: undefined;
        allowedFrom?: undefined;
    }>;
    markTicketAsUsed(ticketId: any, scannerInfo?: {}): Promise<boolean>;
    generateBatchQR(tickets: any): Promise<({
        ticketId: any;
        ticketNumber: any;
        success: boolean;
        qrCode: string;
        qrImage: any;
        qrBuffer: any;
        signature: string;
        error?: undefined;
    } | {
        ticketId: any;
        ticketNumber: any;
        success: boolean;
        error: any;
        qrCode?: undefined;
        qrImage?: undefined;
        qrBuffer?: undefined;
        signature?: undefined;
    })[]>;
    generateIndividualTicketQRs(purchaseData: any): Promise<{
        success: boolean;
        tickets: {
            ticket_id: string;
            ticket_number: string;
            event_id: any;
            user_id: any;
            ticket_type: any;
            seat_number: string;
            section: any;
            row: number;
            customer_name: any;
            customer_phone: any;
            customer_email: any;
            purchase_reference: any;
        }[];
        qrCodes: {
            ticketId: string;
            ticketNumber: string;
            success: boolean;
            qrCode: string;
            qrImage: any;
            qrBuffer: any;
            signature: string;
            ticketData: {
                ticket_id: string;
                ticket_number: string;
                event_id: any;
                user_id: any;
                ticket_type: any;
                seat_number: string;
                section: any;
                row: number;
                customer_name: any;
                customer_phone: any;
                customer_email: any;
                purchase_reference: any;
            };
        }[];
        totalGenerated: any;
    }>;
    generateWalletQR(walletData: any): Promise<{
        qrString: string;
        qrCodeDataURL: any;
    }>;
    generateEventQR(eventData: any): Promise<{
        qrString: string;
        qrCodeDataURL: any;
    }>;
    bulkValidateQR(qrCodes: any, scannerInfo?: {}): Promise<({
        valid: boolean;
        reason: string;
        code: string;
        usedAt?: undefined;
        allowedFrom?: undefined;
        ticket?: undefined;
        qrCode: any;
        error?: undefined;
    } | {
        valid: boolean;
        reason: string;
        code: string;
        usedAt: any;
        allowedFrom?: undefined;
        ticket?: undefined;
        qrCode: any;
        error?: undefined;
    } | {
        valid: boolean;
        reason: string;
        code: string;
        allowedFrom: Date;
        usedAt?: undefined;
        ticket?: undefined;
        qrCode: any;
        error?: undefined;
    } | {
        valid: boolean;
        ticket: {
            id: any;
            number: any;
            type: any;
            holder: any;
            seat: any;
            section: any;
            row: any;
            event: {
                id: any;
                title: any;
                start: any;
                venue: any;
            };
        };
        reason?: undefined;
        code?: undefined;
        usedAt?: undefined;
        allowedFrom?: undefined;
        qrCode: any;
        error?: undefined;
    } | {
        qrCode: any;
        valid: boolean;
        reason: string;
        error: any;
    })[]>;
    getQRStats(eventId?: any): Promise<{
        totalScans: number;
        validScans: number;
        invalidScans: number;
        duplicateScans: number;
        uniqueTickets: number;
        activeScanners: number;
        successRate: string | number;
    }>;
}
//# sourceMappingURL=qrService.d.ts.map