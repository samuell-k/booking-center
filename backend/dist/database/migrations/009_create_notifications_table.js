/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('notifications', function (table) {
        // Primary key
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        // User relationship
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        // Notification content
        table.string('title', 255).notNullable();
        table.text('message').notNullable();
        table.string('short_message', 160); // For SMS
        table.json('data').defaultTo('{}'); // Additional data payload
        // Notification type and category
        table.enum('type', [
            'ticket_purchase', 'payment_success', 'payment_failed', 'event_reminder',
            'event_cancelled', 'event_postponed', 'wallet_topup', 'wallet_low_balance',
            'ticket_transfer', 'promotional', 'system', 'security', 'other'
        ]).notNullable();
        table.string('category', 100);
        table.enum('priority', ['low', 'normal', 'high', 'urgent']).defaultTo('normal');
        // Delivery channels
        table.boolean('send_push').defaultTo(true);
        table.boolean('send_email').defaultTo(false);
        table.boolean('send_sms').defaultTo(false);
        table.boolean('send_in_app').defaultTo(true);
        // Delivery status
        table.enum('status', ['pending', 'sent', 'delivered', 'failed', 'cancelled']).defaultTo('pending');
        table.timestamp('scheduled_at');
        table.timestamp('sent_at');
        table.timestamp('delivered_at');
        table.timestamp('failed_at');
        table.text('failure_reason');
        table.integer('retry_count').defaultTo(0);
        table.integer('max_retries').defaultTo(3);
        // Push notification details
        table.string('push_token', 500);
        table.boolean('push_sent').defaultTo(false);
        table.timestamp('push_sent_at');
        table.string('push_message_id', 255);
        table.json('push_response').defaultTo('{}');
        // Email details
        table.string('email_address', 255);
        table.boolean('email_sent').defaultTo(false);
        table.timestamp('email_sent_at');
        table.string('email_message_id', 255);
        table.json('email_response').defaultTo('{}');
        // SMS details
        table.string('phone_number', 20);
        table.boolean('sms_sent').defaultTo(false);
        table.timestamp('sms_sent_at');
        table.string('sms_message_id', 255);
        table.json('sms_response').defaultTo('{}');
        // In-app notification
        table.boolean('read').defaultTo(false);
        table.timestamp('read_at');
        table.boolean('clicked').defaultTo(false);
        table.timestamp('clicked_at');
        table.string('action_url', 500);
        table.json('action_data').defaultTo('{}');
        // Related entities
        table.uuid('event_id').references('id').inTable('events').onDelete('SET NULL');
        table.uuid('ticket_id').references('id').inTable('tickets').onDelete('SET NULL');
        table.uuid('payment_id').references('id').inTable('payments').onDelete('SET NULL');
        table.uuid('wallet_transaction_id').references('id').inTable('wallet_transactions').onDelete('SET NULL');
        // Template and personalization
        table.string('template_id', 100);
        table.json('template_variables').defaultTo('{}');
        table.string('language', 10).defaultTo('en');
        table.string('timezone', 50).defaultTo('Africa/Kigali');
        // Tracking and analytics
        table.string('campaign_id', 100);
        table.string('utm_source', 100);
        table.string('utm_medium', 100);
        table.string('utm_campaign', 100);
        table.json('tracking_data').defaultTo('{}');
        // Expiration
        table.timestamp('expires_at');
        table.boolean('expired').defaultTo(false);
        // Metadata
        table.json('metadata').defaultTo('{}');
        table.text('notes');
        // Timestamps
        table.timestamps(true, true);
        table.timestamp('deleted_at');
        // Indexes
        table.index(['user_id']);
        table.index(['type']);
        table.index(['status']);
        table.index(['priority']);
        table.index(['scheduled_at']);
        table.index(['sent_at']);
        table.index(['read']);
        table.index(['event_id']);
        table.index(['ticket_id']);
        table.index(['payment_id']);
        table.index(['created_at']);
        table.index(['expires_at']);
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('notifications');
};
//# sourceMappingURL=009_create_notifications_table.js.map