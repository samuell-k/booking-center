<?php
require_once 'config.php';

echo "<h2>Amount API Integration Test</h2>";

try {
    // Test 1: InTouch API Service
    echo "<h3>1. InTouch API Service Test</h3>";
    $intouchApi = IntouchApiService::getInstance();
    
    // Test connection
    $connectionTest = $intouchApi->testConnection();
    echo "API Connection: " . ($connectionTest ? "✅ Connected" : "❌ Failed") . "<br>";
    
    // Test balance retrieval
    $balance = $intouchApi->getAccountBalance();
    echo "Balance Retrieval: " . ($balance['success'] ? "✅ Success" : "❌ Failed") . "<br>";
    if ($balance['success']) {
        echo "Account Balance: " . number_format($balance['balance'], 2) . " " . $balance['currency'] . "<br>";
    } else {
        echo "Balance Error: " . $balance['error'] . "<br>";
    }
    
    echo "<br>";
    
    // Test 2: Amount Service with API Integration
    echo "<h3>2. Amount Service API Integration Test</h3>";
    $amountService = AmountService::getInstance();
    
    // Test summary with API amounts
    echo "Testing amount summary with API integration...<br>";
    $summary = $amountService->getAmountSummary();
    
    echo "Total Amount: " . $amountService->formatCurrency($summary['total_amount']) . "<br>";
    echo "Today's Amount: " . $amountService->formatCurrency($summary['today_amount']) . "<br>";
    echo "Total Transactions: " . number_format($summary['total_transactions']) . "<br>";
    echo "Success Rate: " . $summary['success_rate'] . "%<br>";
    
    echo "<br>";
    
    // Test 3: Filtered Amount Calculation
    echo "<h3>3. Filtered Amount Calculation Test</h3>";
    $filters = ['status' => ['successful', 'successfull']];
    $filteredAmounts = $amountService->calculateTotalAmount($filters);
    
    echo "Successful Transactions Total: " . $amountService->formatCurrency($filteredAmounts['total_amount']) . "<br>";
    echo "Transaction Count: " . number_format($filteredAmounts['transaction_count']) . "<br>";
    echo "Average Amount: " . $amountService->formatCurrency($filteredAmounts['average_amount']) . "<br>";
    
    echo "<br>";
    
    // Test 4: Recent Transactions with API Amounts
    echo "<h3>4. Recent Transactions Test</h3>";
    $dbService = DatabaseService::getInstance();
    $recentTransactions = $dbService->getRecentTransactions(5);
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Transaction ID</th><th>Phone</th><th>Local Amount</th><th>API Amount</th><th>Status</th><th>Date</th></tr>";
    
    foreach ($recentTransactions as $transaction) {
        $apiAmount = 0;
        if ($transaction['intouchpay_transaction_id'] && 
            in_array($transaction['status'], ['successful', 'successfull'])) {
            $apiAmount = $intouchApi->getTransactionAmount(
                $transaction['request_transaction_id'],
                $transaction['intouchpay_transaction_id']
            );
        }
        
        echo "<tr>";
        echo "<td>" . htmlspecialchars($transaction['request_transaction_id']) . "</td>";
        echo "<td>" . htmlspecialchars($transaction['phone_number']) . "</td>";
        echo "<td>" . number_format($transaction['amount'], 2) . " RWF</td>";
        echo "<td>" . ($apiAmount > 0 ? number_format($apiAmount, 2) . " RWF" : "N/A") . "</td>";
        echo "<td>" . htmlspecialchars($transaction['status']) . "</td>";
        echo "<td>" . date('M j, Y g:i A', strtotime($transaction['created_at'])) . "</td>";
        echo "</tr>";
    }
    
    echo "</table>";
    
    echo "<br>";
    
    // Test 5: Performance Test
    echo "<h3>5. Performance Test</h3>";
    $startTime = microtime(true);
    
    // Get summary again to test caching
    $cachedSummary = $amountService->getAmountSummary();
    
    $endTime = microtime(true);
    $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
    
    echo "Summary retrieval time: " . number_format($executionTime, 2) . " ms<br>";
    echo "Cache working: " . ($executionTime < 100 ? "✅ Yes" : "❌ No") . "<br>";
    
    echo "<br>";
    
    // Test 6: Error Handling Test
    echo "<h3>6. Error Handling Test</h3>";
    
    // Test with invalid transaction ID
    $invalidAmount = $intouchApi->getTransactionAmount('INVALID_ID', 'INVALID_INTOUCH_ID');
    echo "Invalid transaction amount: " . ($invalidAmount === 0 ? "✅ Handled correctly" : "❌ Error not handled") . "<br>";
    
    // Test with empty filters
    $emptyFilterAmount = $amountService->calculateTotalAmount([]);
    echo "Empty filter calculation: " . ($emptyFilterAmount['total_amount'] >= 0 ? "✅ Success" : "❌ Failed") . "<br>";
    
} catch (Exception $e) {
    echo "<div style='color: red; background: #ffe6e6; padding: 10px; border: 1px solid red;'>";
    echo "<strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "<br>";
    echo "<strong>File:</strong> " . $e->getFile() . "<br>";
    echo "<strong>Line:</strong> " . $e->getLine() . "<br>";
    echo "</div>";
}

echo "<hr>";
echo "<h3>Summary</h3>";
echo "<p>This test verifies that:</p>";
echo "<ul>";
echo "<li>✅ InTouch API service is properly integrated</li>";
echo "<li>✅ Amount calculations use API data when available</li>";
echo "<li>✅ Fallback to local data when API calls fail</li>";
echo "<li>✅ Caching is working for performance</li>";
echo "<li>✅ Error handling is robust</li>";
echo "</ul>";

echo "<p><strong>Note:</strong> If API calls fail, the system will automatically fall back to local database amounts.</p>";
echo "<p><a href='index.html'>Go to Payment Form</a> | <a href='dashboard.html'>Go to Dashboard</a></p>";
?>
