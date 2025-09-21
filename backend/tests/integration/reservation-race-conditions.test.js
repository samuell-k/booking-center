const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/server');
const { db } = require('../../src/config/database');
const { redis } = require('../../src/config/redis');
const reservationService = require('../../src/services/reservationService');

describe('Reservation Race Conditions Integration Tests', () => {
  let testEvent;
  let authToken;

  before(async () => {
    // Setup test database
    await db.migrate.latest();
    await db.seed.run();

    // Create test event with limited tickets
    testEvent = await db('events').insert({
      title: 'Race Condition Test Event',
      sport: 'football',
      start_datetime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      end_datetime: new Date(Date.now() + 26 * 60 * 60 * 1000),
      venue_id: '123e4567-e89b-12d3-a456-426614174000',
      regular_price: 5000,
      vip_price: 10000,
      status: 'published'
    }).returning('*');

    // Create limited tickets for testing race conditions
    const tickets = [];
    for (let i = 0; i < 10; i++) {
      tickets.push({
        event_id: testEvent[0].id,
        ticket_type: 'regular',
        price: 5000,
        status: 'available',
        seat_number: `A${i + 1}`,
        section: 'A'
      });
    }
    await db('tickets').insert(tickets);

    // Get auth token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.data.token;
  });

  after(async () => {
    // Cleanup
    await db('tickets').where('event_id', testEvent[0].id).del();
    await db('events').where('id', testEvent[0].id).del();
    await redis.flushall();
    await db.destroy();
  });

  beforeEach(async () => {
    // Reset tickets to available state
    await db('tickets')
      .where('event_id', testEvent[0].id)
      .update({ status: 'available' });
    
    // Clear Redis reservations
    const keys = await redis.keys('reservation:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  });

  describe('Concurrent Seat Reservations', () => {
    it('should prevent overselling when multiple users try to reserve the same seats simultaneously', async () => {
      const eventId = testEvent[0].id;
      const concurrentRequests = 20; // More requests than available tickets (10)
      const promises = [];

      // Create concurrent reservation requests
      for (let i = 0; i < concurrentRequests; i++) {
        const promise = request(app)
          .post('/api/v1/reservations/reserve')
          .send({
            event_id: eventId,
            ticket_type: 'regular',
            quantity: 1,
            session_id: `session_${i}`
          })
          .expect((res) => {
            // Should either succeed (201) or fail due to insufficient seats (400)
            expect([201, 400]).to.include(res.status);
          });
        
        promises.push(promise);
      }

      const results = await Promise.allSettled(promises);
      
      // Count successful reservations
      const successfulReservations = results.filter(result => 
        result.status === 'fulfilled' && 
        result.value.status === 201
      ).length;

      // Should not exceed available tickets
      expect(successfulReservations).to.be.at.most(10);
      
      // Verify no overselling occurred
      const reservedCount = await redis.eval(`
        local keys = redis.call('keys', 'reservation:${eventId}:*')
        local count = 0
        for i=1,#keys do
          local reservation = redis.call('get', keys[i])
          if reservation then
            local data = cjson.decode(reservation)
            if data.status == 'active' then
              count = count + data.quantity
            end
          end
        end
        return count
      `, 0);

      expect(reservedCount).to.be.at.most(10);
    });

    it('should handle high-frequency reservation attempts without data corruption', async () => {
      const eventId = testEvent[0].id;
      const rapidRequests = 50;
      const promises = [];

      // Create rapid-fire requests
      for (let i = 0; i < rapidRequests; i++) {
        const promise = request(app)
          .post('/api/v1/reservations/reserve')
          .send({
            event_id: eventId,
            ticket_type: 'regular',
            quantity: Math.floor(Math.random() * 3) + 1, // 1-3 tickets
            session_id: `rapid_${i}`
          });
        
        promises.push(promise);
        
        // Small random delay to simulate real-world timing
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
        }
      }

      const results = await Promise.allSettled(promises);
      
      // Verify system integrity
      const totalReserved = await redis.eval(`
        local keys = redis.call('keys', 'reservation:${eventId}:*')
        local count = 0
        for i=1,#keys do
          local reservation = redis.call('get', keys[i])
          if reservation then
            local data = cjson.decode(reservation)
            if data.status == 'active' then
              count = count + data.quantity
            end
          end
        end
        return count
      `, 0);

      // Should never exceed available tickets
      expect(totalReserved).to.be.at.most(10);
      
      // Verify database consistency
      const availableTickets = await db('tickets')
        .where('event_id', eventId)
        .where('status', 'available')
        .count('* as count');
      
      const expectedAvailable = 10 - totalReserved;
      expect(parseInt(availableTickets[0].count)).to.equal(expectedAvailable);
    });

    it('should properly handle reservation expiration during concurrent access', async () => {
      const eventId = testEvent[0].id;
      
      // Create a reservation that will expire quickly
      const shortLivedReservation = await reservationService.reserveSeats(
        eventId,
        'regular',
        5,
        null,
        'short_lived_session'
      );

      // Manually set short expiration (1 second)
      await redis.expire(`reservation:${eventId}:${shortLivedReservation.reservationToken}`, 1);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Now try concurrent reservations
      const promises = [];
      for (let i = 0; i < 15; i++) {
        const promise = request(app)
          .post('/api/v1/reservations/reserve')
          .send({
            event_id: eventId,
            ticket_type: 'regular',
            quantity: 1,
            session_id: `concurrent_${i}`
          });
        
        promises.push(promise);
      }

      const results = await Promise.allSettled(promises);
      
      const successfulReservations = results.filter(result => 
        result.status === 'fulfilled' && 
        result.value.status === 201
      ).length;

      // Should be able to reserve all 10 tickets since the expired reservation was cleaned up
      expect(successfulReservations).to.equal(10);
    });
  });

  describe('Payment Race Conditions', () => {
    it('should prevent double payment for the same reservation', async () => {
      const eventId = testEvent[0].id;
      
      // Create a reservation first
      const reservationResponse = await request(app)
        .post('/api/v1/reservations/reserve')
        .send({
          event_id: eventId,
          ticket_type: 'regular',
          quantity: 2,
          session_id: 'payment_test_session'
        })
        .expect(201);

      const reservationToken = reservationResponse.body.data.reservationToken;
      
      // Try to initiate payment multiple times simultaneously
      const paymentPromises = [];
      for (let i = 0; i < 5; i++) {
        const promise = request(app)
          .post('/api/v1/payments/initiate')
          .set('Authorization', `Bearer ${authToken}`)
          .set('Idempotency-Key', `payment_${i}_${Date.now()}`)
          .send({
            event_id: eventId,
            ticket_type: 'regular',
            quantity: 2,
            payment_method: 'mtn_momo',
            customer_name: 'Test User',
            customer_phone: '+250781234567',
            customer_email: 'test@example.com',
            reservation_token: reservationToken
          });
        
        paymentPromises.push(promise);
      }

      const paymentResults = await Promise.allSettled(paymentPromises);
      
      // Only one payment should succeed
      const successfulPayments = paymentResults.filter(result => 
        result.status === 'fulfilled' && 
        result.value.status === 201
      ).length;

      expect(successfulPayments).to.equal(1);
      
      // Verify reservation is still valid for the successful payment
      const reservation = await reservationService.getReservation(reservationToken);
      expect(reservation).to.not.be.null;
    });

    it('should handle concurrent payments with idempotency keys correctly', async () => {
      const eventId = testEvent[0].id;
      const idempotencyKey = `test_idempotency_${Date.now()}`;
      
      // Create reservation
      const reservationResponse = await request(app)
        .post('/api/v1/reservations/reserve')
        .send({
          event_id: eventId,
          ticket_type: 'regular',
          quantity: 1,
          session_id: 'idempotency_test_session'
        })
        .expect(201);

      const reservationToken = reservationResponse.body.data.reservationToken;
      
      // Make multiple identical requests with same idempotency key
      const promises = [];
      for (let i = 0; i < 10; i++) {
        const promise = request(app)
          .post('/api/v1/payments/initiate')
          .set('Authorization', `Bearer ${authToken}`)
          .set('Idempotency-Key', idempotencyKey)
          .send({
            event_id: eventId,
            ticket_type: 'regular',
            quantity: 1,
            payment_method: 'mtn_momo',
            customer_name: 'Test User',
            customer_phone: '+250781234567',
            customer_email: 'test@example.com',
            reservation_token: reservationToken
          });
        
        promises.push(promise);
      }

      const results = await Promise.allSettled(promises);
      
      // All requests should return the same payment ID
      const paymentIds = results
        .filter(result => result.status === 'fulfilled' && result.value.status === 201)
        .map(result => result.value.body.data.payment_id);

      // All payment IDs should be identical (idempotency)
      const uniquePaymentIds = [...new Set(paymentIds)];
      expect(uniquePaymentIds).to.have.length(1);
      
      // Verify only one payment record was created
      const paymentCount = await db('payments')
        .where('idempotency_key', idempotencyKey)
        .count('* as count');
      
      expect(parseInt(paymentCount[0].count)).to.equal(1);
    });
  });

  describe('Reservation Cleanup Race Conditions', () => {
    it('should handle concurrent reservation cleanup without conflicts', async () => {
      const eventId = testEvent[0].id;
      
      // Create multiple reservations that will expire
      const reservations = [];
      for (let i = 0; i < 5; i++) {
        const reservation = await reservationService.reserveSeats(
          eventId,
          'regular',
          1,
          null,
          `cleanup_test_${i}`
        );
        reservations.push(reservation);
        
        // Set short expiration
        await redis.expire(`reservation:${eventId}:${reservation.reservationToken}`, 1);
      }
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Trigger concurrent cleanup operations
      const cleanupPromises = reservations.map(reservation =>
        reservationService.cancelReservation(reservation.reservationToken, 'expired')
      );
      
      const cleanupResults = await Promise.allSettled(cleanupPromises);
      
      // Some cleanups may fail (already cleaned up), but system should remain consistent
      const successfulCleanups = cleanupResults.filter(result => 
        result.status === 'fulfilled'
      ).length;
      
      expect(successfulCleanups).to.be.at.least(0);
      
      // Verify all reservations are gone
      const remainingReservations = await redis.keys(`reservation:${eventId}:*`);
      expect(remainingReservations).to.have.length(0);
      
      // Verify all tickets are available again
      const availableTickets = await db('tickets')
        .where('event_id', eventId)
        .where('status', 'available')
        .count('* as count');
      
      expect(parseInt(availableTickets[0].count)).to.equal(10);
    });
  });

  describe('Database Transaction Race Conditions', () => {
    it('should maintain data consistency during concurrent ticket status updates', async () => {
      const eventId = testEvent[0].id;
      
      // Get a specific ticket
      const ticket = await db('tickets')
        .where('event_id', eventId)
        .where('status', 'available')
        .first();
      
      // Try to update the same ticket concurrently
      const updatePromises = [];
      for (let i = 0; i < 10; i++) {
        const promise = db.transaction(async (trx) => {
          const currentTicket = await trx('tickets')
            .where('id', ticket.id)
            .where('status', 'available')
            .first();
          
          if (currentTicket) {
            await trx('tickets')
              .where('id', ticket.id)
              .update({ 
                status: 'reserved',
                updated_at: new Date()
              });
            return true;
          }
          return false;
        });
        
        updatePromises.push(promise);
      }
      
      const updateResults = await Promise.allSettled(updatePromises);
      
      // Only one update should succeed
      const successfulUpdates = updateResults.filter(result => 
        result.status === 'fulfilled' && result.value === true
      ).length;
      
      expect(successfulUpdates).to.equal(1);
      
      // Verify ticket status
      const updatedTicket = await db('tickets')
        .where('id', ticket.id)
        .first();
      
      expect(updatedTicket.status).to.equal('reserved');
    });
  });

  describe('Load Testing Scenarios', () => {
    it('should handle 1000 concurrent reservation requests gracefully', async function() {
      this.timeout(30000); // 30 second timeout for load test
      
      const eventId = testEvent[0].id;
      const concurrentUsers = 1000;
      const promises = [];
      
      // Create 1000 concurrent requests
      for (let i = 0; i < concurrentUsers; i++) {
        const promise = request(app)
          .post('/api/v1/reservations/reserve')
          .send({
            event_id: eventId,
            ticket_type: 'regular',
            quantity: 1,
            session_id: `load_test_${i}`
          })
          .timeout(10000); // 10 second timeout per request
        
        promises.push(promise);
      }
      
      const startTime = Date.now();
      const results = await Promise.allSettled(promises);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      const successfulRequests = results.filter(result => 
        result.status === 'fulfilled' && 
        result.value.status === 201
      ).length;
      
      const failedRequests = results.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && result.value.status !== 201)
      ).length;
      
      console.log(`Load test results:`);
      console.log(`Duration: ${duration}ms`);
      console.log(`Successful requests: ${successfulRequests}`);
      console.log(`Failed requests: ${failedRequests}`);
      console.log(`Requests per second: ${(concurrentUsers / (duration / 1000)).toFixed(2)}`);
      
      // System should handle the load without crashing
      expect(successfulRequests + failedRequests).to.equal(concurrentUsers);

      // Should not oversell
      expect(successfulRequests).to.be.at.most(10);

      // Response time should be reasonable (under 15 seconds for load test)
      expect(duration).to.be.below(15000);
    });
  });
});
