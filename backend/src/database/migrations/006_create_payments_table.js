/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('payments', function(table) {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Payment identification
    table.string('payment_reference', 100).unique().notNullable();
    table.string('external_reference', 255); // Reference from payment provider
    table.string('transaction_id', 255).unique();
    
    // User and event relationship
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE');
    table.json('ticket_ids').defaultTo('[]'); // Array of ticket IDs purchased
    
    // Payment amounts
    table.decimal('subtotal', 12, 2).notNullable();
    table.decimal('service_fee', 10, 2).defaultTo(0);
    table.decimal('processing_fee', 10, 2).defaultTo(0);
    table.decimal('tax_amount', 10, 2).defaultTo(0);
    table.decimal('discount_amount', 10, 2).defaultTo(0);
    table.decimal('total_amount', 12, 2).notNullable();
    table.string('currency', 3).defaultTo('RWF');
    
    // Payment method
    table.enum('payment_method', [
      'mtn_momo', 'airtel_money', 'bank_transfer', 'credit_card', 
      'debit_card', 'wallet', 'cash', 'stripe', 'paypal', 'other'
    ]).notNullable();
    table.string('payment_provider', 100); // MTN, Airtel, Stripe, etc.
    table.string('payment_account', 100); // Phone number, card last 4 digits, etc.
    
    // Payment status
    table.enum('status', [
      'pending', 'processing', 'completed', 'failed', 
      'cancelled', 'refunded', 'partially_refunded', 'disputed'
    ]).defaultTo('pending');
    table.text('status_message');
    table.string('failure_reason', 255);
    table.integer('retry_count').defaultTo(0);
    
    // Timing
    table.timestamp('initiated_at').notNullable();
    table.timestamp('completed_at');
    table.timestamp('failed_at');
    table.timestamp('expires_at');
    
    // Mobile Money specific
    table.string('momo_request_id', 255);
    table.string('momo_transaction_id', 255);
    table.string('momo_payer_message', 255);
    table.string('momo_payee_note', 255);
    
    // Card payment specific
    table.string('card_last_four', 4);
    table.string('card_brand', 50); // Visa, Mastercard, etc.
    table.string('card_country', 2);
    table.string('authorization_code', 100);
    
    // Bank transfer specific
    table.string('bank_name', 100);
    table.string('bank_account_number', 50);
    table.string('bank_reference', 100);
    
    // Refund information
    table.decimal('refunded_amount', 12, 2).defaultTo(0);
    table.timestamp('refunded_at');
    table.string('refund_reference', 100);
    table.text('refund_reason');
    table.uuid('refunded_by').references('id').inTable('users').onDelete('SET NULL');
    
    // Discount and promotion
    table.string('coupon_code', 50);
    table.string('promotion_id', 100);
    table.decimal('coupon_discount', 10, 2).defaultTo(0);
    table.string('discount_type', 50); // percentage, fixed_amount
    
    // Customer information
    table.string('customer_name', 255);
    table.string('customer_email', 255);
    table.string('customer_phone', 20);
    table.json('billing_address').defaultTo('{}');
    
    // Webhook and callback
    table.string('webhook_url', 500);
    table.json('webhook_data').defaultTo('{}');
    table.integer('webhook_attempts').defaultTo(0);
    table.timestamp('last_webhook_attempt');
    table.boolean('webhook_success').defaultTo(false);
    
    // Fraud detection
    table.decimal('fraud_score', 5, 2).defaultTo(0);
    table.boolean('fraud_check_passed').defaultTo(true);
    table.json('fraud_details').defaultTo('{}');
    table.string('risk_level', 20).defaultTo('low'); // low, medium, high
    
    // Analytics and tracking
    table.string('user_agent', 500);
    table.string('ip_address', 45);
    table.string('device_type', 50);
    table.string('browser', 100);
    table.string('utm_source', 100);
    table.string('utm_medium', 100);
    table.string('utm_campaign', 100);
    
    // Revenue distribution
    table.decimal('platform_fee', 10, 2).defaultTo(0);
    table.decimal('venue_share', 10, 2).defaultTo(0);
    table.decimal('team_share', 10, 2).defaultTo(0);
    table.decimal('organizer_share', 10, 2).defaultTo(0);
    
    // Reconciliation
    table.boolean('reconciled').defaultTo(false);
    table.timestamp('reconciled_at');
    table.string('reconciliation_reference', 100);
    table.uuid('reconciled_by').references('id').inTable('users').onDelete('SET NULL');
    
    // Additional metadata
    table.json('metadata').defaultTo('{}');
    table.json('provider_response').defaultTo('{}');
    table.text('notes');
    
    // Timestamps
    table.timestamps(true, true);
    table.timestamp('deleted_at');
    
    // Indexes
    table.index(['payment_reference']);
    table.index(['transaction_id']);
    table.index(['user_id']);
    table.index(['event_id']);
    table.index(['status']);
    table.index(['payment_method']);
    table.index(['initiated_at']);
    table.index(['completed_at']);
    table.index(['customer_email']);
    table.index(['customer_phone']);
    table.index(['reconciled']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('payments');
};
