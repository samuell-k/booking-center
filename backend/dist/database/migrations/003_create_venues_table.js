/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('venues', function (table) {
        // Primary key
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        // Basic venue information
        table.string('name', 255).notNullable();
        table.string('short_name', 100);
        table.text('description');
        table.string('image_url', 500);
        table.json('gallery_images').defaultTo('[]');
        // Venue type and capacity
        table.enum('type', ['stadium', 'arena', 'court', 'field', 'hall', 'outdoor', 'other']).notNullable();
        table.json('supported_sports').defaultTo('[]'); // Array of sports this venue supports
        table.integer('total_capacity').notNullable();
        table.integer('vip_capacity').defaultTo(0);
        table.integer('regular_capacity').notNullable();
        table.integer('standing_capacity').defaultTo(0);
        // Location information
        table.string('address_line1', 255).notNullable();
        table.string('address_line2', 255);
        table.string('city', 100).notNullable();
        table.string('province', 100).notNullable();
        table.string('country', 100).defaultTo('Rwanda');
        table.string('postal_code', 20);
        table.decimal('latitude', 10, 8);
        table.decimal('longitude', 11, 8);
        table.text('directions');
        // Contact information
        table.string('email', 255);
        table.string('phone', 20);
        table.string('website', 255);
        table.string('emergency_contact', 20);
        // Venue management
        table.uuid('owner_id').references('id').inTable('users').onDelete('SET NULL');
        table.uuid('manager_id').references('id').inTable('users').onDelete('SET NULL');
        table.json('admin_users').defaultTo('[]'); // Array of user IDs who can manage this venue
        // Facilities and amenities
        table.json('facilities').defaultTo('[]'); // parking, restrooms, food_court, wifi, etc.
        table.json('accessibility_features').defaultTo('[]'); // wheelchair_access, hearing_loop, etc.
        table.boolean('has_parking').defaultTo(false);
        table.integer('parking_capacity').defaultTo(0);
        table.boolean('has_food_court').defaultTo(false);
        table.boolean('has_wifi').defaultTo(false);
        table.boolean('has_security').defaultTo(true);
        // Seating configuration
        table.json('seating_map').defaultTo('{}'); // Detailed seating layout
        table.json('pricing_zones').defaultTo('[]'); // Different pricing zones
        table.boolean('has_numbered_seats').defaultTo(true);
        table.boolean('allows_standing').defaultTo(false);
        // Operating information
        table.time('opening_time');
        table.time('closing_time');
        table.json('operating_days').defaultTo('[]'); // Days of the week
        table.decimal('base_rental_cost', 10, 2).defaultTo(0);
        table.decimal('hourly_rate', 8, 2).defaultTo(0);
        // Technical specifications
        table.boolean('has_lighting').defaultTo(true);
        table.boolean('has_sound_system').defaultTo(false);
        table.boolean('has_video_screen').defaultTo(false);
        table.boolean('has_live_streaming').defaultTo(false);
        table.string('field_surface', 100); // grass, artificial_turf, hardwood, etc.
        table.json('dimensions').defaultTo('{}'); // length, width, height
        // Safety and compliance
        table.string('safety_certificate', 255);
        table.date('safety_certificate_expires');
        table.string('fire_safety_certificate', 255);
        table.date('fire_safety_expires');
        table.integer('max_safe_capacity');
        table.json('emergency_exits').defaultTo('[]');
        // Financial information
        table.string('bank_account_name', 255);
        table.string('bank_account_number', 50);
        table.string('bank_name', 100);
        table.decimal('commission_rate', 5, 2).defaultTo(10.00); // Percentage commission for events
        // Venue statistics
        table.integer('total_events_hosted').defaultTo(0);
        table.decimal('total_revenue_generated', 12, 2).defaultTo(0);
        table.decimal('average_attendance', 8, 2).defaultTo(0);
        table.decimal('utilization_rate', 5, 2).defaultTo(0); // Percentage of time venue is booked
        table.integer('total_visitors').defaultTo(0);
        // Venue status
        table.enum('status', ['active', 'inactive', 'maintenance', 'renovation', 'closed']).defaultTo('active');
        table.boolean('verified').defaultTo(false);
        table.timestamp('verified_at');
        table.uuid('verified_by').references('id').inTable('users').onDelete('SET NULL');
        // Booking and availability
        table.boolean('available_for_booking').defaultTo(true);
        table.integer('advance_booking_days').defaultTo(365); // How far in advance can events be booked
        table.json('blackout_dates').defaultTo('[]'); // Dates when venue is not available
        // Weather considerations (for outdoor venues)
        table.boolean('weather_dependent').defaultTo(false);
        table.boolean('has_roof').defaultTo(false);
        table.boolean('has_heating').defaultTo(false);
        table.boolean('has_air_conditioning').defaultTo(false);
        // SEO and metadata
        table.string('slug', 255).unique();
        table.json('metadata').defaultTo('{}');
        table.text('seo_description');
        table.string('seo_keywords', 500);
        // Timestamps
        table.timestamps(true, true);
        table.timestamp('deleted_at');
        // Indexes
        table.index(['name']);
        table.index(['type']);
        table.index(['city']);
        table.index(['province']);
        table.index(['status']);
        table.index(['verified']);
        table.index(['available_for_booking']);
        table.index(['slug']);
        table.index(['owner_id']);
        table.index(['created_at']);
        table.index(['latitude', 'longitude']); // For location-based queries
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('venues');
};
//# sourceMappingURL=003_create_venues_table.js.map