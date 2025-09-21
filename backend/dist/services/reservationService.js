const { v4: uuidv4 } = require('uuid');
const { cache, redis } = require('../config/redis');
const { db, withTransaction } = require('../config/database');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
class ReservationService {
    constructor() {
        this.RESERVATION_TTL = 15 * 60; // 15 minutes in seconds
        this.LOCK_TTL = 30; // 30 seconds for atomic operations
    }
    /**
     * Reserve seats for a user to prevent overselling
     * Uses Redis distributed locks and atomic operations
     */
    async reserveSeats(eventId, ticketType, quantity, userId, sessionId = null) {
        const lockKey = `lock:event:${eventId}:${ticketType}`;
        const reservationKey = `reservation:${eventId}:${ticketType}`;
        const userReservationKey = `user_reservation:${userId || sessionId}`;
        // Acquire distributed lock
        const lockToken = await this.acquireLock(lockKey, this.LOCK_TTL);
        if (!lockToken) {
            throw new AppError('Unable to process reservation, please try again', 429);
        }
        try {
            // Check event availability
            const event = await this.getEventFromCache(eventId);
            if (!event || event.status !== 'published') {
                throw new AppError('Event not available for booking', 400);
            }
            // Check current reservations and availability
            const availableCount = await this.getAvailableTicketCount(eventId, ticketType);
            const reservedCount = await this.getReservedTicketCount(eventId, ticketType);
            if (availableCount - reservedCount < quantity) {
                throw new AppError(`Only ${availableCount - reservedCount} tickets available`, 400);
            }
            // Create reservation
            const reservationToken = uuidv4();
            const reservation = {
                id: uuidv4(),
                eventId,
                ticketType,
                quantity,
                userId,
                sessionId,
                reservationToken,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + this.RESERVATION_TTL * 1000).toISOString(),
                status: 'active'
            };
            // Store reservation in Redis with TTL
            await Promise.all([
                cache.set(`reservation:${reservationToken}`, reservation, this.RESERVATION_TTL),
                cache.sadd(`${reservationKey}:active`, reservationToken),
                cache.set(`${userReservationKey}:${eventId}`, reservationToken, this.RESERVATION_TTL),
                // Update reserved count
                cache.incrby(`reserved:${eventId}:${ticketType}`, quantity),
                cache.expire(`reserved:${eventId}:${ticketType}`, this.RESERVATION_TTL + 60)
            ]);
            // Schedule cleanup
            await this.scheduleReservationCleanup(reservationToken, this.RESERVATION_TTL);
            logger.info('Seats reserved successfully', {
                reservationToken,
                eventId,
                ticketType,
                quantity,
                userId
            });
            return {
                reservationToken,
                expiresAt: reservation.expiresAt,
                quantity,
                ticketType
            };
        }
        finally {
            // Release lock
            await this.releaseLock(lockKey, lockToken);
        }
    }
    /**
     * Confirm reservation and convert to actual tickets
     */
    async confirmReservation(reservationToken, paymentId) {
        const reservation = await cache.get(`reservation:${reservationToken}`);
        if (!reservation) {
            throw new AppError('Reservation not found or expired', 404);
        }
        if (reservation.status !== 'active') {
            throw new AppError('Reservation is no longer active', 400);
        }
        const lockKey = `lock:confirm:${reservationToken}`;
        const lockToken = await this.acquireLock(lockKey, this.LOCK_TTL);
        if (!lockToken) {
            throw new AppError('Unable to confirm reservation, please try again', 429);
        }
        try {
            return await withTransaction(async (trx) => {
                // Get available tickets from database
                const availableTickets = await trx('tickets')
                    .where({
                    event_id: reservation.eventId,
                    ticket_type: reservation.ticketType,
                    status: 'available'
                })
                    .limit(reservation.quantity)
                    .forUpdate(); // Lock rows to prevent race conditions
                if (availableTickets.length < reservation.quantity) {
                    throw new AppError('Insufficient tickets available', 400);
                }
                // Update tickets to sold status
                const ticketIds = availableTickets.map(t => t.id);
                await trx('tickets')
                    .whereIn('id', ticketIds)
                    .update({
                    status: 'sold',
                    user_id: reservation.userId,
                    payment_id: paymentId,
                    purchased_at: new Date(),
                    updated_at: new Date()
                });
                // Update reservation status
                reservation.status = 'confirmed';
                reservation.confirmedAt = new Date().toISOString();
                reservation.paymentId = paymentId;
                // Update cache
                await Promise.all([
                    cache.set(`reservation:${reservationToken}`, reservation, 3600), // Keep for 1 hour
                    cache.srem(`reservation:${reservation.eventId}:${reservation.ticketType}:active`, reservationToken),
                    cache.decrby(`reserved:${reservation.eventId}:${reservation.ticketType}`, reservation.quantity),
                    // Update event statistics
                    cache.incrby(`sold:${reservation.eventId}:${reservation.ticketType}`, reservation.quantity)
                ]);
                logger.info('Reservation confirmed successfully', {
                    reservationToken,
                    paymentId,
                    ticketIds,
                    eventId: reservation.eventId
                });
                return {
                    ticketIds,
                    reservation
                };
            });
        }
        finally {
            await this.releaseLock(lockKey, lockToken);
        }
    }
    /**
     * Cancel/release reservation
     */
    async cancelReservation(reservationToken, reason = 'user_cancelled') {
        const reservation = await cache.get(`reservation:${reservationToken}`);
        if (!reservation) {
            return; // Already expired or cancelled
        }
        const lockKey = `lock:cancel:${reservationToken}`;
        const lockToken = await this.acquireLock(lockKey, this.LOCK_TTL);
        if (!lockToken) {
            throw new AppError('Unable to cancel reservation, please try again', 429);
        }
        try {
            // Update reservation status
            reservation.status = 'cancelled';
            reservation.cancelledAt = new Date().toISOString();
            reservation.cancellationReason = reason;
            // Update cache
            await Promise.all([
                cache.set(`reservation:${reservationToken}`, reservation, 300), // Keep for 5 minutes
                cache.srem(`reservation:${reservation.eventId}:${reservation.ticketType}:active`, reservationToken),
                cache.decrby(`reserved:${reservation.eventId}:${reservation.ticketType}`, reservation.quantity),
                cache.del(`user_reservation:${reservation.userId || reservation.sessionId}:${reservation.eventId}`)
            ]);
            logger.info('Reservation cancelled', {
                reservationToken,
                reason,
                eventId: reservation.eventId
            });
        }
        finally {
            await this.releaseLock(lockKey, lockToken);
        }
    }
    /**
     * Get reservation details
     */
    async getReservation(reservationToken) {
        const reservation = await cache.get(`reservation:${reservationToken}`);
        if (!reservation) {
            throw new AppError('Reservation not found or expired', 404);
        }
        return reservation;
    }
    /**
     * Get user's active reservations
     */
    async getUserReservations(userId) {
        const pattern = `user_reservation:${userId}:*`;
        const keys = await redis.keys(pattern);
        const reservationTokens = await Promise.all(keys.map(key => cache.get(key)));
        const reservations = await Promise.all(reservationTokens.filter(token => token).map(token => cache.get(`reservation:${token}`)));
        return reservations.filter(r => r && r.status === 'active');
    }
    /**
     * Acquire distributed lock using Redis
     */
    async acquireLock(lockKey, ttl) {
        const lockToken = uuidv4();
        const result = await redis.set(lockKey, lockToken, 'PX', ttl * 1000, 'NX');
        return result === 'OK' ? lockToken : null;
    }
    /**
     * Release distributed lock
     */
    async releaseLock(lockKey, lockToken) {
        const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
        return await redis.eval(script, 1, lockKey, lockToken);
    }
    /**
     * Get available ticket count from cache or database
     */
    async getAvailableTicketCount(eventId, ticketType) {
        const cacheKey = `available:${eventId}:${ticketType}`;
        let count = await cache.get(cacheKey);
        if (count === null) {
            // Fetch from database and cache
            const result = await db('tickets')
                .where({
                event_id: eventId,
                ticket_type: ticketType,
                status: 'available'
            })
                .count('* as count');
            count = parseInt(result[0].count);
            await cache.set(cacheKey, count, 300); // Cache for 5 minutes
        }
        return count;
    }
    /**
     * Get reserved ticket count from cache
     */
    async getReservedTicketCount(eventId, ticketType) {
        const count = await cache.get(`reserved:${eventId}:${ticketType}`);
        return count || 0;
    }
    /**
     * Get event from cache or database
     */
    async getEventFromCache(eventId) {
        const cacheKey = `event:${eventId}`;
        let event = await cache.get(cacheKey);
        if (!event) {
            event = await db('events').where('id', eventId).first();
            if (event) {
                await cache.set(cacheKey, event, 600); // Cache for 10 minutes
            }
        }
        return event;
    }
    /**
     * Schedule reservation cleanup
     */
    async scheduleReservationCleanup(reservationToken, delay) {
        // In a production environment, you'd use a job queue like Bull
        setTimeout(async () => {
            try {
                await this.cancelReservation(reservationToken, 'expired');
            }
            catch (error) {
                logger.error('Failed to cleanup expired reservation:', error);
            }
        }, delay * 1000);
    }
    /**
     * Clean up expired reservations (run periodically)
     */
    async cleanupExpiredReservations() {
        try {
            const pattern = 'reservation:*';
            const keys = await redis.keys(pattern);
            for (const key of keys) {
                const reservation = await cache.get(key);
                if (reservation && reservation.status === 'active') {
                    const expiresAt = new Date(reservation.expiresAt);
                    if (expiresAt < new Date()) {
                        await this.cancelReservation(reservation.reservationToken, 'expired');
                    }
                }
            }
        }
        catch (error) {
            logger.error('Failed to cleanup expired reservations:', error);
        }
    }
}
module.exports = new ReservationService();
//# sourceMappingURL=reservationService.js.map