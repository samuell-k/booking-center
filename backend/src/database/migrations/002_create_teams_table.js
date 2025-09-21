/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('teams', function(table) {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Basic team information
    table.string('name', 255).notNullable();
    table.string('short_name', 50);
    table.string('code', 10).unique(); // e.g., APR, RAY, POL
    table.text('description');
    table.string('logo_url', 500);
    table.string('banner_url', 500);
    
    // Team details
    table.enum('sport', ['football', 'basketball', 'volleyball', 'tennis', 'athletics', 'other']).notNullable();
    table.string('league', 100);
    table.string('division', 100);
    table.integer('founded_year');
    table.string('home_venue', 255);
    
    // Contact information
    table.string('email', 255);
    table.string('phone', 20);
    table.string('website', 255);
    table.json('social_media').defaultTo('{}'); // {facebook, twitter, instagram, youtube}
    
    // Address
    table.string('address_line1', 255);
    table.string('address_line2', 255);
    table.string('city', 100);
    table.string('province', 100);
    table.string('country', 100).defaultTo('Rwanda');
    
    // Team management
    table.uuid('owner_id').references('id').inTable('users').onDelete('SET NULL');
    table.uuid('manager_id').references('id').inTable('users').onDelete('SET NULL');
    table.json('admin_users').defaultTo('[]'); // Array of user IDs who can manage this team
    
    // Team colors and branding
    table.string('primary_color', 7); // Hex color
    table.string('secondary_color', 7); // Hex color
    table.string('accent_color', 7); // Hex color
    
    // Financial information
    table.string('bank_account_name', 255);
    table.string('bank_account_number', 50);
    table.string('bank_name', 100);
    table.string('mobile_money_number', 20);
    table.decimal('commission_rate', 5, 2).defaultTo(5.00); // Percentage commission for ticket sales
    
    // Team statistics
    table.integer('total_matches_played').defaultTo(0);
    table.integer('total_wins').defaultTo(0);
    table.integer('total_losses').defaultTo(0);
    table.integer('total_draws').defaultTo(0);
    table.integer('total_goals_scored').defaultTo(0);
    table.integer('total_goals_conceded').defaultTo(0);
    table.integer('current_league_position');
    table.integer('points').defaultTo(0);
    
    // Fan engagement
    table.integer('total_followers').defaultTo(0);
    table.integer('total_tickets_sold').defaultTo(0);
    table.decimal('total_revenue_generated', 12, 2).defaultTo(0);
    table.decimal('average_attendance', 8, 2).defaultTo(0);
    
    // Team status
    table.enum('status', ['active', 'inactive', 'suspended', 'disbanded']).defaultTo('active');
    table.boolean('verified').defaultTo(false);
    table.timestamp('verified_at');
    table.uuid('verified_by').references('id').inTable('users').onDelete('SET NULL');
    
    // Subscription and features
    table.enum('subscription_plan', ['basic', 'premium', 'enterprise']).defaultTo('basic');
    table.timestamp('subscription_expires_at');
    table.json('enabled_features').defaultTo('[]');
    
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
    table.index(['code']);
    table.index(['sport']);
    table.index(['league']);
    table.index(['status']);
    table.index(['verified']);
    table.index(['slug']);
    table.index(['owner_id']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('teams');
};
