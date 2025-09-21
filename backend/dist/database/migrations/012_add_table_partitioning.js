/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.raw(`
    -- Create partitioned tables for high-volume data
    
    -- 1. Partition tickets table by event_id (hash partitioning)
    -- This helps distribute tickets across multiple partitions for better performance
    CREATE TABLE IF NOT EXISTS tickets_partitioned (
      LIKE tickets INCLUDING ALL
    ) PARTITION BY HASH (event_id);
    
    -- Create 16 partitions for tickets (can be adjusted based on load)
    CREATE TABLE IF NOT EXISTS tickets_p0 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 0);
    CREATE TABLE IF NOT EXISTS tickets_p1 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 1);
    CREATE TABLE IF NOT EXISTS tickets_p2 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 2);
    CREATE TABLE IF NOT EXISTS tickets_p3 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 3);
    CREATE TABLE IF NOT EXISTS tickets_p4 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 4);
    CREATE TABLE IF NOT EXISTS tickets_p5 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 5);
    CREATE TABLE IF NOT EXISTS tickets_p6 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 6);
    CREATE TABLE IF NOT EXISTS tickets_p7 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 7);
    CREATE TABLE IF NOT EXISTS tickets_p8 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 8);
    CREATE TABLE IF NOT EXISTS tickets_p9 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 9);
    CREATE TABLE IF NOT EXISTS tickets_p10 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 10);
    CREATE TABLE IF NOT EXISTS tickets_p11 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 11);
    CREATE TABLE IF NOT EXISTS tickets_p12 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 12);
    CREATE TABLE IF NOT EXISTS tickets_p13 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 13);
    CREATE TABLE IF NOT EXISTS tickets_p14 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 14);
    CREATE TABLE IF NOT EXISTS tickets_p15 PARTITION OF tickets_partitioned FOR VALUES WITH (modulus 16, remainder 15);
    
    -- 2. Partition payments table by date (range partitioning)
    -- This helps with time-based queries and archiving
    CREATE TABLE IF NOT EXISTS payments_partitioned (
      LIKE payments INCLUDING ALL
    ) PARTITION BY RANGE (initiated_at);
    
    -- Create monthly partitions for the current year and next year
    -- In production, you'd want to automate partition creation
    CREATE TABLE IF NOT EXISTS payments_2024_01 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
    CREATE TABLE IF NOT EXISTS payments_2024_02 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
    CREATE TABLE IF NOT EXISTS payments_2024_03 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
    CREATE TABLE IF NOT EXISTS payments_2024_04 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
    CREATE TABLE IF NOT EXISTS payments_2024_05 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
    CREATE TABLE IF NOT EXISTS payments_2024_06 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
    CREATE TABLE IF NOT EXISTS payments_2024_07 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');
    CREATE TABLE IF NOT EXISTS payments_2024_08 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');
    CREATE TABLE IF NOT EXISTS payments_2024_09 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');
    CREATE TABLE IF NOT EXISTS payments_2024_10 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
    CREATE TABLE IF NOT EXISTS payments_2024_11 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
    CREATE TABLE IF NOT EXISTS payments_2024_12 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
    
    -- 2025 partitions
    CREATE TABLE IF NOT EXISTS payments_2025_01 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
    CREATE TABLE IF NOT EXISTS payments_2025_02 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
    CREATE TABLE IF NOT EXISTS payments_2025_03 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
    CREATE TABLE IF NOT EXISTS payments_2025_04 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
    CREATE TABLE IF NOT EXISTS payments_2025_05 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');
    CREATE TABLE IF NOT EXISTS payments_2025_06 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');
    CREATE TABLE IF NOT EXISTS payments_2025_07 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');
    CREATE TABLE IF NOT EXISTS payments_2025_08 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');
    CREATE TABLE IF NOT EXISTS payments_2025_09 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');
    CREATE TABLE IF NOT EXISTS payments_2025_10 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
    CREATE TABLE IF NOT EXISTS payments_2025_11 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
    CREATE TABLE IF NOT EXISTS payments_2025_12 PARTITION OF payments_partitioned 
      FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');
    
    -- 3. Partition wallet_transactions by date
    CREATE TABLE IF NOT EXISTS wallet_transactions_partitioned (
      LIKE wallet_transactions INCLUDING ALL
    ) PARTITION BY RANGE (initiated_at);
    
    -- Create monthly partitions for wallet transactions
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_01 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_02 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_03 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_04 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_05 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_06 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_07 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_08 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_09 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_10 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_11 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
    CREATE TABLE IF NOT EXISTS wallet_transactions_2024_12 PARTITION OF wallet_transactions_partitioned 
      FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
  `);
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.raw(`
    -- Drop partitioned tables
    DROP TABLE IF EXISTS tickets_partitioned CASCADE;
    DROP TABLE IF EXISTS payments_partitioned CASCADE;
    DROP TABLE IF EXISTS wallet_transactions_partitioned CASCADE;
  `);
};
//# sourceMappingURL=012_add_table_partitioning.js.map