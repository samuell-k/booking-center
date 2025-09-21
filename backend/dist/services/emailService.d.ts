declare const _exports: EmailService;
export = _exports;
declare class EmailService {
    transporter: any;
    from: string;
    templatesPath: string;
    sendEmail({ to, subject, template, data, attachments }: {
        to: any;
        subject: any;
        template: any;
        data?: {};
        attachments?: any[];
    }): Promise<{
        success: boolean;
        messageId: any;
    }>;
    renderTemplate(templateName: any, data: any): Promise<string>;
    sendWelcomeEmail(user: any): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendEmailVerification(user: any, token: any): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendPasswordReset(user: any, token: any): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendTicketConfirmation(user: any, tickets: any, event: any, payment: any, qrCodes?: any[]): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendIndividualQRCodes(user: any, tickets: any, event: any, payment: any, qrCodes: any): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendEventReminder(user: any, event: any, tickets: any): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendPaymentConfirmation(user: any, payment: any): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendWalletTopupConfirmation(user: any, transaction: any): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendEventCancellation(user: any, event: any, tickets: any): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendPromotionalEmail(user: any, promotion: any): Promise<{
        success: boolean;
        messageId: any;
    }>;
    generateTicketPDF(ticket: any, event: any): Promise<Buffer<ArrayBuffer>>;
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=emailService.d.ts.map