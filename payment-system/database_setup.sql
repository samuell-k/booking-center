-- Payment System Database Schema
-- This script creates the necessary tables for the payment dashboard

CREATE DATABASE IF NOT EXISTS payment_system;
USE payment_system;

-- Transactions table to store all payment and withdrawal information
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_transaction_id VARCHAR(50) UNIQUE NOT NULL,
    intouchpay_transaction_id VARCHAR(100) DEFAULT NULL,
    phone_number VARCHAR(12) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_type ENUM('payment', 'withdrawal') DEFAULT 'payment',
    status ENUM('pending', 'successful', 'successfull', 'failed', 'failure', 'timeout') DEFAULT 'pending',
    response_code VARCHAR(10) DEFAULT NULL,
    status_desc TEXT DEFAULT NULL,
    reference_no VARCHAR(100) DEFAULT NULL,
    reason TEXT DEFAULT NULL, -- For withdrawal reasons
    withdraw_charge DECIMAL(10,2) DEFAULT 0.00, -- Withdrawal charges
    user_name VARCHAR(100) DEFAULT NULL,
    user_email VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL DEFAULT NULL,

    -- Indexes for better performance
    INDEX idx_status (status),
    INDEX idx_phone (phone_number),
    INDEX idx_created_at (created_at),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_request_transaction_id (request_transaction_id),
    INDEX idx_intouchpay_transaction_id (intouchpay_transaction_id)
);

-- Transaction statistics table for dashboard analytics (payments and withdrawals)
CREATE TABLE IF NOT EXISTS transaction_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    transaction_type ENUM('payment', 'withdrawal') NOT NULL,
    total_transactions INT DEFAULT 0,
    successful_transactions INT DEFAULT 0,
    failed_transactions INT DEFAULT 0,
    pending_transactions INT DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0.00,
    successful_amount DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_date_type (stat_date, transaction_type),
    INDEX idx_stat_date (stat_date),
    INDEX idx_transaction_type (transaction_type)
);

-- Keep the old payment_stats table for backward compatibility
CREATE TABLE IF NOT EXISTS payment_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    total_transactions INT DEFAULT 0,
    successful_transactions INT DEFAULT 0,
    failed_transactions INT DEFAULT 0,
    pending_transactions INT DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0.00,
    successful_amount DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_date (stat_date),
    INDEX idx_stat_date (stat_date)
);

-- Users table for tracking payment users (optional)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(12) UNIQUE NOT NULL,
    name VARCHAR(100) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    total_payments INT DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0.00,
    last_payment_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_phone (phone_number),
    INDEX idx_last_payment (last_payment_at)
);

-- Insert some sample data for testing (optional)
INSERT INTO transactions (
    request_transaction_id,
    intouchpay_transaction_id,
    phone_number,
    amount,
    transaction_type,
    status,
    response_code,
    user_name,
    reason,
    created_at,
    completed_at
) VALUES
-- Payment transactions
('TXN1001', 'ITP1001', '250781234567', 1000.00, 'payment', 'successful', '01', 'John Doe', NULL, '2025-06-28 08:00:00', '2025-06-28 08:02:00'),
('TXN1002', 'ITP1002', '250782345678', 2500.00, 'payment', 'successful', '01', 'Jane Smith', NULL, '2025-06-28 09:15:00', '2025-06-28 09:17:00'),
('TXN1003', 'ITP1003', '250783456789', 500.00, 'payment', 'failed', '1005', 'Bob Johnson', NULL, '2025-06-28 10:30:00', '2025-06-28 10:32:00'),
('TXN1004', NULL, '250784567890', 750.00, 'payment', 'pending', '1000', 'Alice Brown', NULL, '2025-06-28 11:45:00', NULL),
('TXN1005', 'ITP1005', '250785678901', 3000.00, 'payment', 'successful', '01', 'Charlie Wilson', NULL, '2025-06-28 12:00:00', '2025-06-28 12:03:00'),
('TXN1006', 'ITP1006', '250786789012', 1200.00, 'payment', 'failed', '1002', 'Diana Davis', NULL, '2025-06-28 13:20:00', '2025-06-28 13:22:00'),
('TXN1007', NULL, '250787890123', 800.00, 'payment', 'pending', '1000', 'Edward Miller', NULL, '2025-06-28 14:10:00', NULL),
('TXN1008', 'ITP1008', '250788901234', 1800.00, 'payment', 'successful', '01', 'Fiona Garcia', NULL, '2025-06-28 15:30:00', '2025-06-28 15:33:00'),
-- Withdrawal transactions
('WTH1001', 'ITP2001', '250781234567', 500.00, 'withdrawal', 'successful', '2001', 'John Doe', 'Emergency funds', '2025-06-28 16:00:00', '2025-06-28 16:02:00'),
('WTH1002', 'ITP2002', '250782345678', 1000.00, 'withdrawal', 'successful', '2001', 'Jane Smith', 'Personal expenses', '2025-06-28 17:15:00', '2025-06-28 17:17:00'),
('WTH1003', NULL, '250783456789', 300.00, 'withdrawal', 'pending', '1000', 'Bob Johnson', 'Medical expenses', '2025-06-28 18:30:00', NULL),
('WTH1004', 'ITP2004', '250785678901', 750.00, 'withdrawal', 'failed', '1108', 'Charlie Wilson', 'School fees', '2025-06-28 19:00:00', '2025-06-28 19:02:00');

