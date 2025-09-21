/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Basic user information
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('phone', 20).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    
    // User profile
    table.string('avatar_url', 500);
    table.date('date_of_birth');
    table.enum('gender', ['male', 'female', 'other']);
    table.string('national_id', 20).unique();
    
    // Address information
    table.string('address_line1', 255);
    table.string('address_line2', 255);
    table.string('city', 100);
    table.string('province', 100);
    table.string('country', 100).defaultTo('Rwanda');
    table.string('postal_code', 20);
    
    // User preferences
    table.json('preferences').defaultTo('{}');
    table.json('favorite_teams').defaultTo('[]');
    table.json('favorite_sports').defaultTo('[]');
    
    // Account status
    table.enum('status', ['active', 'inactive', 'suspended', 'banned']).defaultTo('active');
    table.enum('role', ['user', 'team_admin', 'venue_admin', 'super_admin']).defaultTo('user');
    table.boolean('email_verified').defaultTo(false);
    table.boolean('phone_verified').defaultTo(false);
    table.timestamp('email_verified_at');
    table.timestamp('phone_verified_at');
    
    // Security
    table.string('email_verification_token', 255);
    table.string('phone_verification_token', 10);
    table.string('password_reset_token', 255);
    table.timestamp('password_reset_expires');
    table.timestamp('last_login');
    table.string('last_login_ip', 45);
    table.integer('failed_login_attempts').defaultTo(0);
    table.timestamp('locked_until');
    
    // Two-factor authentication
    table.boolean('two_factor_enabled').defaultTo(false);
    table.string('two_factor_secret', 255);
    table.json('two_factor_backup_codes');
    
    // Notifications preferences
    table.boolean('email_notifications').defaultTo(true);
    table.boolean('sms_notifications').defaultTo(true);
    table.boolean('push_notifications').defaultTo(true);
    table.boolean('marketing_emails').defaultTo(false);
    
    // Device information
    table.json('device_tokens').defaultTo('[]'); // For push notifications
    table.string('timezone', 50).defaultTo('Africa/Kigali');
    table.string('language', 10).defaultTo('en');
    
    // Referral system
    table.string('referral_code', 20).unique();
    table.uuid('referred_by').references('id').inTable('users').onDelete('SET NULL');
    table.integer('referral_count').defaultTo(0);
    
    // Analytics
    table.integer('total_tickets_purchased').defaultTo(0);
    table.decimal('total_amount_spent', 12, 2).defaultTo(0);
    table.timestamp('first_purchase_at');
    table.timestamp('last_purchase_at');
    
    // Timestamps
    table.timestamps(true, true);
    table.timestamp('deleted_at');
    
    // Indexes
    table.index(['email']);
    table.index(['phone']);
    table.index(['status']);
    table.index(['role']);
    table.index(['created_at']);
    table.index(['referral_code']);
    table.index(['referred_by']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
