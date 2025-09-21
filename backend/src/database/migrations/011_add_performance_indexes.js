/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.raw(`
    -- Performance indexes for high-scale operations
    
    -- Events table optimizations
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_start_datetime_status 
      ON events(start_datetime, status) WHERE status IN ('published', 'live');
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_venue_datetime 
      ON events(venue_id, start_datetime) WHERE status = 'published';
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_tickets_available 
      ON events(tickets_available_count) WHERE tickets_available = true AND status = 'published';
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_sport_datetime 
      ON events(sport, start_datetime) WHERE status = 'published';
    
    -- Tickets table optimizations for high-volume queries
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tickets_event_status_type 
      ON tickets(event_id, status, ticket_type);
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tickets_user_purchased_at 
      ON tickets(user_id, purchased_at DESC) WHERE status IN ('active', 'used');
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tickets_qr_code_hash 
      ON tickets USING hash(qr_code) WHERE status = 'active';
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tickets_holder_phone 
      ON tickets(holder_phone) WHERE holder_phone IS NOT NULL;
    
    -- Payments table optimizations
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_status_method_datetime 
      ON payments(status, payment_method, initiated_at);
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_user_completed 
      ON payments(user_id, completed_at DESC) WHERE status = 'completed';
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_reference_hash 
      ON payments USING hash(payment_reference);
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_external_reference 
      ON payments(external_reference) WHERE external_reference IS NOT NULL;
    
    -- Users table optimizations
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_status 
      ON users(email, status) WHERE status = 'active';
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_phone_verified 
      ON users(phone) WHERE phone_verified = true;
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login 
      ON users(last_login DESC) WHERE status = 'active';
    
    -- Wallet transactions optimizations
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallet_transactions_wallet_datetime 
      ON wallet_transactions(wallet_id, initiated_at DESC);
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallet_transactions_type_status 
      ON wallet_transactions(type, status, initiated_at DESC);
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallet_transactions_payment_id 
      ON wallet_transactions(payment_id) WHERE payment_id IS NOT NULL;
    
    -- Composite indexes for complex queries
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_complex_search 
      ON events(sport, start_datetime, venue_id, status) 
      WHERE status = 'published' AND tickets_available = true;
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tickets_scanner_lookup 
      ON tickets(qr_code, status, event_id) WHERE status = 'active';
    
    -- Partial indexes for better performance
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_pending 
      ON payments(initiated_at, payment_method) WHERE status = 'pending';
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tickets_available 
      ON tickets(event_id, ticket_type, price) WHERE status = 'available';
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.raw(`
    -- Drop performance indexes
    DROP INDEX CONCURRENTLY IF EXISTS idx_events_start_datetime_status;
    DROP INDEX CONCURRENTLY IF EXISTS idx_events_venue_datetime;
    DROP INDEX CONCURRENTLY IF EXISTS idx_events_tickets_available;
    DROP INDEX CONCURRENTLY IF EXISTS idx_events_sport_datetime;
    DROP INDEX CONCURRENTLY IF EXISTS idx_tickets_event_status_type;
    DROP INDEX CONCURRENTLY IF EXISTS idx_tickets_user_purchased_at;
    DROP INDEX CONCURRENTLY IF EXISTS idx_tickets_qr_code_hash;
    DROP INDEX CONCURRENTLY IF EXISTS idx_tickets_holder_phone;
    DROP INDEX CONCURRENTLY IF EXISTS idx_payments_status_method_datetime;
    DROP INDEX CONCURRENTLY IF EXISTS idx_payments_user_completed;
    DROP INDEX CONCURRENTLY IF EXISTS idx_payments_reference_hash;
    DROP INDEX CONCURRENTLY IF EXISTS idx_payments_external_reference;
    DROP INDEX CONCURRENTLY IF EXISTS idx_users_email_status;
    DROP INDEX CONCURRENTLY IF EXISTS idx_users_phone_verified;
    DROP INDEX CONCURRENTLY IF EXISTS idx_users_last_login;
    DROP INDEX CONCURRENTLY IF EXISTS idx_wallet_transactions_wallet_datetime;
    DROP INDEX CONCURRENTLY IF EXISTS idx_wallet_transactions_type_status;
    DROP INDEX CONCURRENTLY IF EXISTS idx_wallet_transactions_payment_id;
    DROP INDEX CONCURRENTLY IF EXISTS idx_events_complex_search;
    DROP INDEX CONCURRENTLY IF EXISTS idx_tickets_scanner_lookup;
    DROP INDEX CONCURRENTLY IF EXISTS idx_payments_pending;
    DROP INDEX CONCURRENTLY IF EXISTS idx_tickets_available;
  `);
};
