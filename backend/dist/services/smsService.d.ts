declare const _exports: SMSService;
export = _exports;
declare class SMSService {
    twilioClient: import("twilio/lib/rest/Twilio");
    twilioPhone: string;
    africasTalking: any;
    atSMS: any;
    atSenderId: string;
    defaultProvider: string;
    sendSMS({ to, message, provider }: {
        to: any;
        message: any;
        provider?: string;
    }): Promise<{
        success: boolean;
        messageId: any;
        provider: "africastalking" | "twilio";
    }>;
    sendTwilioSMS(to: any, message: any): Promise<{
        messageId: string;
        status: import("twilio/lib/rest/api/v2010/account/message").MessageStatus;
    }>;
    sendAfricasTalkingSMS(to: any, message: any): Promise<{
        messageId: any;
        status: string;
    }>;
    normalizePhoneNumber(phoneNumber: any): string;
    sendVerificationCode(phoneNumber: any, code: any): Promise<{
        success: boolean;
        messageId: any;
        provider: "africastalking" | "twilio";
    }>;
    sendTicketConfirmation(phoneNumber: any, ticketDetails: any): Promise<{
        success: boolean;
        messageId: any;
        provider: "africastalking" | "twilio";
    }>;
    sendPaymentConfirmation(phoneNumber: any, paymentDetails: any): Promise<{
        success: boolean;
        messageId: any;
        provider: "africastalking" | "twilio";
    }>;
    sendEventReminder(phoneNumber: any, eventDetails: any): Promise<{
        success: boolean;
        messageId: any;
        provider: "africastalking" | "twilio";
    }>;
    sendWalletTopupConfirmation(phoneNumber: any, topupDetails: any): Promise<{
        success: boolean;
        messageId: any;
        provider: "africastalking" | "twilio";
    }>;
    sendLowBalanceAlert(phoneNumber: any, balance: any): Promise<{
        success: boolean;
        messageId: any;
        provider: "africastalking" | "twilio";
    }>;
    sendEventCancellation(phoneNumber: any, eventDetails: any): Promise<{
        success: boolean;
        messageId: any;
        provider: "africastalking" | "twilio";
    }>;
    sendSecurityAlert(phoneNumber: any, alertDetails: any): Promise<{
        success: boolean;
        messageId: any;
        provider: "africastalking" | "twilio";
    }>;
    sendPromotionalSMS(phoneNumber: any, promotion: any): Promise<{
        success: boolean;
        messageId: any;
        provider: "africastalking" | "twilio";
    }>;
    sendBulkSMS(recipients: any, message: any): Promise<({
        phoneNumber: any;
        success: boolean;
        messageId: any;
        error?: undefined;
    } | {
        phoneNumber: any;
        success: boolean;
        error: any;
        messageId?: undefined;
    })[]>;
    personalizeMessage(template: any, recipient: any): any;
    checkDeliveryStatus(messageId: any, provider?: string): Promise<{
        status: import("twilio/lib/rest/api/v2010/account/message").MessageStatus;
        errorCode: number;
        errorMessage: string;
        dateUpdated: Date;
    } | {
        status: string;
        note: string;
    } | {
        status: string;
        error: any;
    }>;
    checkTwilioStatus(messageId: any): Promise<{
        status: import("twilio/lib/rest/api/v2010/account/message").MessageStatus;
        errorCode: number;
        errorMessage: string;
        dateUpdated: Date;
    }>;
    checkAfricasTalkingStatus(messageId: any): Promise<{
        status: string;
        note: string;
    }>;
    testService(): Promise<boolean>;
}
//# sourceMappingURL=smsService.d.ts.map