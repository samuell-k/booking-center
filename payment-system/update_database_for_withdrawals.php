<?php
/**
 * Database Update Script for Withdrawal Functionality
 * This script updates the existing database to support withdrawal transactions
 */

require_once 'config.php';

echo "<h1>Database Update for Withdrawal Functionality</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; }
    .error { color: red; }
    .warning { color: orange; }
    .info { color: blue; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 3px; }
</style>";

try {
    $dbService = DatabaseService::getInstance();
    
    echo "<h2>Updating Database Schema...</h2>";
    
    // Check if transaction_type column exists
    $columns = $dbService->query("DESCRIBE transactions");
    $hasTransactionType = false;
    $hasReason = false;
    $hasWithdrawCharge = false;
    
    foreach ($columns as $column) {
        if ($column['Field'] === 'transaction_type') $hasTransactionType = true;
        if ($column['Field'] === 'reason') $hasReason = true;
        if ($column['Field'] === 'withdraw_charge') $hasWithdrawCharge = true;
    }
    
    // Add missing columns
    if (!$hasTransactionType) {
        echo "<p class='info'>Adding transaction_type column...</p>";
        $dbService->execute("ALTER TABLE transactions ADD COLUMN transaction_type ENUM('payment', 'withdrawal') DEFAULT 'payment' AFTER amount");
        echo "<p class='success'>✓ transaction_type column added</p>";
    } else {
        echo "<p class='success'>✓ transaction_type column already exists</p>";
    }
    
    if (!$hasReason) {
        echo "<p class='info'>Adding reason column...</p>";
        $dbService->execute("ALTER TABLE transactions ADD COLUMN reason TEXT DEFAULT NULL AFTER reference_no");
        echo "<p class='success'>✓ reason column added</p>";
    } else {
        echo "<p class='success'>✓ reason column already exists</p>";
    }
    
    if (!$hasWithdrawCharge) {
        echo "<p class='info'>Adding withdraw_charge column...</p>";
        $dbService->execute("ALTER TABLE transactions ADD COLUMN withdraw_charge DECIMAL(10,2) DEFAULT 0.00 AFTER reason");
        echo "<p class='success'>✓ withdraw_charge column added</p>";
    } else {
        echo "<p class='success'>✓ withdraw_charge column already exists</p>";
    }
    
    // Add index for transaction_type
    echo "<p class='info'>Adding index for transaction_type...</p>";
    try {
        $dbService->execute("ALTER TABLE transactions ADD INDEX idx_transaction_type (transaction_type)");
        echo "<p class='success'>✓ transaction_type index added</p>";
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate key name') !== false) {
            echo "<p class='success'>✓ transaction_type index already exists</p>";
        } else {
            echo "<p class='error'>Error adding transaction_type index: " . $e->getMessage() . "</p>";
        }
    }
    
    // Create withdrawal_summary view
    echo "<p class='info'>Creating withdrawal_summary view...</p>";
    try {
        $dbService->execute("DROP VIEW IF EXISTS withdrawal_summary");
        $dbService->execute("
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
            WHERE transaction_type = 'withdrawal'
        ");
        echo "<p class='success'>✓ withdrawal_summary view created</p>";
    } catch (Exception $e) {
        echo "<p class='error'>Error creating withdrawal_summary view: " . $e->getMessage() . "</p>";
    }
    
    // Create payment_summary view
    echo "<p class='info'>Creating payment_summary view...</p>";
    try {
        $dbService->execute("DROP VIEW IF EXISTS payment_summary");
        $dbService->execute("
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
            WHERE transaction_type = 'payment'
        ");
        echo "<p class='success'>✓ payment_summary view created</p>";
    } catch (Exception $e) {
        echo "<p class='error'>Error creating payment_summary view: " . $e->getMessage() . "</p>";
    }
    
    // Update dashboard_summary view
    echo "<p class='info'>Updating dashboard_summary view...</p>";
    try {
        $dbService->execute("DROP VIEW IF EXISTS dashboard_summary");
        $dbService->execute("
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
            FROM transactions
        ");
        echo "<p class='success'>✓ dashboard_summary view updated</p>";
    } catch (Exception $e) {
        echo "<p class='error'>Error updating dashboard_summary view: " . $e->getMessage() . "</p>";
    }
    
    // Update recent_transactions view
    echo "<p class='info'>Updating recent_transactions view...</p>";
    try {
        $dbService->execute("DROP VIEW IF EXISTS recent_transactions");
        $dbService->execute("
            CREATE VIEW recent_transactions AS
            SELECT 
                id,
                request_transaction_id,
                intouchpay_transaction_id,
                phone_number,
                amount,
                transaction_type,
                status,
                reason,
                withdraw_charge,
                user_name,
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
            ORDER BY created_at DESC
        ");
        echo "<p class='success'>✓ recent_transactions view updated</p>";
    } catch (Exception $e) {
        echo "<p class='error'>Error updating recent_transactions view: " . $e->getMessage() . "</p>";
    }
    
    // Update existing payment transactions to have correct transaction_type
    echo "<p class='info'>Updating existing payment transactions...</p>";
    $updated = $dbService->execute("UPDATE transactions SET transaction_type = 'payment' WHERE transaction_type IS NULL OR transaction_type = ''");
    echo "<p class='success'>✓ Existing transactions updated</p>";
    
    // Insert sample withdrawal data
    echo "<p class='info'>Inserting sample withdrawal data...</p>";
    try {
        $sampleWithdrawals = [
            [
                'request_transaction_id' => 'WTH' . time() . '001',
                'phone_number' => '250781234567',
                'amount' => 500.00,
                'transaction_type' => 'withdrawal',
                'status' => 'successful',
                'response_code' => '2001',
                'reason' => 'Emergency funds',
                'user_name' => 'John Doe'
            ],
            [
                'request_transaction_id' => 'WTH' . time() . '002',
                'phone_number' => '250782345678',
                'amount' => 1000.00,
                'transaction_type' => 'withdrawal',
                'status' => 'pending',
                'response_code' => '1000',
                'reason' => 'Personal expenses',
                'user_name' => 'Jane Smith'
            ]
        ];
        
        foreach ($sampleWithdrawals as $withdrawal) {
            $dbService->execute("
                INSERT INTO transactions (
                    request_transaction_id, phone_number, amount, transaction_type, 
                    status, response_code, reason, user_name
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ", [
                $withdrawal['request_transaction_id'],
                $withdrawal['phone_number'],
                $withdrawal['amount'],
                $withdrawal['transaction_type'],
                $withdrawal['status'],
                $withdrawal['response_code'],
                $withdrawal['reason'],
                $withdrawal['user_name']
            ]);
        }
        echo "<p class='success'>✓ Sample withdrawal data inserted</p>";
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            echo "<p class='warning'>⚠ Sample data already exists</p>";
        } else {
            echo "<p class='error'>Error inserting sample data: " . $e->getMessage() . "</p>";
        }
    }
    
    echo "<h2>Database Update Complete!</h2>";
    echo "<p class='success'>✓ All database updates have been applied successfully.</p>";
    echo "<p class='info'>You can now use the withdrawal functionality:</p>";
    echo "<ul>";
    echo "<li><a href='withdrawal.html'>Withdrawal Form</a></li>";
    echo "<li><a href='dashboard.html'>Updated Dashboard</a></li>";
    echo "<li><a href='test_withdrawal_system.php'>Test Withdrawal System</a></li>";
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<p class='error'>Database update failed: " . $e->getMessage() . "</p>";
}

?>
