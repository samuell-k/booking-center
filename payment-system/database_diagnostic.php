<?php
require_once 'config.php';

echo "<h1>Database Diagnostic</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; }
    .error { color: red; }
    .info { color: blue; }
    .warning { color: orange; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
</style>";

try {
    echo "<h2>Database Connection Test</h2>";
    
    // Test basic connection
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "<p class='success'>✓ Database connection successful</p>";
    echo "<p class='info'>Connected to database: " . DB_NAME . " on " . DB_HOST . "</p>";
    
    // Check if transactions table exists
    echo "<h2>Table Check</h2>";
    $stmt = $pdo->query("SHOW TABLES LIKE 'transactions'");
    $tableExists = $stmt->rowCount() > 0;
    
    if ($tableExists) {
        echo "<p class='success'>✓ Transactions table exists</p>";
        
        // Show current structure
        echo "<h3>Current Table Structure:</h3>";
        $stmt = $pdo->query("DESCRIBE transactions");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<table>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
        
        $hasTransactionType = false;
        foreach ($columns as $column) {
            echo "<tr>";
            echo "<td>" . $column['Field'] . "</td>";
            echo "<td>" . $column['Type'] . "</td>";
            echo "<td>" . $column['Null'] . "</td>";
            echo "<td>" . $column['Key'] . "</td>";
            echo "<td>" . ($column['Default'] ?? 'NULL') . "</td>";
            echo "<td>" . $column['Extra'] . "</td>";
            echo "</tr>";
            
            if ($column['Field'] === 'transaction_type') {
                $hasTransactionType = true;
            }
        }
        echo "</table>";
        
        echo "<h3>Column Status:</h3>";
        if ($hasTransactionType) {
            echo "<p class='success'>✓ transaction_type column exists</p>";
        } else {
            echo "<p class='error'>✗ transaction_type column is missing</p>";
            
            // Try to add it
            echo "<h3>Attempting to Add Missing Column:</h3>";
            try {
                $pdo->exec("ALTER TABLE transactions ADD COLUMN transaction_type ENUM('payment', 'withdrawal') DEFAULT 'payment' AFTER amount");
                echo "<p class='success'>✓ transaction_type column added successfully</p>";
                
                // Update existing records
                $pdo->exec("UPDATE transactions SET transaction_type = 'payment' WHERE transaction_type IS NULL");
                echo "<p class='success'>✓ Existing records updated</p>";
                
            } catch (Exception $e) {
                echo "<p class='error'>Failed to add column: " . $e->getMessage() . "</p>";
            }
        }
        
        // Test a simple query
        echo "<h3>Query Test:</h3>";
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM transactions");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "<p class='success'>✓ Query successful - Found " . $result['count'] . " transactions</p>";
        } catch (Exception $e) {
            echo "<p class='error'>Query failed: " . $e->getMessage() . "</p>";
        }
        
    } else {
        echo "<p class='error'>✗ Transactions table does not exist</p>";
        echo "<p class='warning'>You need to run the database setup script first.</p>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>Database connection failed: " . $e->getMessage() . "</p>";
    echo "<p class='info'>Check your database configuration in config.php</p>";
}

echo "<h2>Configuration Check</h2>";
echo "<p><strong>DB_HOST:</strong> " . DB_HOST . "</p>";
echo "<p><strong>DB_NAME:</strong> " . DB_NAME . "</p>";
echo "<p><strong>DB_USER:</strong> " . DB_USER . "</p>";
echo "<p><strong>DB_PASS:</strong> " . (empty(DB_PASS) ? '(empty)' : '(set)') . "</p>";
?>
