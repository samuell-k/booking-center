/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('scanner_logs', function(table) {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Scanner identification
    table.string('scanner_id', 100).notNullable();
    table.string('scanner_name', 255);
    table.string('scanner_location', 255);
    table.enum('scanner_type', ['handheld', 'kiosk', 'mobile', 'robot', 'gate']).defaultTo('kiosk');
    
    // Ticket and event information
    table.uuid('ticket_id').references('id').inTable('tickets').onDelete('CASCADE');
    table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.string('qr_code', 500);
    table.string('ticket_number', 50);
    
    // Scan details
    table.timestamp('scanned_at').notNullable();
    table.enum('scan_result', ['valid', 'invalid', 'already_used', 'expired', 'cancelled', 'not_found', 'error']).notNullable();
    table.text('scan_message');
    table.json('scan_data').defaultTo('{}');
    
    // Scanner operator
    table.uuid('operator_id').references('id').inTable('users').onDelete('SET NULL');
    table.string('operator_name', 255);
    
    // Validation details
    table.boolean('ticket_valid').defaultTo(false);
    table.boolean('event_active').defaultTo(true);
    table.boolean('within_time_window').defaultTo(true);
    table.boolean('correct_venue').defaultTo(true);
    table.text('validation_notes');
    
    // Security and fraud detection
    table.boolean('suspicious_activity').defaultTo(false);
    table.decimal('fraud_score', 5, 2).defaultTo(0);
    table.json('security_flags').defaultTo('[]');
    table.text('security_notes');
    
    // Device and technical information
    table.string('device_id', 100);
    table.string('device_model', 100);
    table.string('app_version', 50);
    table.string('os_version', 50);
    table.string('ip_address', 45);
    table.json('device_info').defaultTo('{}');
    
    // Location and GPS
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.decimal('accuracy', 8, 2); // GPS accuracy in meters
    table.string('location_method', 50); // gps, network, manual
    
    // Image and media
    table.string('scan_image_url', 500); // Photo of the ticket/QR code
    table.string('user_photo_url', 500); // Photo of the ticket holder
    table.boolean('photo_match_verified').defaultTo(false);
    table.decimal('photo_match_confidence', 5, 2);
    
    // Performance metrics
    table.integer('scan_duration_ms'); // Time taken to process scan
    table.integer('network_latency_ms'); // Network response time
    table.boolean('offline_mode').defaultTo(false);
    table.timestamp('synced_at'); // When offline scan was synced
    
    // Entry/exit tracking
    table.enum('entry_type', ['entry', 'exit', 'reentry']).defaultTo('entry');
    table.integer('entry_count').defaultTo(1); // How many times this ticket has been scanned
    table.timestamp('first_entry_at');
    table.timestamp('last_exit_at');
    table.boolean('currently_inside').defaultTo(true);
    
    // Batch processing
    table.string('batch_id', 100); // For bulk scan operations
    table.integer('batch_sequence'); // Order within batch
    
    // Error handling
    table.string('error_code', 50);
    table.text('error_message');
    table.json('error_details').defaultTo('{}');
    table.boolean('manual_override').defaultTo(false);
    table.uuid('override_by').references('id').inTable('users').onDelete('SET NULL');
    table.text('override_reason');
    
    // Analytics and reporting
    table.string('gate_number', 20);
    table.string('section', 50);
    table.integer('queue_length'); // Number of people in queue when scanned
    table.integer('processing_time_seconds');
    
    // Audit trail
    table.json('audit_trail').defaultTo('[]');
    table.boolean('data_exported').defaultTo(false);
    table.timestamp('exported_at');
    
    // Metadata
    table.json('metadata').defaultTo('{}');
    table.text('notes');
    
    // Timestamps
    table.timestamps(true, true);
    table.timestamp('deleted_at');
    
    // Indexes
    table.index(['scanner_id']);
    table.index(['ticket_id']);
    table.index(['event_id']);
    table.index(['user_id']);
    table.index(['scanned_at']);
    table.index(['scan_result']);
    table.index(['ticket_valid']);
    table.index(['suspicious_activity']);
    table.index(['operator_id']);
    table.index(['device_id']);
    table.index(['batch_id']);
    table.index(['gate_number']);
    table.index(['created_at']);
    table.index(['qr_code']);
    table.index(['ticket_number']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('scanner_logs');
};
