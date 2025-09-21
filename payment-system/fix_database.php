<?php
require_once 'config.php';

echo "<h1>Database Fix Script</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; }
    .error { color: red; }
    .info { color: blue; }
</style>";

try {
    $dbService = DatabaseService::getInstance();
    
    echo "<h2>Checking and Fixing Database Structure...</h2>";
    
    // Check if transaction_type column exists
    $columns = $dbService->query('DESCRIBE transactions');
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
    
    // Update existing transactions to have correct transaction_type
    echo "<p class='info'>Updating existing transactions...</p>";
    $dbService->execute("UPDATE transactions SET transaction_type = 'payment' WHERE transaction_type IS NULL OR transaction_type = ''");
    echo "<p class='success'>✓ Existing transactions updated</p>";
    
    echo "<h2>Database Fix Complete!</h2>";
    echo "<p class='success'>Your database is now ready for the dashboard.</p>";
    echo "<p><a href='dashboard.html'>Go to Dashboard</a></p>";
    
} catch (Exception $e) {
    echo "<p class='error'>Error: " . $e->getMessage() . "</p>";
}
?>
