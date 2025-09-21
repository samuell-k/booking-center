-- PostgreSQL optimization settings for high-scale ticketing system
-- Run these commands as a superuser to optimize for 10M+ concurrent users

-- ============================================================================
-- CONNECTION AND MEMORY SETTINGS
-- ============================================================================

-- Increase connection limits (adjust based on your server capacity)
ALTER SYSTEM SET max_connections = 1000;
ALTER SYSTEM SET superuser_reserved_connections = 10;

-- Shared memory settings (adjust based on available RAM)
-- For a server with 32GB RAM, allocate ~8GB to shared_buffers
ALTER SYSTEM SET shared_buffers = '8GB';
ALTER SYSTEM SET effective_cache_size = '24GB';
ALTER SYSTEM SET maintenance_work_mem = '1GB';
ALTER SYSTEM SET work_mem = '256MB';

-- ============================================================================
-- WRITE-AHEAD LOGGING (WAL) OPTIMIZATION
-- ============================================================================

-- Optimize WAL for high write throughput
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET max_wal_size = '4GB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET wal_buffers = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET checkpoint_timeout = '15min';

-- Enable WAL compression
ALTER SYSTEM SET wal_compression = on;

-- ============================================================================
-- QUERY OPTIMIZATION
-- ============================================================================

-- Enable parallel query execution
ALTER SYSTEM SET max_parallel_workers = 16;
ALTER SYSTEM SET max_parallel_workers_per_gather = 4;
ALTER SYSTEM SET parallel_tuple_cost = 0.1;
ALTER SYSTEM SET parallel_setup_cost = 1000.0;

-- Query planner settings
ALTER SYSTEM SET random_page_cost = 1.1; -- For SSD storage
ALTER SYSTEM SET seq_page_cost = 1.0;
ALTER SYSTEM SET cpu_tuple_cost = 0.01;
ALTER SYSTEM SET cpu_index_tuple_cost = 0.005;
ALTER SYSTEM SET cpu_operator_cost = 0.0025;

-- Enable JIT compilation for complex queries
ALTER SYSTEM SET jit = on;
ALTER SYSTEM SET jit_above_cost = 100000;
ALTER SYSTEM SET jit_inline_above_cost = 500000;
ALTER SYSTEM SET jit_optimize_above_cost = 500000;

-- ============================================================================
-- BACKGROUND PROCESSES
-- ============================================================================

-- Autovacuum optimization for high-traffic tables
ALTER SYSTEM SET autovacuum_max_workers = 6;
ALTER SYSTEM SET autovacuum_naptime = '30s';
ALTER SYSTEM SET autovacuum_vacuum_threshold = 50;
ALTER SYSTEM SET autovacuum_analyze_threshold = 50;
ALTER SYSTEM SET autovacuum_vacuum_scale_factor = 0.1;
ALTER SYSTEM SET autovacuum_analyze_scale_factor = 0.05;

-- Background writer optimization
ALTER SYSTEM SET bgwriter_delay = '50ms';
ALTER SYSTEM SET bgwriter_lru_maxpages = 1000;
ALTER SYSTEM SET bgwriter_lru_multiplier = 10.0;

-- ============================================================================
-- LOGGING AND MONITORING
-- ============================================================================

-- Enable query logging for slow queries
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1 second
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
ALTER SYSTEM SET log_lock_waits = on;
ALTER SYSTEM SET log_temp_files = 10MB;

-- Enable detailed statistics
ALTER SYSTEM SET track_activities = on;
ALTER SYSTEM SET track_counts = on;
ALTER SYSTEM SET track_io_timing = on;
ALTER SYSTEM SET track_functions = 'all';

-- ============================================================================
-- NETWORK AND TIMEOUT SETTINGS
-- ============================================================================

-- Network optimization
ALTER SYSTEM SET tcp_keepalives_idle = 600;
ALTER SYSTEM SET tcp_keepalives_interval = 30;
ALTER SYSTEM SET tcp_keepalives_count = 3;

-- Statement timeout for preventing long-running queries
ALTER SYSTEM SET statement_timeout = '30s';
ALTER SYSTEM SET idle_in_transaction_session_timeout = '60s';

-- ============================================================================
-- RELOAD CONFIGURATION
-- ============================================================================

-- Reload the configuration (requires restart for some settings)
SELECT pg_reload_conf();

-- ============================================================================
-- TABLE-SPECIFIC OPTIMIZATIONS
-- ============================================================================

-- Set autovacuum parameters for high-traffic tables
ALTER TABLE tickets SET (
  autovacuum_vacuum_threshold = 100,
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_threshold = 100,
  autovacuum_analyze_scale_factor = 0.02
);

ALTER TABLE payments SET (
  autovacuum_vacuum_threshold = 100,
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_threshold = 100,
  autovacuum_analyze_scale_factor = 0.02
);

ALTER TABLE events SET (
  autovacuum_vacuum_threshold = 50,
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_threshold = 50,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE wallet_transactions SET (
  autovacuum_vacuum_threshold = 200,
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_threshold = 200,
  autovacuum_analyze_scale_factor = 0.02
);

-- ============================================================================
-- STATISTICS TARGETS
-- ============================================================================

-- Increase statistics targets for frequently queried columns
ALTER TABLE events ALTER COLUMN start_datetime SET STATISTICS 1000;
ALTER TABLE events ALTER COLUMN sport SET STATISTICS 1000;
ALTER TABLE events ALTER COLUMN venue_id SET STATISTICS 1000;
ALTER TABLE events ALTER COLUMN status SET STATISTICS 1000;

ALTER TABLE tickets ALTER COLUMN event_id SET STATISTICS 1000;
ALTER TABLE tickets ALTER COLUMN status SET STATISTICS 1000;
ALTER TABLE tickets ALTER COLUMN ticket_type SET STATISTICS 1000;

ALTER TABLE payments ALTER COLUMN status SET STATISTICS 1000;
ALTER TABLE payments ALTER COLUMN payment_method SET STATISTICS 1000;
ALTER TABLE payments ALTER COLUMN user_id SET STATISTICS 1000;

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_buffercache;
CREATE EXTENSION IF NOT EXISTS pgstattuple;

-- ============================================================================
-- MAINTENANCE COMMANDS
-- ============================================================================

-- Run these periodically or set up as cron jobs

-- Update table statistics
-- ANALYZE;

-- Reindex tables periodically (during maintenance windows)
-- REINDEX TABLE CONCURRENTLY tickets;
-- REINDEX TABLE CONCURRENTLY payments;
-- REINDEX TABLE CONCURRENTLY events;

-- Vacuum full for heavily updated tables (during maintenance windows)
-- VACUUM FULL tickets;
-- VACUUM FULL payments;
