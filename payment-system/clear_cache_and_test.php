<?php
require_once 'config.php';

echo "<h2>Clear Cache and Test Amount Retrieval</h2>";

try {
    // Clear cache first
    echo "<h3>1. Clearing Cache</h3>";
    $cacheService = CacheService::getInstance();
    $cacheService->clear();
    echo "✅ Cache cleared successfully<br><br>";
    
    // Test direct database queries
    echo "<h3>2. Direct Database Queries</h3>";
    $dbService = DatabaseService::getInstance();
    
    // Check total transactions directly
    $directCount = $dbService->fetchOne("SELECT COUNT(*) as count FROM transactions");
    echo "Direct transaction count: " . $directCount['count'] . "<br>";
    
    // Check dashboard summary view
    $summaryView = $dbService->getDashboardSummary();
    echo "Dashboard summary view:<br>";
    echo "- Total transactions: " . $summaryView['total_transactions'] . "<br>";
    echo "- Successful transactions: " . $summaryView['successful_transactions'] . "<br>";
    echo "- Total amount: " . number_format($summaryView['total_amount'], 2) . " RWF<br>";
    
    // Check today's stats
    $todayStats = $dbService->getTodayStats();
    echo "Today's stats:<br>";
    echo "- Today transactions: " . $todayStats['today_transactions'] . "<br>";
    echo "- Today successful: " . $todayStats['today_successful'] . "<br>";
    echo "- Today amount: " . number_format($todayStats['today_amount'], 2) . " RWF<br>";
    
    echo "<br>";
    
    // Test amount service after cache clear
    echo "<h3>3. Amount Service Test (After Cache Clear)</h3>";
    $amountService = AmountService::getInstance();
    $summary = $amountService->getAmountSummary();
    
    echo "Amount Service Summary:<br>";
    echo "- Total transactions: " . $summary['total_transactions'] . "<br>";
    echo "- Successful transactions: " . $summary['successful_transactions'] . "<br>";
    echo "- Total amount: " . $amountService->formatCurrency($summary['total_amount']) . "<br>";
    echo "- Today amount: " . $amountService->formatCurrency($summary['today_amount']) . "<br>";
    echo "- Success rate: " . $summary['success_rate'] . "%<br>";
    
    echo "<br>";
    
    // Test recent transactions
    echo "<h3>4. Recent Transactions</h3>";
    $recentTransactions = $dbService->getRecentTransactions(5);
    echo "Recent transactions count: " . count($recentTransactions) . "<br>";
    
    if (count($recentTransactions) > 0) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>ID</th><th>Phone</th><th>Amount</th><th>Status</th><th>Date</th></tr>";
        
        foreach ($recentTransactions as $transaction) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($transaction['request_transaction_id']) . "</td>";
            echo "<td>" . htmlspecialchars($transaction['phone_number']) . "</td>";
            echo "<td>" . number_format($transaction['amount'], 2) . " RWF</td>";
            echo "<td>" . htmlspecialchars($transaction['status']) . "</td>";
            echo "<td>" . date('M j, Y g:i A', strtotime($transaction['created_at'])) . "</td>";
            echo "</tr>";
        }
        
        echo "</table>";
    } else {
        echo "No recent transactions found.<br>";
    }
    
    echo "<br>";
    
    // Test dashboard API
    echo "<h3>5. Dashboard API Test</h3>";
    $url = 'http://localhost/payment-system/dashboard_api.php?endpoint=summary';
    
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'ignore_errors' => true
        ]
    ]);
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response !== false) {
        $data = json_decode($response, true);
        
        if ($data && isset($data['success']) && $data['success']) {
            echo "✅ Dashboard API working<br>";
            echo "API Response:<br>";
            echo "- Total transactions: " . $data['data']['total_transactions'] . "<br>";
            echo "- Total amount: " . number_format($data['data']['total_amount'], 2) . " RWF<br>";
        } else {
            echo "❌ Dashboard API error: " . (isset($data['message']) ? $data['message'] : 'Unknown error') . "<br>";
        }
    } else {
        echo "❌ Failed to connect to Dashboard API<br>";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
    echo "File: " . $e->getFile() . "<br>";
    echo "Line: " . $e->getLine() . "<br>";
}

echo "<br>";
echo "<p><a href='create_test_transaction.php'>Create Another Test Transaction</a> | ";
echo "<a href='dashboard.html'>View Dashboard</a></p>";
?>
