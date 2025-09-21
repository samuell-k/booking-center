/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tickets', function(table) {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Ticket identification
    table.string('ticket_number', 50).unique().notNullable();
    table.string('qr_code', 500).unique().notNullable();
    table.string('barcode', 100).unique();
    
    // Event and user relationship
    table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE').notNullable();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.uuid('payment_id').references('id').inTable('payments').onDelete('SET NULL');
    
    // Ticket details
    table.enum('ticket_type', ['regular', 'vip', 'student', 'child', 'group', 'complimentary']).notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.decimal('service_fee', 8, 2).defaultTo(0);
    table.decimal('total_amount', 10, 2).notNullable();
    table.string('currency', 3).defaultTo('RWF');
    
    // Seating information
    table.string('section', 50);
    table.string('row', 10);
    table.string('seat_number', 10);
    table.json('seating_details').defaultTo('{}'); // Additional seating info
    
    // Ticket holder information
    table.string('holder_name', 255);
    table.string('holder_email', 255);
    table.string('holder_phone', 20);
    table.string('holder_id_number', 50); // National ID or passport
    table.json('holder_details').defaultTo('{}'); // Additional holder info
    
    // Purchase information
    table.timestamp('purchased_at').notNullable();
    table.string('purchase_channel', 50).defaultTo('web'); // web, mobile, pos, etc.
    table.string('purchase_location', 255); // Where the ticket was bought
    table.uuid('sold_by').references('id').inTable('users').onDelete('SET NULL'); // Staff member who sold
    
    // Ticket status
    table.enum('status', ['active', 'used', 'cancelled', 'refunded', 'transferred', 'expired']).defaultTo('active');
    table.timestamp('used_at');
    table.uuid('used_by_scanner').references('id').inTable('users').onDelete('SET NULL');
    table.string('scanner_location', 255);
    table.json('usage_details').defaultTo('{}');
    
    // Transfer and resale
    table.boolean('transferable').defaultTo(true);
    table.uuid('transferred_from').references('id').inTable('users').onDelete('SET NULL');
    table.uuid('transferred_to').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('transferred_at');
    table.text('transfer_reason');
    table.boolean('resaleable').defaultTo(false);
    table.decimal('resale_price', 10, 2);
    
    // Cancellation and refund
    table.timestamp('cancelled_at');
    table.uuid('cancelled_by').references('id').inTable('users').onDelete('SET NULL');
    table.text('cancellation_reason');
    table.boolean('refund_eligible').defaultTo(true);
    table.decimal('refund_amount', 10, 2);
    table.timestamp('refunded_at');
    table.string('refund_reference', 100);
    
    // Group booking
    table.uuid('group_booking_id'); // Reference to group booking
    table.integer('group_size');
    table.boolean('is_group_leader').defaultTo(false);
    
    // Special features
    table.json('perks').defaultTo('[]'); // VIP perks, meal vouchers, etc.
    table.json('restrictions').defaultTo('[]'); // Age restrictions, etc.
    table.boolean('requires_id_check').defaultTo(false);
    table.boolean('photo_required').defaultTo(false);
    
    // Validation and security
    table.string('validation_code', 20); // Additional security code
    table.integer('scan_count').defaultTo(0); // How many times scanned
    table.timestamp('last_scanned_at');
    table.json('scan_history').defaultTo('[]'); // History of scans
    table.boolean('suspicious_activity').defaultTo(false);
    table.text('security_notes');
    
    // Digital features
    table.string('digital_wallet_id', 100); // Apple Wallet, Google Pay
    table.boolean('added_to_wallet').defaultTo(false);
    table.timestamp('wallet_added_at');
    table.json('digital_features').defaultTo('{}');
    
    // Notifications
    table.boolean('email_sent').defaultTo(false);
    table.boolean('sms_sent').defaultTo(false);
    table.timestamp('last_notification_sent');
    table.json('notification_history').defaultTo('[]');
    
    // Analytics
    table.string('utm_source', 100); // Marketing attribution
    table.string('utm_medium', 100);
    table.string('utm_campaign', 100);
    table.json('analytics_data').defaultTo('{}');
    
    // Print information
    table.boolean('printed').defaultTo(false);
    table.timestamp('printed_at');
    table.integer('print_count').defaultTo(0);
    table.string('printer_id', 100);
    
    // Customer service
    table.integer('support_tickets_count').defaultTo(0);
    table.timestamp('last_support_contact');
    table.json('support_history').defaultTo('[]');
    table.decimal('customer_satisfaction', 3, 2); // Rating out of 5
    
    // Timestamps
    table.timestamps(true, true);
    table.timestamp('deleted_at');
    
    // Indexes
    table.index(['ticket_number']);
    table.index(['qr_code']);
    table.index(['event_id']);
    table.index(['user_id']);
    table.index(['payment_id']);
    table.index(['status']);
    table.index(['ticket_type']);
    table.index(['purchased_at']);
    table.index(['used_at']);
    table.index(['holder_email']);
    table.index(['holder_phone']);
    table.index(['group_booking_id']);
    table.index(['created_at']);
    table.index(['transferred_from', 'transferred_to']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tickets');
};
