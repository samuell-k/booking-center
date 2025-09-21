/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        // Add idempotency key to payments table
        .alterTable('payments', function (table) {
        table.string('idempotency_key', 255).unique();
        table.index(['idempotency_key']);
    })
        // Add idempotency key to orders/tickets
        .alterTable('tickets', function (table) {
        table.string('idempotency_key', 255);
        table.index(['idempotency_key']);
    })
        // Create seat reservations table for preventing overselling
        .createTable('seat_reservations', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        // Event and seat information
        table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE').notNullable();
        table.string('section', 50);
        table.string('row', 10);
        table.string('seat_number', 10);
        table.enum('ticket_type', ['regular', 'vip', 'student', 'child']).notNullable();
        // Reservation details
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('session_id', 255); // For anonymous reservations
        table.string('reservation_token', 255).unique().notNullable();
        table.timestamp('reserved_at').notNullable();
        table.timestamp('expires_at').notNullable();
        // Status
        table.enum('status', ['active', 'expired', 'confirmed', 'cancelled']).defaultTo('active');
        table.uuid('payment_id').references('id').inTable('payments').onDelete('SET NULL');
        // Metadata
        table.json('metadata').defaultTo('{}');
        table.timestamps(true, true);
        // Indexes
        table.index(['event_id', 'section', 'row', 'seat_number']);
        table.index(['reservation_token']);
        table.index(['expires_at']);
        table.index(['user_id']);
        table.index(['session_id']);
        table.index(['status']);
        // Unique constraint to prevent double booking
        table.unique(['event_id', 'section', 'row', 'seat_number', 'status'], {
            predicate: knex.raw("status = 'active'")
        });
    })
        // Create API request logs for monitoring and debugging
        .createTable('api_request_logs', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        // Request information
        table.string('correlation_id', 255).notNullable();
        table.string('method', 10).notNullable();
        table.string('path', 500).notNullable();
        table.json('query_params').defaultTo('{}');
        table.json('headers').defaultTo('{}');
        table.text('request_body');
        // Response information
        table.integer('status_code');
        table.text('response_body');
        table.integer('response_time_ms');
        // User and session
        table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
        table.string('session_id', 255);
        table.string('ip_address', 45);
        table.string('user_agent', 500);
        // Timing
        table.timestamp('started_at').notNullable();
        table.timestamp('completed_at');
        // Error information
        table.text('error_message');
        table.text('error_stack');
        // Indexes
        table.index(['correlation_id']);
        table.index(['path']);
        table.index(['status_code']);
        table.index(['user_id']);
        table.index(['started_at']);
        table.index(['response_time_ms']);
    })
        // Create rate limiting table
        .createTable('rate_limits', function (table) {
        table.string('key', 255).primary();
        table.integer('count').defaultTo(0);
        table.timestamp('window_start').notNullable();
        table.timestamp('expires_at').notNullable();
        table.json('metadata').defaultTo('{}');
        // Indexes
        table.index(['expires_at']);
        table.index(['window_start']);
    })
        // Create webhook delivery logs
        .createTable('webhook_deliveries', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        // Webhook information
        table.string('event_type', 100).notNullable();
        table.string('webhook_url', 500).notNullable();
        table.json('payload').notNullable();
        table.json('headers').defaultTo('{}');
        // Delivery information
        table.enum('status', ['pending', 'delivered', 'failed', 'retrying']).defaultTo('pending');
        table.integer('attempt_count').defaultTo(0);
        table.integer('max_attempts').defaultTo(3);
        table.timestamp('next_attempt_at');
        // Response information
        table.integer('response_status_code');
        table.text('response_body');
        table.integer('response_time_ms');
        table.text('error_message');
        // Related entities
        table.uuid('payment_id').references('id').inTable('payments').onDelete('CASCADE');
        table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE');
        // Timing
        table.timestamps(true, true);
        table.timestamp('delivered_at');
        // Indexes
        table.index(['event_type']);
        table.index(['status']);
        table.index(['next_attempt_at']);
        table.index(['payment_id']);
        table.index(['created_at']);
    })
        // Create system metrics table for monitoring
        .createTable('system_metrics', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        // Metric information
        table.string('metric_name', 100).notNullable();
        table.string('metric_type', 50).notNullable(); // counter, gauge, histogram
        table.decimal('value', 15, 4).notNullable();
        table.json('labels').defaultTo('{}');
        table.json('metadata').defaultTo('{}');
        // Timing
        table.timestamp('recorded_at').notNullable();
        // Indexes
        table.index(['metric_name', 'recorded_at']);
        table.index(['metric_type']);
        table.index(['recorded_at']);
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('system_metrics')
        .dropTableIfExists('webhook_deliveries')
        .dropTableIfExists('rate_limits')
        .dropTableIfExists('api_request_logs')
        .dropTableIfExists('seat_reservations')
        .alterTable('tickets', function (table) {
        table.dropColumn('idempotency_key');
    })
        .alterTable('payments', function (table) {
        table.dropColumn('idempotency_key');
    });
};
//# sourceMappingURL=013_add_idempotency_and_reservations.js.map