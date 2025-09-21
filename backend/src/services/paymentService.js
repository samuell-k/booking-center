const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { db, withTransaction } = require('../config/database');
const { cache } = require('../config/redis');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const reservationService = require('./reservationService');

class PaymentService {
  constructor() {
    this.mtnConfig = {
      baseURL: process.env.MTN_MOMO_API_URL,
      subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY,
      apiUserId: process.env.MTN_MOMO_API_USER_ID,
      apiKey: process.env.MTN_MOMO_API_KEY,
      callbackUrl: process.env.MTN_MOMO_CALLBACK_URL
    };

    this.airtelConfig = {
      baseURL: process.env.AIRTEL_MONEY_API_URL,
      clientId: process.env.AIRTEL_MONEY_CLIENT_ID,
      clientSecret: process.env.AIRTEL_MONEY_CLIENT_SECRET,
      callbackUrl: process.env.AIRTEL_MONEY_CALLBACK_URL
    };

    this.rswitchConfig = {
      baseURL: process.env.RSWITCH_API_URL,
      merchantId: process.env.RSWITCH_MERCHANT_ID,
      apiKey: process.env.RSWITCH_API_KEY,
      secretKey: process.env.RSWITCH_SECRET_KEY,
      callbackUrl: process.env.RSWITCH_CALLBACK_URL
    };
  }

