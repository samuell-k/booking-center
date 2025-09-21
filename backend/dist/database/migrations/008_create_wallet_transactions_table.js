/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('wallet_transactions', function (table) {
        // Primary key
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        // Wallet and user relationship
        table.uuid('wallet_id').references('id').inTable('wallets').onDelete('CASCADE').notNullable();
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        // Transaction identification
        table.string('transaction_reference', 100).unique().notNullable();
        table.string('external_reference', 255); // Reference from external system
        // Transaction details
        table.enum('type', [
            'topup', 'payment', 'refund', 'transfer_in', 'transfer_out',
            'cashback', 'bonus', 'penalty', 'fee', 'withdrawal', 'adjustment'
        ]).notNullable();
        table.decimal('amount', 12, 2).notNullable();
        table.string('currency', 3).defaultTo('RWF');
        table.decimal('fee', 10, 2).defaultTo(0);
        table.decimal('net_amount', 12, 2).notNullable(); // Amount after fees
        // Balance tracking
        table.decimal('balance_before', 12, 2).notNullable();
        table.decimal('balance_after', 12, 2).notNullable();
        // Transaction status
        table.enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed']).defaultTo('pending');
        table.text('status_message');
        table.string('failure_reason', 255);
        // Related entities
        table.uuid('payment_id').references('id').inTable('payments').onDelete('SET NULL');
        table.uuid('event_id').references('id').inTable('events').onDelete('SET NULL');
        table.uuid('ticket_id').references('id').inTable('tickets').onDelete('SET NULL');
        table.uuid('related_transaction_id').references('id').inTable('wallet_transactions').onDelete('SET NULL');
        // Transfer details (for wallet-to-wallet transfers)
        table.uuid('from_wallet_id').references('id').inTable('wallets').onDelete('SET NULL');
        table.uuid('to_wallet_id').references('id').inTable('wallets').onDelete('SET NULL');
        table.string('transfer_message', 255);
        // External payment method (for topups/withdrawals)
        table.enum('payment_method', [
            'mtn_momo', 'airtel_money', 'bank_transfer', 'credit_card',
            'debit_card', 'cash', 'stripe', 'other'
        ]);
        table.string('payment_account', 100); // Phone number, card last 4, etc.
        table.string('payment_provider', 100);
        // Description and metadata
        table.string('description', 500).notNullable();
        table.json('metadata').defaultTo('{}');
        table.text('notes');
        // Timing
        table.timestamp('initiated_at').notNullable();
        table.timestamp('completed_at');
        table.timestamp('failed_at');
        // Reconciliation
        table.boolean('reconciled').defaultTo(false);
        table.timestamp('reconciled_at');
        table.string('reconciliation_reference', 100);
        // Fraud and security
        table.boolean('flagged_suspicious').defaultTo(false);
        table.text('security_notes');
        table.decimal('fraud_score', 5, 2).defaultTo(0);
        // Analytics
        table.string('channel', 50).defaultTo('web'); // web, mobile, api, admin
        table.string('ip_address', 45);
        table.string('user_agent', 500);
        table.string('device_id', 100);
        // Cashback and rewards
        table.decimal('cashback_earned', 8, 2).defaultTo(0);
        table.integer('loyalty_points_earned').defaultTo(0);
        table.boolean('cashback_eligible').defaultTo(true);
        // Reversal information
        table.uuid('reversed_by_transaction_id').references('id').inTable('wallet_transactions').onDelete('SET NULL');
        table.timestamp('reversed_at');
        table.text('reversal_reason');
        table.uuid('reversed_by_user').references('id').inTable('users').onDelete('SET NULL');
        // Timestamps
        table.timestamps(true, true);
        table.timestamp('deleted_at');
        // Indexes
        table.index(['wallet_id']);
        table.index(['user_id']);
        table.index(['transaction_reference']);
        table.index(['type']);
        table.index(['status']);
        table.index(['initiated_at']);
        table.index(['completed_at']);
        table.index(['payment_id']);
        table.index(['event_id']);
        table.index(['from_wallet_id']);
        table.index(['to_wallet_id']);
        table.index(['reconciled']);
        table.index(['created_at']);
        table.index(['amount']);
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('wallet_transactions');
};
//# sourceMappingURL=008_create_wallet_transactions_table.js.map