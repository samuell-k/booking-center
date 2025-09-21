interface USSDResponse {
    message: string;
    continueSession: boolean;
    data?: any;
}
export declare class USSDService {
    private userRepository;
    private matchRepository;
    private ticketRepository;
    private ticketService;
    constructor();
    handleUSSDRequest(phoneNumber: string, text: string, sessionId: string): Promise<USSDResponse>;
    private handleBuyTicket;
    private handleMyTickets;
    private handleCheckBalance;
    private handleRegistration;
}
export {};
//# sourceMappingURL=USSDService.d.ts.map