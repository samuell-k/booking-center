/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('wallets', function(table) {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // User relationship
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable().unique();
    
    // Wallet identification
    table.string('wallet_number', 50).unique().notNullable();
    table.string('wallet_name', 255);
    
    // Balance information
    table.decimal('balance', 12, 2).defaultTo(0).notNullable();
    table.decimal('pending_balance', 12, 2).defaultTo(0); // Funds being processed
    table.decimal('reserved_balance', 12, 2).defaultTo(0); // Funds reserved for pending transactions
    table.decimal('lifetime_earned', 12, 2).defaultTo(0);
    table.decimal('lifetime_spent', 12, 2).defaultTo(0);
    table.string('currency', 3).defaultTo('RWF');
    
    // Limits and restrictions
    table.decimal('daily_limit', 12, 2).defaultTo(1000000); // 1M RWF default
    table.decimal('monthly_limit', 12, 2).defaultTo(30000000); // 30M RWF default
    table.decimal('transaction_limit', 12, 2).defaultTo(500000); // 500K RWF per transaction
    table.decimal('daily_spent', 12, 2).defaultTo(0);
    table.decimal('monthly_spent', 12, 2).defaultTo(0);
    table.date('daily_reset_date');
    table.date('monthly_reset_date');
    
    // Wallet status
    table.enum('status', ['active', 'inactive', 'suspended', 'frozen', 'closed']).defaultTo('active');
    table.boolean('verified').defaultTo(false);
    table.timestamp('verified_at');
    table.uuid('verified_by').references('id').inTable('users').onDelete('SET NULL');
    
    // Security features
    table.string('pin_hash', 255); // Hashed wallet PIN
    table.boolean('pin_enabled').defaultTo(false);
    table.integer('failed_pin_attempts').defaultTo(0);
    table.timestamp('pin_locked_until');
    table.boolean('two_factor_enabled').defaultTo(false);
    table.string('two_factor_secret', 255);
    
    // Auto top-up settings
    table.boolean('auto_topup_enabled').defaultTo(false);
    table.decimal('auto_topup_threshold', 10, 2).defaultTo(10000); // Top up when balance below this
    table.decimal('auto_topup_amount', 10, 2).defaultTo(50000); // Amount to top up
    table.string('auto_topup_method', 50); // mtn_momo, airtel_money, etc.
    table.string('auto_topup_account', 100); // Phone number or account
    
    // Cashback and rewards
    table.decimal('cashback_earned', 10, 2).defaultTo(0);
    table.decimal('cashback_rate', 5, 2).defaultTo(1.0); // Percentage cashback
    table.integer('loyalty_points').defaultTo(0);
    table.enum('tier', ['bronze', 'silver', 'gold', 'platinum']).defaultTo('bronze');
    
    // Statistics
    table.integer('total_transactions').defaultTo(0);
    table.integer('total_topups').defaultTo(0);
    table.integer('total_withdrawals').defaultTo(0);
    table.integer('total_payments').defaultTo(0);
    table.decimal('average_transaction_amount', 10, 2).defaultTo(0);
    table.timestamp('last_transaction_at');
    table.timestamp('last_topup_at');
    
    // Linked accounts
    table.json('linked_mobile_money').defaultTo('[]'); // Array of linked mobile money accounts
    table.json('linked_bank_accounts').defaultTo('[]'); // Array of linked bank accounts
    table.json('linked_cards').defaultTo('[]'); // Array of linked cards
    
    // Notifications preferences
    table.boolean('notify_on_transaction').defaultTo(true);
    table.boolean('notify_on_topup').defaultTo(true);
    table.boolean('notify_on_low_balance').defaultTo(true);
    table.decimal('low_balance_threshold', 10, 2).defaultTo(5000);
    table.boolean('notify_on_suspicious_activity').defaultTo(true);
    
    // Backup and recovery
    table.string('recovery_phrase_hash', 255); // Hashed recovery phrase
    table.json('recovery_questions').defaultTo('[]');
    table.timestamp('last_backup_at');
    table.boolean('backup_enabled').defaultTo(false);
    
    // Compliance and KYC
    table.enum('kyc_level', ['none', 'basic', 'intermediate', 'full']).defaultTo('none');
    table.timestamp('kyc_completed_at');
    table.json('kyc_documents').defaultTo('[]');
    table.boolean('aml_check_passed').defaultTo(true);
    table.timestamp('last_aml_check');
    
    // Referral system
    table.string('referral_code', 20).unique();
    table.decimal('referral_earnings', 10, 2).defaultTo(0);
    table.integer('successful_referrals').defaultTo(0);
    
    // Wallet metadata
    table.json('metadata').defaultTo('{}');
    table.json('preferences').defaultTo('{}');
    table.text('notes');
    
    // Timestamps
    table.timestamps(true, true);
    table.timestamp('deleted_at');
    
    // Indexes
    table.index(['user_id']);
    table.index(['wallet_number']);
    table.index(['status']);
    table.index(['verified']);
    table.index(['balance']);
    table.index(['tier']);
    table.index(['referral_code']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('wallets');
};
