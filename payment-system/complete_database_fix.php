<?php
require_once 'config.php';

echo "<h1>Complete Database Fix</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; }
    .error { color: red; }
    .info { color: blue; }
    .warning { color: orange; }
</style>";

try {
    // Direct PDO connection for more control
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    echo "<h2>Adding Missing Columns...</h2>";
    
    // Get current columns
    $stmt = $pdo->query("DESCRIBE transactions");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $existingColumns = array_column($columns, 'Field');
    
    echo "<p class='info'>Current columns: " . implode(', ', $existingColumns) . "</p>";
    
    // Add missing columns one by one
    $columnsToAdd = [
        'transaction_type' => "ENUM('payment', 'withdrawal') DEFAULT 'payment' AFTER amount",
        'reason' => "TEXT DEFAULT NULL AFTER reference_no",
        'withdraw_charge' => "DECIMAL(10,2) DEFAULT 0.00 AFTER reason",
        'user_name' => "VARCHAR(100) DEFAULT NULL AFTER withdraw_charge",
        'user_email' => "VARCHAR(100) DEFAULT NULL AFTER user_name"
    ];
    
    foreach ($columnsToAdd as $columnName => $columnDefinition) {
        if (!in_array($columnName, $existingColumns)) {
            echo "<p class='info'>Adding column: $columnName</p>";
            try {
                $pdo->exec("ALTER TABLE transactions ADD COLUMN $columnName $columnDefinition");
                echo "<p class='success'>✓ Column $columnName added successfully</p>";
            } catch (Exception $e) {
                echo "<p class='error'>Failed to add column $columnName: " . $e->getMessage() . "</p>";
            }
        } else {
            echo "<p class='success'>✓ Column $columnName already exists</p>";
        }
    }
    
    // Update existing records
    echo "<h2>Updating Existing Records...</h2>";
    try {
        $pdo->exec("UPDATE transactions SET transaction_type = 'payment' WHERE transaction_type IS NULL OR transaction_type = ''");
        echo "<p class='success'>✓ Updated transaction_type for existing records</p>";
    } catch (Exception $e) {
        echo "<p class='warning'>Note: " . $e->getMessage() . "</p>";
    }
    
    // Test the API endpoints
    echo "<h2>Testing API Endpoints...</h2>";
    
    // Test summary endpoint
    $summaryUrl = 'http://localhost/payment-system/dashboard_api.php?endpoint=summary';
    $summaryResponse = @file_get_contents($summaryUrl);
    if ($summaryResponse) {
        $summaryData = json_decode($summaryResponse, true);
        if ($summaryData && $summaryData['success']) {
            echo "<p class='success'>✓ Summary endpoint working</p>";
        } else {
            echo "<p class='error'>✗ Summary endpoint error: " . ($summaryData['message'] ?? 'Unknown error') . "</p>";
        }
    } else {
        echo "<p class='error'>✗ Could not reach summary endpoint</p>";
    }
    
    // Test transactions endpoint
    $transactionsUrl = 'http://localhost/payment-system/dashboard_api.php?endpoint=transactions';
    $transactionsResponse = @file_get_contents($transactionsUrl);
    if ($transactionsResponse) {
        $transactionsData = json_decode($transactionsResponse, true);
        if ($transactionsData && $transactionsData['success']) {
            echo "<p class='success'>✓ Transactions endpoint working</p>";
        } else {
            echo "<p class='error'>✗ Transactions endpoint error: " . ($transactionsData['message'] ?? 'Unknown error') . "</p>";
        }
    } else {
        echo "<p class='error'>✗ Could not reach transactions endpoint</p>";
    }
    
    echo "<h2>Database Fix Complete!</h2>";
    echo "<p class='success'>Your database should now be ready for the dashboard.</p>";
    echo "<p><a href='dashboard.html' target='_blank'>Test Dashboard</a></p>";
    
} catch (Exception $e) {
    echo "<p class='error'>Error: " . $e->getMessage() . "</p>";
}
?>
