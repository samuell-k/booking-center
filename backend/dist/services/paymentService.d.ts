declare const _exports: PaymentService;
export = _exports;
declare class PaymentService {
    mtnConfig: {
        baseURL: string;
        subscriptionKey: string;
        apiUserId: string;
        apiKey: string;
        callbackUrl: string;
    };
    airtelConfig: {
        baseURL: string;
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    rswitchConfig: {
        baseURL: string;
        merchantId: string;
        apiKey: string;
        secretKey: string;
        callbackUrl: string;
    };
    initiatePayment(paymentData: any): Promise<any>;
    processPaymentWithFailover(payment: any, customerPhone: any): Promise<{
        externalReference: any;
        status: string;
        paymentUrl: any;
        providerData: any;
    }>;
    getProvidersByMethod(paymentMethod: any): any;
    calculateFraudScore(paymentData: any): Promise<number>;
    formatPaymentResponse(payment: any): {
        payment_id: any;
        payment_reference: any;
        status: any;
        external_reference: any;
        payment_url: any;
        expires_at: any;
        fraud_score: any;
    };
    processMTNMoMoPayment(payment: any, phoneNumber: any): Promise<{
        externalReference: string;
        status: string;
        paymentUrl: any;
        providerData: any;
    }>;
    getMTNAccessToken(): Promise<any>;
    processAirtelMoneyPayment(payment: any, phoneNumber: any): Promise<{
        externalReference: any;
        status: string;
        paymentUrl: any;
        providerData: any;
    }>;
    getAirtelAccessToken(): Promise<any>;
    processRSwitchPayment(payment: any): Promise<{
        externalReference: any;
        status: string;
        paymentUrl: any;
        providerData: any;
    }>;
    generateRSwitchSignature(data: any): string;
    processWalletPayment(payment: any): Promise<{
        externalReference: any;
        status: string;
        paymentUrl: any;
        providerData: {
            wallet_transaction_id: any;
        };
    }>;
    checkPaymentStatus(paymentId: any): Promise<any>;
    checkMTNPaymentStatus(payment: any): Promise<"failed" | "processing" | "completed">;
    checkAirtelPaymentStatus(payment: any): Promise<"failed" | "processing" | "completed">;
    verifyWebhookSignature(payload: any, signature: any, secret: any): boolean;
    processWebhook(webhookData: any, signature: any, provider: any): Promise<any>;
    updatePaymentStatus(paymentId: any, newStatus: any, trx?: any): Promise<any>;
    getWebhookSecret(provider: any): any;
    retryPayment(paymentId: any): Promise<any>;
}
//# sourceMappingURL=paymentService.d.ts.map