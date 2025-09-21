/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('events', function (table) {
        // Primary key
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        // Basic event information
        table.string('title', 255).notNullable();
        table.string('subtitle', 255);
        table.text('description');
        table.string('image_url', 500);
        table.json('gallery_images').defaultTo('[]');
        // Event type and category
        table.enum('type', ['match', 'tournament', 'concert', 'conference', 'festival', 'other']).notNullable();
        table.enum('sport', ['football', 'basketball', 'volleyball', 'tennis', 'athletics', 'other']);
        table.string('category', 100); // Premier League, Cup, Friendly, etc.
        table.string('league', 100);
        table.string('season', 50);
        // Teams (for matches)
        table.uuid('home_team_id').references('id').inTable('teams').onDelete('CASCADE');
        table.uuid('away_team_id').references('id').inTable('teams').onDelete('CASCADE');
        table.integer('home_team_score');
        table.integer('away_team_score');
        // Venue and timing
        table.uuid('venue_id').references('id').inTable('venues').onDelete('CASCADE').notNullable();
        table.timestamp('start_datetime').notNullable();
        table.timestamp('end_datetime');
        table.integer('duration_minutes'); // Expected duration
        table.string('timezone', 50).defaultTo('Africa/Kigali');
        // Event organizer
        table.uuid('organizer_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.string('organizer_name', 255);
        table.string('organizer_contact', 255);
        // Ticketing information
        table.boolean('tickets_available').defaultTo(true);
        table.timestamp('ticket_sales_start');
        table.timestamp('ticket_sales_end');
        table.integer('total_tickets').notNullable();
        table.integer('tickets_sold').defaultTo(0);
        table.integer('tickets_available_count').notNullable();
        // Pricing
        table.decimal('regular_price', 10, 2).notNullable();
        table.decimal('vip_price', 10, 2);
        table.decimal('student_price', 10, 2);
        table.decimal('child_price', 10, 2);
        table.json('pricing_tiers').defaultTo('[]'); // Multiple pricing options
        // Capacity management
        table.integer('regular_capacity').notNullable();
        table.integer('vip_capacity').defaultTo(0);
        table.integer('student_capacity').defaultTo(0);
        table.integer('child_capacity').defaultTo(0);
        table.integer('regular_sold').defaultTo(0);
        table.integer('vip_sold').defaultTo(0);
        table.integer('student_sold').defaultTo(0);
        table.integer('child_sold').defaultTo(0);
        // Event status
        table.enum('status', ['draft', 'published', 'cancelled', 'postponed', 'completed', 'live']).defaultTo('draft');
        table.text('cancellation_reason');
        table.timestamp('cancelled_at');
        table.uuid('cancelled_by').references('id').inTable('users').onDelete('SET NULL');
        // Weather considerations
        table.enum('weather_dependency', ['none', 'low', 'medium', 'high']).defaultTo('none');
        table.string('weather_conditions', 255);
        table.boolean('weather_backup_plan').defaultTo(false);
        table.text('weather_backup_details');
        // Age restrictions and requirements
        table.integer('minimum_age').defaultTo(0);
        table.boolean('requires_id').defaultTo(false);
        table.json('restrictions').defaultTo('[]'); // No alcohol, no smoking, etc.
        table.json('requirements').defaultTo('[]'); // Vaccination, dress code, etc.
        // Media and broadcasting
        table.boolean('live_streaming').defaultTo(false);
        table.string('streaming_url', 500);
        table.boolean('tv_broadcast').defaultTo(false);
        table.string('tv_channel', 100);
        table.boolean('radio_broadcast').defaultTo(false);
        table.string('radio_station', 100);
        // Social media and marketing
        table.json('social_media_links').defaultTo('{}');
        table.string('hashtag', 100);
        table.json('sponsors').defaultTo('[]');
        table.json('partners').defaultTo('[]');
        // Financial information
        table.decimal('total_revenue', 12, 2).defaultTo(0);
        table.decimal('organizer_revenue', 12, 2).defaultTo(0);
        table.decimal('venue_revenue', 12, 2).defaultTo(0);
        table.decimal('platform_revenue', 12, 2).defaultTo(0);
        table.decimal('team_revenue', 12, 2).defaultTo(0);
        // Analytics and engagement
        table.integer('views_count').defaultTo(0);
        table.integer('shares_count').defaultTo(0);
        table.integer('likes_count').defaultTo(0);
        table.integer('comments_count').defaultTo(0);
        table.decimal('average_rating', 3, 2).defaultTo(0);
        table.integer('rating_count').defaultTo(0);
        // Attendance tracking
        table.integer('expected_attendance');
        table.integer('actual_attendance').defaultTo(0);
        table.timestamp('gates_open_time');
        table.timestamp('gates_close_time');
        table.integer('no_shows').defaultTo(0);
        // Special features
        table.boolean('featured').defaultTo(false);
        table.boolean('trending').defaultTo(false);
        table.integer('priority').defaultTo(0); // For sorting/featuring
        table.json('tags').defaultTo('[]');
        table.json('custom_fields').defaultTo('{}');
        // Notifications
        table.boolean('send_reminders').defaultTo(true);
        table.json('reminder_schedule').defaultTo('[]'); // When to send reminders
        table.boolean('notify_on_changes').defaultTo(true);
        // SEO and metadata
        table.string('slug', 255).unique();
        table.json('metadata').defaultTo('{}');
        table.text('seo_description');
        table.string('seo_keywords', 500);
        // Timestamps
        table.timestamps(true, true);
        table.timestamp('deleted_at');
        // Indexes
        table.index(['title']);
        table.index(['type']);
        table.index(['sport']);
        table.index(['status']);
        table.index(['start_datetime']);
        table.index(['venue_id']);
        table.index(['organizer_id']);
        table.index(['home_team_id']);
        table.index(['away_team_id']);
        table.index(['featured']);
        table.index(['trending']);
        table.index(['slug']);
        table.index(['created_at']);
        table.index(['ticket_sales_start', 'ticket_sales_end']);
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('events');
};
//# sourceMappingURL=004_create_events_table.js.map