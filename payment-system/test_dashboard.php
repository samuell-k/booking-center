<?php
/**
 * Dashboard System Test Script
 * This script tests all dashboard functionality
 */

require_once 'config.php';

echo "=== Payment Dashboard System Test ===\n\n";

// Test 1: Database Connection
echo "1. Testing Database Connection...\n";
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "   ✓ Database connection successful\n";
} catch (PDOException $e) {
    echo "   ✗ Database connection failed: " . $e->getMessage() . "\n";
    echo "   Please run 'php init_database.php' first\n";
    exit(1);
}

// Test 2: Check Tables Exist
echo "\n2. Checking Database Tables...\n";
$tables = ['transactions', 'payment_stats', 'users'];
foreach ($tables as $table) {
    try {
        $stmt = $pdo->query("SELECT COUNT(*) FROM $table");
        $count = $stmt->fetchColumn();
        echo "   ✓ Table '$table' exists with $count records\n";
    } catch (PDOException $e) {
        echo "   ✗ Table '$table' not found or error: " . $e->getMessage() . "\n";
    }
}

// Test 3: Check Views Exist
echo "\n3. Checking Database Views...\n";
$views = ['dashboard_summary', 'recent_transactions'];
foreach ($views as $view) {
    try {
        $stmt = $pdo->query("SELECT * FROM $view LIMIT 1");
        echo "   ✓ View '$view' exists and accessible\n";
    } catch (PDOException $e) {
        echo "   ✗ View '$view' not found or error: " . $e->getMessage() . "\n";
    }
}

// Test 4: Test API Endpoints
echo "\n4. Testing API Endpoints...\n";
$endpoints = [
    'summary' => 'dashboard_api.php?endpoint=summary',
    'transactions' => 'dashboard_api.php?endpoint=transactions&limit=5',
    'stats' => 'dashboard_api.php?endpoint=stats',
    'recent' => 'dashboard_api.php?endpoint=recent'
];

foreach ($endpoints as $name => $url) {
    $response = @file_get_contents("http://localhost/payment-system/$url");
    if ($response) {
        $data = json_decode($response, true);
        if ($data && isset($data['success']) && $data['success']) {
            echo "   ✓ Endpoint '$name' working correctly\n";
        } else {
            echo "   ✗ Endpoint '$name' returned error: " . ($data['message'] ?? 'Unknown error') . "\n";
        }
    } else {
        echo "   ✗ Endpoint '$name' not accessible (check web server)\n";
    }
}

// Test 5: Insert Test Transaction
echo "\n5. Testing Transaction Insertion...\n";
try {
    $testTransactionId = 'TEST_' . time();
    $stmt = $pdo->prepare("
        INSERT INTO transactions (
            request_transaction_id, 
            phone_number, 
            amount, 
            status, 
            user_name
        ) VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $testTransactionId,
        '250781234567',
        1500.00,
        'pending',
        'Test User'
    ]);
    
    echo "   ✓ Test transaction inserted successfully\n";
    
    // Verify insertion
    $stmt = $pdo->prepare("SELECT * FROM transactions WHERE request_transaction_id = ?");
    $stmt->execute([$testTransactionId]);
    $transaction = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($transaction) {
        echo "   ✓ Test transaction verified in database\n";
        
        // Clean up test transaction
        $stmt = $pdo->prepare("DELETE FROM transactions WHERE request_transaction_id = ?");
        $stmt->execute([$testTransactionId]);
        echo "   ✓ Test transaction cleaned up\n";
    } else {
        echo "   ✗ Test transaction not found after insertion\n";
    }
    
} catch (PDOException $e) {
    echo "   ✗ Transaction insertion failed: " . $e->getMessage() . "\n";
}

// Test 6: Check File Permissions
echo "\n6. Checking File Permissions...\n";
$files = [
    'dashboard.html' => 'Dashboard interface',
    'dashboard_api.php' => 'Dashboard API',
    'home.html' => 'Landing page',
    'init_database.php' => 'Database setup script'
];

foreach ($files as $file => $description) {
    if (file_exists($file)) {
        if (is_readable($file)) {
            echo "   ✓ $description ($file) is accessible\n";
        } else {
            echo "   ✗ $description ($file) is not readable\n";
        }
    } else {
        echo "   ✗ $description ($file) not found\n";
    }
}

// Test 7: Check Sample Data
echo "\n7. Checking Sample Data...\n";
try {
    $stmt = $pdo->query("
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'successful' THEN 1 ELSE 0 END) as successful,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
        FROM transactions
    ");
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "   ✓ Total transactions: " . $stats['total'] . "\n";
    echo "   ✓ Successful: " . $stats['successful'] . "\n";
    echo "   ✓ Pending: " . $stats['pending'] . "\n";
    echo "   ✓ Failed: " . $stats['failed'] . "\n";
    
    if ($stats['total'] > 0) {
        echo "   ✓ Sample data is available for testing\n";
    } else {
        echo "   ! No sample data found - dashboard will be empty\n";
    }
    
} catch (PDOException $e) {
    echo "   ✗ Error checking sample data: " . $e->getMessage() . "\n";
}

// Test 8: Performance Check
echo "\n8. Performance Check...\n";
try {
    $start = microtime(true);
    $stmt = $pdo->query("SELECT * FROM dashboard_summary");
    $summary = $stmt->fetch(PDO::FETCH_ASSOC);
    $end = microtime(true);
    
    $queryTime = round(($end - $start) * 1000, 2);
    echo "   ✓ Dashboard summary query: {$queryTime}ms\n";
    
    if ($queryTime < 100) {
        echo "   ✓ Performance is excellent\n";
    } elseif ($queryTime < 500) {
        echo "   ✓ Performance is good\n";
    } else {
        echo "   ! Performance could be improved (consider indexing)\n";
    }
    
} catch (PDOException $e) {
    echo "   ✗ Performance test failed: " . $e->getMessage() . "\n";
}

echo "\n=== Test Summary ===\n";
echo "Dashboard system test completed.\n";
echo "If all tests passed, you can access:\n";
echo "- Landing Page: http://localhost/payment-system/home.html\n";
echo "- Payment Form: http://localhost/payment-system/index.html\n";
echo "- Dashboard: http://localhost/payment-system/dashboard.html\n";
echo "\nIf any tests failed, please check the error messages above.\n";
?>