  // Initialize payment with idempotency support
  async initiatePayment(paymentData) {
    const {
      user_id,
      event_id,
      ticket_ids,
      amount,
      payment_method,
      customer_phone,
      customer_email,
      customer_name,
      idempotency_key,
      reservation_token
    } = paymentData;

    // Check for idempotency
    if (idempotency_key) {
      const existingPayment = await db('payments')
        .where({ idempotency_key })
        .first();

      if (existingPayment) {
        logger.info('Returning existing payment for idempotency key', { idempotency_key });
        return this.formatPaymentResponse(existingPayment);
      }
    }

    return await withTransaction(async (trx) => {
      try {
        // Validate reservation if provided
        let reservation = null;
        if (reservation_token) {
          reservation = await reservationService.getReservation(reservation_token);
          if (!reservation || reservation.status !== 'active') {
            throw new AppError('Invalid or expired reservation', 400);
          }
        }

        // Generate payment reference
        const paymentReference = `SSR${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Fraud detection
        const fraudScore = await this.calculateFraudScore({
          user_id,
          amount,
          payment_method,
          customer_phone,
          customer_email
        });

        if (fraudScore > 80) {
          throw new AppError('Payment blocked due to security concerns', 403);
        }

        // Create payment record
        const [payment] = await trx('payments').insert({
          payment_reference: paymentReference,
          user_id,
          event_id,
          ticket_ids: JSON.stringify(ticket_ids || []),
          subtotal: amount,
          total_amount: amount,
          payment_method,
          customer_name,
          customer_email,
          customer_phone: customer_phone,
          idempotency_key,
          status: 'pending',
          fraud_score: fraudScore,
          fraud_check_passed: fraudScore <= 80,
          initiated_at: new Date(),
          expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
        }).returning('*');

        let paymentResponse;

        // Route to appropriate payment provider with failover
        try {
          paymentResponse = await this.processPaymentWithFailover(payment, customer_phone);
        } catch (providerError) {
          // Update payment status to failed
          await trx('payments')
            .where({ id: payment.id })
            .update({
              status: 'failed',
              failure_reason: providerError.message,
              failed_at: new Date()
            });
          throw providerError;
        }

        // Update payment with external reference
        await trx('payments')
          .where({ id: payment.id })
          .update({
            external_reference: paymentResponse.externalReference,
            status: paymentResponse.status,
            provider_response: JSON.stringify(paymentResponse.providerData)
          });

        // Cache payment for quick status checks
        await cache.set(`payment:${payment.id}`, payment, 600);

        logger.info('Payment initiated successfully', {
          payment_id: payment.id,
          payment_reference: paymentReference,
          external_reference: paymentResponse.externalReference,
          fraud_score: fraudScore
        });

        return this.formatPaymentResponse({
          ...payment,
          external_reference: paymentResponse.externalReference,
          status: paymentResponse.status,
          payment_url: paymentResponse.paymentUrl
        });

      } catch (error) {
        logger.error('Payment initiation failed:', error);
        throw error;
      }
    });
  }

  // Process payment with provider failover
  async processPaymentWithFailover(payment, customerPhone) {
    const providers = this.getProvidersByMethod(payment.payment_method);
    let lastError;

    for (const provider of providers) {
      try {
        logger.info(`Attempting payment with provider: ${provider}`, {
          payment_id: payment.id,
          provider
        });

        switch (provider) {
          case 'mtn_primary':
            return await this.processMTNMoMoPayment(payment, customerPhone);
          case 'mtn_secondary':
            return await this.processMTNMoMoPayment(payment, customerPhone, true);
          case 'airtel_primary':
            return await this.processAirtelMoneyPayment(payment, customerPhone);
          case 'rswitch':
            return await this.processRSwitchPayment(payment);
          case 'wallet':
            return await this.processWalletPayment(payment);
          default:
            throw new AppError(`Unknown provider: ${provider}`, 500);
        }
      } catch (error) {
        lastError = error;
        logger.warn(`Provider ${provider} failed, trying next`, {
          payment_id: payment.id,
          provider,
          error: error.message
        });
        continue;
      }
    }

    throw lastError || new AppError('All payment providers failed', 500);
  }

  // Get available providers for a payment method
  getProvidersByMethod(paymentMethod) {
    const providerMap = {
      'mtn_momo': ['mtn_primary', 'mtn_secondary'],
      'airtel_money': ['airtel_primary'],
      'bank_transfer': ['rswitch'],
      'credit_card': ['rswitch'],
      'debit_card': ['rswitch'],
      'wallet': ['wallet']
    };

    return providerMap[paymentMethod] || [];
  }

  // Calculate fraud score
  async calculateFraudScore(paymentData) {
    let score = 0;

    try {
      // Check payment velocity (number of payments in last hour)
      const recentPayments = await db('payments')
        .where('customer_phone', paymentData.customer_phone)
        .where('initiated_at', '>', new Date(Date.now() - 60 * 60 * 1000))
        .count('* as count');

      const paymentCount = parseInt(recentPayments[0].count);
      if (paymentCount > 5) score += 30;
      else if (paymentCount > 3) score += 15;

      // Check amount anomaly
      const avgAmount = await db('payments')
        .where('customer_phone', paymentData.customer_phone)
        .where('status', 'completed')
        .avg('total_amount as avg');

      const averageAmount = parseFloat(avgAmount[0].avg) || 0;
      if (averageAmount > 0 && paymentData.amount > averageAmount * 5) {
        score += 25;
      }

      // Check for suspicious patterns
      if (paymentData.customer_email && paymentData.customer_email.includes('temp')) {
        score += 20;
      }

      // Time-based checks
      const hour = new Date().getHours();
      if (hour < 6 || hour > 23) {
        score += 10;
      }

      return Math.min(score, 100);
    } catch (error) {
      logger.error('Fraud score calculation failed:', error);
      return 0; // Default to low risk if calculation fails
    }
  }

  // Format payment response
  formatPaymentResponse(payment) {
    return {
      payment_id: payment.id,
      payment_reference: payment.payment_reference,
      status: payment.status,
      external_reference: payment.external_reference,
      payment_url: payment.payment_url,
      expires_at: payment.expires_at,
      fraud_score: payment.fraud_score
    };
  }

  // MTN MoMo payment processing
  async processMTNMoMoPayment(payment, phoneNumber) {
    try {
      // Get access token
      const accessToken = await this.getMTNAccessToken();

      const requestId = uuidv4();
      const requestData = {
        amount: payment.total_amount.toString(),
        currency: 'RWF',
        externalId: payment.payment_reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber.replace('+', '').replace(/\s/g, '')
        },
        payerMessage: `Payment for SmartSports Rwanda - ${payment.payment_reference}`,
        payeeNote: `Ticket payment - ${payment.payment_reference}`
      };

      const response = await axios.post(
        `${this.mtnConfig.baseURL}/collection/v1_0/requesttopay`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Reference-Id': requestId,
            'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
            'Ocp-Apim-Subscription-Key': this.mtnConfig.subscriptionKey,
            'Content-Type': 'application/json'
          }
        }
      );

      // Store request ID for status checking
      await cache.set(`mtn_request:${payment.id}`, requestId, 600); // 10 minutes

      return {
        externalReference: requestId,
        status: 'processing',
        paymentUrl: null,
        providerData: response.data
      };

    } catch (error) {
      logger.error('MTN MoMo payment failed:', error);
      throw new AppError('MTN MoMo payment processing failed', 500);
    }
  }

  // Get MTN access token
  async getMTNAccessToken() {
    try {
      // Check cache first
      const cachedToken = await cache.get('mtn_access_token');
      if (cachedToken) {
        return cachedToken;
      }

      const response = await axios.post(
        `${this.mtnConfig.baseURL}/collection/token/`,
        {},
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.mtnConfig.subscriptionKey,
            'Authorization': `Basic ${Buffer.from(`${this.mtnConfig.apiUserId}:${this.mtnConfig.apiKey}`).toString('base64')}`
          }
        }
      );

      const { access_token, expires_in } = response.data;

      // Cache token with expiry
      await cache.set('mtn_access_token', access_token, expires_in - 60); // 1 minute buffer

      return access_token;

    } catch (error) {
      logger.error('MTN access token failed:', error);
      throw new AppError('Failed to get MTN access token', 500);
    }
  }

  // Airtel Money payment processing
  async processAirtelMoneyPayment(payment, phoneNumber) {
    try {
      // Get access token
      const accessToken = await this.getAirtelAccessToken();

      const requestData = {
        reference: payment.payment_reference,
        subscriber: {
          country: 'RW',
          currency: 'RWF',
          msisdn: phoneNumber.replace('+', '').replace(/\s/g, '')
        },
        transaction: {
          amount: payment.total_amount,
          country: 'RW',
          currency: 'RWF',
          id: payment.payment_reference
        }
      };

      const response = await axios.post(
        `${this.airtelConfig.baseURL}/merchant/v1/payments/`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Country': 'RW',
            'X-Currency': 'RWF'
          }
        }
      );

      return {
        externalReference: response.data.data?.transaction?.id || payment.payment_reference,
        status: 'processing',
        paymentUrl: null,
        providerData: response.data
      };

    } catch (error) {
      logger.error('Airtel Money payment failed:', error);
      throw new AppError('Airtel Money payment processing failed', 500);
    }
  }

  // Get Airtel access token
  async getAirtelAccessToken() {
    try {
      const cachedToken = await cache.get('airtel_access_token');
      if (cachedToken) {
        return cachedToken;
      }

      const response = await axios.post(
        `${this.airtelConfig.baseURL}/auth/oauth2/token`,
        {
          client_id: this.airtelConfig.clientId,
          client_secret: this.airtelConfig.clientSecret,
          grant_type: 'client_credentials'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { access_token, expires_in } = response.data;
      await cache.set('airtel_access_token', access_token, expires_in - 60);

      return access_token;

    } catch (error) {
      logger.error('Airtel access token failed:', error);
      throw new AppError('Failed to get Airtel access token', 500);
    }
  }

  // RSwitch payment processing (for cards and bank transfers)
  async processRSwitchPayment(payment) {
    try {
      const requestData = {
        merchantId: this.rswitchConfig.merchantId,
        amount: payment.total_amount,
        currency: 'RWF',
        reference: payment.payment_reference,
        description: `SmartSports Rwanda - Ticket Payment`,
        callbackUrl: this.rswitchConfig.callbackUrl,
        customerEmail: payment.customer_email,
        customerPhone: payment.customer_phone
      };

      // Generate signature
      const signature = this.generateRSwitchSignature(requestData);
      requestData.signature = signature;

      const response = await axios.post(
        `${this.rswitchConfig.baseURL}/api/v1/payments/initiate`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.rswitchConfig.apiKey}`
          }
        }
      );

      return {
        externalReference: response.data.transactionId,
        status: 'processing',
        paymentUrl: response.data.paymentUrl,
        providerData: response.data
      };

    } catch (error) {
      logger.error('RSwitch payment failed:', error);
      throw new AppError('Card/Bank payment processing failed', 500);
    }
  }

  // Generate RSwitch signature
  generateRSwitchSignature(data) {
    const crypto = require('crypto');
    const sortedKeys = Object.keys(data).sort();
    const signatureString = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    return crypto.createHmac('sha256', this.rswitchConfig.secretKey).update(signatureString).digest('hex');
  }

  // Wallet payment processing
  async processWalletPayment(payment) {
    try {
      // Get user's wallet
      const wallet = await db('wallets')
        .where({ user_id: payment.user_id, status: 'active' })
        .first();

      if (!wallet) {
        throw new AppError('Wallet not found', 404);
      }

      if (wallet.balance < payment.total_amount) {
        throw new AppError('Insufficient wallet balance', 400);
      }

      // Create wallet transaction
      const [walletTransaction] = await db('wallet_transactions').insert({
        wallet_id: wallet.id,
        user_id: payment.user_id,
        transaction_reference: `WTX${Date.now()}${Math.floor(Math.random() * 1000)}`,
        type: 'payment',
        amount: -payment.total_amount,
        balance_before: wallet.balance,
        balance_after: wallet.balance - payment.total_amount,
        status: 'completed',
        payment_id: payment.id,
        event_id: payment.event_id,
        description: `Payment for tickets - ${payment.payment_reference}`,
        initiated_at: new Date(),
        completed_at: new Date()
      }).returning('*');

      // Update wallet balance
      await db('wallets')
        .where({ id: wallet.id })
        .update({
          balance: wallet.balance - payment.total_amount,
          lifetime_spent: wallet.lifetime_spent + payment.total_amount,
          total_transactions: wallet.total_transactions + 1,
          last_transaction_at: new Date()
        });

      return {
        externalReference: walletTransaction.transaction_reference,
        status: 'completed',
        paymentUrl: null,
        providerData: { wallet_transaction_id: walletTransaction.id }
      };

    } catch (error) {
      logger.error('Wallet payment failed:', error);
      throw error;
    }
  }

  // Check payment status
  async checkPaymentStatus(paymentId) {
    try {
      const payment = await db('payments').where({ id: paymentId }).first();
      
      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      if (payment.status === 'completed' || payment.status === 'failed') {
        return payment;
      }

      let updatedStatus = payment.status;

      // Check status based on payment method
      switch (payment.payment_method) {
        case 'mtn_momo':
          updatedStatus = await this.checkMTNPaymentStatus(payment);
          break;
        case 'airtel_money':
          updatedStatus = await this.checkAirtelPaymentStatus(payment);
          break;
        case 'wallet':
          // Wallet payments are instant
          break;
        default:
          // For other methods, status is updated via webhooks
          break;
      }

      // Update payment status if changed
      if (updatedStatus !== payment.status) {
        await db('payments')
          .where({ id: paymentId })
          .update({ 
            status: updatedStatus,
            completed_at: updatedStatus === 'completed' ? new Date() : null,
            failed_at: updatedStatus === 'failed' ? new Date() : null
          });
      }

      return { ...payment, status: updatedStatus };

    } catch (error) {
      logger.error('Payment status check failed:', error);
      throw error;
    }
  }

  // Check MTN payment status
  async checkMTNPaymentStatus(payment) {
    try {
      const requestId = await cache.get(`mtn_request:${payment.id}`);
      if (!requestId) {
        return 'failed';
      }

      const accessToken = await this.getMTNAccessToken();

      const response = await axios.get(
        `${this.mtnConfig.baseURL}/collection/v1_0/requesttopay/${requestId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
            'Ocp-Apim-Subscription-Key': this.mtnConfig.subscriptionKey
          }
        }
      );

      const status = response.data.status;
      
      switch (status) {
        case 'SUCCESSFUL':
          return 'completed';
        case 'FAILED':
          return 'failed';
        case 'PENDING':
          return 'processing';
        default:
          return 'processing';
      }

    } catch (error) {
      logger.error('MTN status check failed:', error);
      return 'failed';
    }
  }

  // Check Airtel payment status
  async checkAirtelPaymentStatus(payment) {
    try {
      const accessToken = await this.getAirtelAccessToken();

      const response = await axios.get(
        `${this.airtelConfig.baseURL}/standard/v1/payments/${payment.external_reference}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Country': 'RW',
            'X-Currency': 'RWF'
          }
        }
      );

      const status = response.data.data?.transaction?.status;

      switch (status) {
        case 'TS':
          return 'completed';
        case 'TF':
          return 'failed';
        case 'TA':
          return 'processing';
        default:
          return 'processing';
      }

    } catch (error) {
      logger.error('Airtel status check failed:', error);
      return 'failed';
    }
  }

  // Webhook signature verification
  verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Process webhook with idempotency
  async processWebhook(webhookData, signature, provider) {
    const { event_type, payment_reference, status, external_reference } = webhookData;

    // Verify signature
    const secret = this.getWebhookSecret(provider);
    if (!this.verifyWebhookSignature(JSON.stringify(webhookData), signature, secret)) {
      throw new AppError('Invalid webhook signature', 401);
    }

    // Check for duplicate webhook
    const webhookId = `webhook:${provider}:${external_reference}:${event_type}`;
    const processed = await cache.get(webhookId);
    if (processed) {
      logger.info('Duplicate webhook ignored', { webhookId });
      return { status: 'duplicate' };
    }

    return await withTransaction(async (trx) => {
      try {
        // Find payment
        const payment = await trx('payments')
          .where({ payment_reference })
          .orWhere({ external_reference })
          .first();

        if (!payment) {
          throw new AppError('Payment not found', 404);
        }

        // Update payment status
        const updatedPayment = await this.updatePaymentStatus(payment.id, status, trx);

        // If payment completed, confirm reservation
        if (status === 'completed' && payment.reservation_token) {
          await reservationService.confirmReservation(
            payment.reservation_token,
            payment.id
          );
        }

        // Mark webhook as processed
        await cache.set(webhookId, true, 86400); // 24 hours

        // Log webhook delivery
        await trx('webhook_deliveries').insert({
          event_type,
          webhook_url: webhookData.webhook_url || 'internal',
          payload: JSON.stringify(webhookData),
          status: 'delivered',
          payment_id: payment.id,
          delivered_at: new Date()
        });

        logger.info('Webhook processed successfully', {
          payment_id: payment.id,
          event_type,
          status
        });

        return { status: 'processed', payment: updatedPayment };

      } catch (error) {
        logger.error('Webhook processing failed:', error);

        // Log failed webhook
        await trx('webhook_deliveries').insert({
          event_type,
          webhook_url: webhookData.webhook_url || 'internal',
          payload: JSON.stringify(webhookData),
          status: 'failed',
          error_message: error.message
        });

        throw error;
      }
    });
  }

  // Update payment status with proper state transitions
  async updatePaymentStatus(paymentId, newStatus, trx = null) {
    const connection = trx || db;

    const payment = await connection('payments').where({ id: paymentId }).first();
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['processing', 'failed', 'cancelled'],
      'processing': ['completed', 'failed', 'cancelled'],
      'completed': ['refunded', 'partially_refunded'],
      'failed': ['pending'], // Allow retry
      'cancelled': [],
      'refunded': [],
      'partially_refunded': ['refunded']
    };

    if (!validTransitions[payment.status]?.includes(newStatus)) {
      throw new AppError(`Invalid status transition from ${payment.status} to ${newStatus}`, 400);
    }

    // Update payment
    const updateData = {
      status: newStatus,
      updated_at: new Date()
    };

    if (newStatus === 'completed') {
      updateData.completed_at = new Date();
    } else if (newStatus === 'failed') {
      updateData.failed_at = new Date();
    }

    const [updatedPayment] = await connection('payments')
      .where({ id: paymentId })
      .update(updateData)
      .returning('*');

    // Update cache
    await cache.set(`payment:${paymentId}`, updatedPayment, 600);

    return updatedPayment;
  }

  // Get webhook secret for provider
  getWebhookSecret(provider) {
    const secrets = {
      'mtn': process.env.MTN_WEBHOOK_SECRET,
      'airtel': process.env.AIRTEL_WEBHOOK_SECRET,
      'rswitch': process.env.RSWITCH_WEBHOOK_SECRET
    };

    return secrets[provider] || process.env.DEFAULT_WEBHOOK_SECRET;
  }

  // Retry failed payments
  async retryPayment(paymentId) {
    const payment = await db('payments').where({ id: paymentId }).first();
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.status !== 'failed') {
      throw new AppError('Only failed payments can be retried', 400);
    }

    // Check retry limit
    if (payment.retry_count >= 3) {
      throw new AppError('Maximum retry attempts exceeded', 400);
    }

    return await withTransaction(async (trx) => {
      // Update retry count and reset status
      await trx('payments')
        .where({ id: paymentId })
        .update({
          status: 'pending',
          retry_count: payment.retry_count + 1,
          initiated_at: new Date(),
          expires_at: new Date(Date.now() + 10 * 60 * 1000)
        });

      // Reprocess payment
      const paymentResponse = await this.processPaymentWithFailover(payment, payment.customer_phone);

      // Update with new external reference
      await trx('payments')
        .where({ id: paymentId })
        .update({
          external_reference: paymentResponse.externalReference,
          status: paymentResponse.status,
          provider_response: JSON.stringify(paymentResponse.providerData)
        });

      return this.formatPaymentResponse({
        ...payment,
        external_reference: paymentResponse.externalReference,
        status: paymentResponse.status
      });
    });
  }
}

module.exports = new PaymentService();
