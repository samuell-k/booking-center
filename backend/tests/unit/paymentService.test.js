const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('PaymentService Unit Tests', () => {
  let paymentService;
  let dbStub;
  let cacheStub;
  let axiosStub;
  let reservationServiceStub;
  let loggerStub;

  beforeEach(() => {
    // Create stubs for dependencies
    dbStub = {
      transaction: sinon.stub(),
      select: sinon.stub().returnsThis(),
      where: sinon.stub().returnsThis(),
      first: sinon.stub(),
      insert: sinon.stub().returnsThis(),
      update: sinon.stub().returnsThis(),
      returning: sinon.stub(),
      count: sinon.stub(),
      avg: sinon.stub()
    };

    cacheStub = {
      get: sinon.stub(),
      set: sinon.stub(),
      del: sinon.stub()
    };

    axiosStub = {
      post: sinon.stub(),
      get: sinon.stub()
    };

    reservationServiceStub = {
      getReservation: sinon.stub(),
      confirmReservation: sinon.stub()
    };

    loggerStub = {
      info: sinon.stub(),
      error: sinon.stub(),
      warn: sinon.stub()
    };

    // Use proxyquire to inject stubs
    paymentService = proxyquire('../../src/services/paymentService', {
      '../config/database': { db: dbStub, withTransaction: sinon.stub() },
      '../config/redis': { cache: cacheStub },
      'axios': axiosStub,
      './reservationService': reservationServiceStub,
      '../utils/logger': loggerStub
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('initiatePayment', () => {
    it('should successfully initiate a payment with valid data', async () => {
      const paymentData = {
        user_id: 'user-123',
        event_id: 'event-123',
        ticket_ids: ['ticket-1', 'ticket-2'],
        amount: 10000,
        payment_method: 'mtn_momo',
        customer_phone: '+250781234567',
        customer_email: 'test@example.com',
        customer_name: 'Test User',
        idempotency_key: 'idempotency-123'
      };

      // Mock database responses
      dbStub.first.resolves(null); // No existing payment with idempotency key
      dbStub.insert.resolves([{
        id: 'payment-123',
        payment_reference: 'SSR123456789',
        ...paymentData,
        status: 'pending',
        fraud_score: 25
      }]);

      // Mock fraud score calculation
      dbStub.count.resolves([{ count: '2' }]); // Recent payments count
      dbStub.avg.resolves([{ avg: '5000' }]); // Average amount

      // Mock payment provider response
      const mockProviderResponse = {
        externalReference: 'MTN123456',
        status: 'processing',
        paymentUrl: 'https://mtn.com/pay/123',
        providerData: { transactionId: 'MTN123456' }
      };

      // Mock the processPaymentWithFailover method
      sinon.stub(paymentService, 'processPaymentWithFailover').resolves(mockProviderResponse);

      const result = await paymentService.initiatePayment(paymentData);

      expect(result).to.have.property('payment_id');
      expect(result).to.have.property('payment_reference');
      expect(result).to.have.property('status', 'processing');
      expect(result).to.have.property('external_reference', 'MTN123456');
      expect(result).to.have.property('fraud_score');
    });

    it('should return existing payment for duplicate idempotency key', async () => {
      const paymentData = {
        idempotency_key: 'existing-key',
        user_id: 'user-123',
        amount: 5000,
        payment_method: 'mtn_momo'
      };

      const existingPayment = {
        id: 'existing-payment-123',
        payment_reference: 'SSR987654321',
        status: 'completed',
        external_reference: 'MTN987654',
        fraud_score: 15
      };

      dbStub.first.resolves(existingPayment);

      const result = await paymentService.initiatePayment(paymentData);

      expect(result.payment_id).to.equal('existing-payment-123');
      expect(result.payment_reference).to.equal('SSR987654321');
      expect(result.status).to.equal('completed');
    });

    it('should reject payment with high fraud score', async () => {
      const paymentData = {
        user_id: 'user-123',
        amount: 100000, // High amount
        payment_method: 'mtn_momo',
        customer_phone: '+250781234567',
        customer_email: 'suspicious@temp.com' // Suspicious email
      };

      // Mock high fraud score calculation
      dbStub.count.resolves([{ count: '10' }]); // Many recent payments
      dbStub.avg.resolves([{ avg: '5000' }]); // Much lower average

      try {
        await paymentService.initiatePayment(paymentData);
        expect.fail('Should have thrown an error for high fraud score');
      } catch (error) {
        expect(error.message).to.include('security concerns');
      }
    });

    it('should validate reservation token when provided', async () => {
      const paymentData = {
        user_id: 'user-123',
        amount: 5000,
        payment_method: 'mtn_momo',
        reservation_token: 'invalid-token'
      };

      reservationServiceStub.getReservation.resolves(null); // Invalid reservation

      try {
        await paymentService.initiatePayment(paymentData);
        expect.fail('Should have thrown an error for invalid reservation');
      } catch (error) {
        expect(error.message).to.include('Invalid or expired reservation');
      }
    });
  });

  describe('calculateFraudScore', () => {
    it('should calculate fraud score based on payment velocity', async () => {
      const paymentData = {
        customer_phone: '+250781234567',
        amount: 5000,
        customer_email: 'test@example.com'
      };

      // Mock high payment velocity
      dbStub.count.resolves([{ count: '6' }]); // 6 payments in last hour
      dbStub.avg.resolves([{ avg: '5000' }]);

      const fraudScore = await paymentService.calculateFraudScore(paymentData);

      expect(fraudScore).to.be.at.least(30); // Should add 30 points for high velocity
    });

    it('should detect amount anomalies', async () => {
      const paymentData = {
        customer_phone: '+250781234567',
        amount: 50000, // 10x average
        customer_email: 'test@example.com'
      };

      dbStub.count.resolves([{ count: '2' }]);
      dbStub.avg.resolves([{ avg: '5000' }]); // Much lower average

      const fraudScore = await paymentService.calculateFraudScore(paymentData);

      expect(fraudScore).to.be.at.least(25); // Should add 25 points for amount anomaly
    });

    it('should detect suspicious email patterns', async () => {
      const paymentData = {
        customer_phone: '+250781234567',
        amount: 5000,
        customer_email: 'user@tempmail.com' // Suspicious email
      };

      dbStub.count.resolves([{ count: '1' }]);
      dbStub.avg.resolves([{ avg: '5000' }]);

      const fraudScore = await paymentService.calculateFraudScore(paymentData);

      expect(fraudScore).to.be.at.least(20); // Should add 20 points for suspicious email
    });

    it('should add points for unusual hours', async () => {
      const paymentData = {
        customer_phone: '+250781234567',
        amount: 5000,
        customer_email: 'test@example.com'
      };

      // Mock early morning hour
      const originalDate = Date;
      const mockDate = sinon.stub(global, 'Date');
      mockDate.returns({ getHours: () => 3 }); // 3 AM

      dbStub.count.resolves([{ count: '1' }]);
      dbStub.avg.resolves([{ avg: '5000' }]);

      const fraudScore = await paymentService.calculateFraudScore(paymentData);

      expect(fraudScore).to.be.at.least(10); // Should add 10 points for unusual hour

      mockDate.restore();
    });

    it('should cap fraud score at 100', async () => {
      const paymentData = {
        customer_phone: '+250781234567',
        amount: 100000, // Very high amount
        customer_email: 'suspicious@tempmail.com'
      };

      // Mock conditions that would result in very high score
      dbStub.count.resolves([{ count: '20' }]); // Very high velocity
      dbStub.avg.resolves([{ avg: '1000' }]); // Much lower average

      const fraudScore = await paymentService.calculateFraudScore(paymentData);

      expect(fraudScore).to.equal(100); // Should be capped at 100
    });
  });

  describe('processPaymentWithFailover', () => {
    it('should try primary provider first', async () => {
      const payment = {
        id: 'payment-123',
        payment_method: 'mtn_momo'
      };

      const mockResponse = {
        externalReference: 'MTN123',
        status: 'processing',
        providerData: {}
      };

      sinon.stub(paymentService, 'processMTNMoMoPayment').resolves(mockResponse);

      const result = await paymentService.processPaymentWithFailover(payment, '+250781234567');

      expect(result).to.deep.equal(mockResponse);
      expect(paymentService.processMTNMoMoPayment.calledOnce).to.be.true;
    });

    it('should failover to secondary provider when primary fails', async () => {
      const payment = {
        id: 'payment-123',
        payment_method: 'mtn_momo'
      };

      const primaryError = new Error('Primary provider unavailable');
      const secondaryResponse = {
        externalReference: 'MTN456',
        status: 'processing',
        providerData: {}
      };

      sinon.stub(paymentService, 'processMTNMoMoPayment')
        .onFirstCall().rejects(primaryError)
        .onSecondCall().resolves(secondaryResponse);

      const result = await paymentService.processPaymentWithFailover(payment, '+250781234567');

      expect(result).to.deep.equal(secondaryResponse);
      expect(paymentService.processMTNMoMoPayment.calledTwice).to.be.true;
    });

    it('should throw error when all providers fail', async () => {
      const payment = {
        id: 'payment-123',
        payment_method: 'mtn_momo'
      };

      const error = new Error('All providers failed');
      sinon.stub(paymentService, 'processMTNMoMoPayment').rejects(error);

      try {
        await paymentService.processPaymentWithFailover(payment, '+250781234567');
        expect.fail('Should have thrown an error');
      } catch (thrownError) {
        expect(thrownError.message).to.include('All payment providers failed');
      }
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify valid webhook signature', () => {
      const payload = '{"event":"payment.completed","payment_id":"123"}';
      const secret = 'webhook-secret';
      const crypto = require('crypto');
      
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const isValid = paymentService.verifyWebhookSignature(payload, expectedSignature, secret);

      expect(isValid).to.be.true;
    });

    it('should reject invalid webhook signature', () => {
      const payload = '{"event":"payment.completed","payment_id":"123"}';
      const secret = 'webhook-secret';
      const invalidSignature = 'invalid-signature';

      const isValid = paymentService.verifyWebhookSignature(payload, invalidSignature, secret);

      expect(isValid).to.be.false;
    });

    it('should be resistant to timing attacks', () => {
      const payload = '{"event":"payment.completed","payment_id":"123"}';
      const secret = 'webhook-secret';
      const validSignature = require('crypto')
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
      
      // Test with signature of different length
      const shortSignature = 'abc';
      
      const startTime = process.hrtime.bigint();
      const isValid = paymentService.verifyWebhookSignature(payload, shortSignature, secret);
      const endTime = process.hrtime.bigint();
      
      expect(isValid).to.be.false;
      
      // Should not fail immediately (timing attack protection)
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      expect(duration).to.be.greaterThan(0.1); // Should take some time
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status with valid transition', async () => {
      const paymentId = 'payment-123';
      const currentPayment = {
        id: paymentId,
        status: 'pending'
      };
      const updatedPayment = {
        ...currentPayment,
        status: 'completed',
        completed_at: new Date()
      };

      dbStub.first.resolves(currentPayment);
      dbStub.update.resolves([updatedPayment]);

      const result = await paymentService.updatePaymentStatus(paymentId, 'completed');

      expect(result.status).to.equal('completed');
      expect(result).to.have.property('completed_at');
    });

    it('should reject invalid status transitions', async () => {
      const paymentId = 'payment-123';
      const currentPayment = {
        id: paymentId,
        status: 'completed'
      };

      dbStub.first.resolves(currentPayment);

      try {
        await paymentService.updatePaymentStatus(paymentId, 'pending');
        expect.fail('Should have thrown an error for invalid transition');
      } catch (error) {
        expect(error.message).to.include('Invalid status transition');
      }
    });

    it('should throw error for non-existent payment', async () => {
      const paymentId = 'non-existent';

      dbStub.first.resolves(null);

      try {
        await paymentService.updatePaymentStatus(paymentId, 'completed');
        expect.fail('Should have thrown an error for non-existent payment');
      } catch (error) {
        expect(error.message).to.include('Payment not found');
      }
    });
  });

  describe('retryPayment', () => {
    it('should retry failed payment within retry limit', async () => {
      const paymentId = 'payment-123';
      const failedPayment = {
        id: paymentId,
        status: 'failed',
        retry_count: 1,
        customer_phone: '+250781234567'
      };

      dbStub.first.resolves(failedPayment);
      dbStub.update.resolves([{ ...failedPayment, status: 'pending', retry_count: 2 }]);

      const mockResponse = {
        externalReference: 'RETRY123',
        status: 'processing',
        providerData: {}
      };

      sinon.stub(paymentService, 'processPaymentWithFailover').resolves(mockResponse);

      const result = await paymentService.retryPayment(paymentId);

      expect(result.status).to.equal('processing');
      expect(result.external_reference).to.equal('RETRY123');
    });

    it('should reject retry when limit exceeded', async () => {
      const paymentId = 'payment-123';
      const failedPayment = {
        id: paymentId,
        status: 'failed',
        retry_count: 3 // At limit
      };

      dbStub.first.resolves(failedPayment);

      try {
        await paymentService.retryPayment(paymentId);
        expect.fail('Should have thrown an error for exceeded retry limit');
      } catch (error) {
        expect(error.message).to.include('Maximum retry attempts exceeded');
      }
    });

    it('should reject retry for non-failed payments', async () => {
      const paymentId = 'payment-123';
      const completedPayment = {
        id: paymentId,
        status: 'completed',
        retry_count: 0
      };

      dbStub.first.resolves(completedPayment);

      try {
        await paymentService.retryPayment(paymentId);
        expect.fail('Should have thrown an error for non-failed payment');
      } catch (error) {
        expect(error.message).to.include('Only failed payments can be retried');
      }
    });
  });
});
