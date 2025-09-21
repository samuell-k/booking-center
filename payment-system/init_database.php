<?php
/**
 * Database Initialization Script
 * Run this script once to set up the payment system database
 */

require_once 'config.php';

// Function to execute SQL file
function executeSQLFile($pdo, $filename) {
    if (!file_exists($filename)) {
        throw new Exception("SQL file not found: $filename");
    }
    
    $sql = file_get_contents($filename);
    
    // Split SQL into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($statement) {
            return !empty($statement) && !preg_match('/^\s*--/', $statement);
        }
    );
    
    foreach ($statements as $statement) {
        if (!empty(trim($statement))) {
            try {
                $pdo->exec($statement);
                echo "✓ Executed: " . substr(trim($statement), 0, 50) . "...\n";
            } catch (PDOException $e) {
                echo "✗ Error executing statement: " . $e->getMessage() . "\n";
                echo "Statement: " . substr($statement, 0, 100) . "...\n";
            }
        }
    }
}

try {
    echo "=== Payment System Database Initialization ===\n\n";
    
    // Connect to MySQL server (without specifying database)
    $dsn = "mysql:host=" . DB_HOST;
    $pdo = new PDO($dsn, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✓ Connected to MySQL server\n";
    
    // Execute the database setup script
    executeSQLFile($pdo, 'database_setup.sql');
    
    echo "\n=== Database Setup Complete ===\n";
    echo "✓ Database 'payment_system' created\n";
    echo "✓ Tables created: transactions, payment_stats, users\n";
    echo "✓ Views created: dashboard_summary, recent_transactions\n";
    echo "✓ Sample data inserted\n";
    echo "\nYou can now use the payment dashboard!\n";
    
} catch (PDOException $e) {
    echo "✗ Database Error: " . $e->getMessage() . "\n";
    echo "\nPlease check your database configuration in config.php\n";
    echo "Make sure MySQL is running and credentials are correct.\n";
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
?>