-- Update users table with sample data
INSERT INTO users (phone_number, name, total_payments, total_amount, last_payment_at) VALUES
('250781234567', 'John Doe', 1, 1000.00, '2025-06-28 08:02:00'),
('250782345678', 'Jane Smith', 1, 2500.00, '2025-06-28 09:17:00'),
('250783456789', 'Bob Johnson', 1, 500.00, '2025-06-28 10:32:00'),
('250784567890', 'Alice Brown', 1, 750.00, '2025-06-28 11:45:00'),
('250785678901', 'Charlie Wilson', 1, 3000.00, '2025-06-28 12:03:00'),
('250786789012', 'Diana Davis', 1, 1200.00, '2025-06-28 13:22:00'),
('250787890123', 'Edward Miller', 1, 800.00, '2025-06-28 14:10:00'),
('250788901234', 'Fiona Garcia', 1, 1800.00, '2025-06-28 15:33:00');

-- Create a view for dashboard summary (all transactions)
CREATE VIEW dashboard_summary AS
SELECT
    COUNT(*) as total_transactions,
    SUM(CASE WHEN status IN ('successful', 'successfull') THEN 1 ELSE 0 END) as successful_transactions,
    SUM(CASE WHEN status IN ('failed', 'failure') THEN 1 ELSE 0 END) as failed_transactions,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_transactions,
    SUM(amount) as total_amount,
    SUM(CASE WHEN status IN ('successful', 'successfull') THEN amount ELSE 0 END) as successful_amount,
    AVG(amount) as average_amount,
    DATE(MAX(created_at)) as last_transaction_date,
    -- Payment specific stats
    SUM(CASE WHEN transaction_type = 'payment' THEN 1 ELSE 0 END) as total_payments,
    SUM(CASE WHEN transaction_type = 'payment' AND status IN ('successful', 'successfull') THEN 1 ELSE 0 END) as successful_payments,
    SUM(CASE WHEN transaction_type = 'payment' AND status = 'pending' THEN 1 ELSE 0 END) as pending_payments,
    SUM(CASE WHEN transaction_type = 'payment' THEN amount ELSE 0 END) as total_payment_amount,
    -- Withdrawal specific stats
    SUM(CASE WHEN transaction_type = 'withdrawal' THEN 1 ELSE 0 END) as total_withdrawals,
    SUM(CASE WHEN transaction_type = 'withdrawal' AND status IN ('successful', 'successfull') THEN 1 ELSE 0 END) as successful_withdrawals,
    SUM(CASE WHEN transaction_type = 'withdrawal' AND status = 'pending' THEN 1 ELSE 0 END) as pending_withdrawals,
    SUM(CASE WHEN transaction_type = 'withdrawal' THEN amount ELSE 0 END) as total_withdrawal_amount
FROM transactions;

-- Create a view for payment summary (backward compatibility)
CREATE VIEW payment_summary AS
SELECT
    COUNT(*) as total_transactions,
    SUM(CASE WHEN status IN ('successful', 'successfull') THEN 1 ELSE 0 END) as successful_transactions,
    SUM(CASE WHEN status IN ('failed', 'failure') THEN 1 ELSE 0 END) as failed_transactions,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_transactions,
    SUM(amount) as total_amount,
    SUM(CASE WHEN status IN ('successful', 'successfull') THEN amount ELSE 0 END) as successful_amount,
    AVG(amount) as average_amount,
    DATE(MAX(created_at)) as last_transaction_date
FROM transactions
WHERE transaction_type = 'payment';

-- Create a view for withdrawal summary
CREATE VIEW withdrawal_summary AS
SELECT
    COUNT(*) as total_transactions,
    SUM(CASE WHEN status IN ('successful', 'successfull') THEN 1 ELSE 0 END) as successful_transactions,
    SUM(CASE WHEN status IN ('failed', 'failure') THEN 1 ELSE 0 END) as failed_transactions,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_transactions,
    SUM(amount) as total_amount,
    SUM(CASE WHEN status IN ('successful', 'successfull') THEN amount ELSE 0 END) as successful_amount,
    AVG(amount) as average_amount,
    DATE(MAX(created_at)) as last_transaction_date
FROM transactions
WHERE transaction_type = 'withdrawal';

-- Create a view for recent transactions (all types)
CREATE VIEW recent_transactions AS
SELECT
    id,
    request_transaction_id,
    intouchpay_transaction_id,
    phone_number,
    amount,
    transaction_type,
    status,
    user_name,
    reason,
    withdraw_charge,
    created_at,
    completed_at,
    CASE
        WHEN status IN ('successful', 'successfull') THEN 'success'
        WHEN status IN ('failed', 'failure') THEN 'danger'
        WHEN status = 'pending' THEN 'warning'
        ELSE 'secondary'
    END as status_class,
    CASE
        WHEN transaction_type = 'payment' THEN 'fas fa-arrow-down text-success'
        WHEN transaction_type = 'withdrawal' THEN 'fas fa-arrow-up text-primary'
        ELSE 'fas fa-exchange-alt'
    END as type_icon
FROM transactions
ORDER BY created_at DESC;
