declare const _exports: ReservationService;
export = _exports;
declare class ReservationService {
    RESERVATION_TTL: number;
    LOCK_TTL: number;
    /**
     * Reserve seats for a user to prevent overselling
     * Uses Redis distributed locks and atomic operations
     */
    reserveSeats(eventId: any, ticketType: any, quantity: any, userId: any, sessionId?: any): Promise<{
        reservationToken: string;
        expiresAt: string;
        quantity: any;
        ticketType: any;
    }>;
    /**
     * Confirm reservation and convert to actual tickets
     */
    confirmReservation(reservationToken: any, paymentId: any): Promise<any>;
    /**
     * Cancel/release reservation
     */
    cancelReservation(reservationToken: any, reason?: string): Promise<void>;
    /**
     * Get reservation details
     */
    getReservation(reservationToken: any): Promise<any>;
    /**
     * Get user's active reservations
     */
    getUserReservations(userId: any): Promise<any>;
    /**
     * Acquire distributed lock using Redis
     */
    acquireLock(lockKey: any, ttl: any): Promise<string>;
    /**
     * Release distributed lock
     */
    releaseLock(lockKey: any, lockToken: any): Promise<any>;
    /**
     * Get available ticket count from cache or database
     */
    getAvailableTicketCount(eventId: any, ticketType: any): Promise<any>;
    /**
     * Get reserved ticket count from cache
     */
    getReservedTicketCount(eventId: any, ticketType: any): Promise<any>;
    /**
     * Get event from cache or database
     */
    getEventFromCache(eventId: any): Promise<any>;
    /**
     * Schedule reservation cleanup
     */
    scheduleReservationCleanup(reservationToken: any, delay: any): Promise<void>;
    /**
     * Clean up expired reservations (run periodically)
     */
    cleanupExpiredReservations(): Promise<void>;
}
//# sourceMappingURL=reservationService.d.ts.map