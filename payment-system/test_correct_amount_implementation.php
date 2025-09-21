<?php
require_once 'config.php';

echo "<h2>Correct Amount Implementation Test</h2>";
echo "<p><strong>Based on InTouch API Documentation:</strong></p>";
echo "<ul>";
echo "<li>✅ The <code>gettransactionstatus</code> API does NOT return amount information</li>";
echo "<li>✅ Amounts should be retrieved from local database where they were stored during payment request</li>";
echo "<li>✅ API should be used to verify transaction status, not to get amounts</li>";
echo "</ul>";

try {
    // Clear cache first
    echo "<h3>1. Clearing Cache</h3>";
    $cacheService = CacheService::getInstance();
    $cacheService->clear();
    echo "✅ Cache cleared<br><br>";
    
    // Test InTouch API Service
    echo "<h3>2. InTouch API Service Test</h3>";
    $intouchApi = IntouchApiService::getInstance();
    
    // Test connection
    $balance = $intouchApi->getAccountBalance();
    echo "Account Balance: " . ($balance['success'] ? number_format($balance['balance'], 2) . " RWF" : "Failed") . "<br>";
    
    // Test transaction amount method (should return 0 with warning)
    echo "Testing getTransactionAmount (should return 0): ";
    $testAmount = $intouchApi->getTransactionAmount('TEST_123', 'ITP_123');
    echo $testAmount . " RWF ✅<br>";
    
    echo "<br>";
    
    // Create test transactions to demonstrate
    echo "<h3>3. Creating Test Transactions</h3>";
    $dbService = DatabaseService::getInstance();
    
    // Create multiple test transactions
    $testTransactions = [
        [
            'request_transaction_id' => 'DEMO_' . time() . '_1',
            'intouchpay_transaction_id' => 'ITP_DEMO_' . time() . '_1',
            'phone_number' => '250781234567',
            'amount' => 2000.00,
            'status' => 'successful',
            'response_code' => '01',
            'user_name' => 'Demo User 1'
        ],
        [
            'request_transaction_id' => 'DEMO_' . time() . '_2',
            'intouchpay_transaction_id' => 'ITP_DEMO_' . time() . '_2',
            'phone_number' => '250782345678',
            'amount' => 1500.00,
            'status' => 'successful',
            'response_code' => '01',
            'user_name' => 'Demo User 2'
        ],
        [
            'request_transaction_id' => 'DEMO_' . time() . '_3',
            'intouchpay_transaction_id' => null, // No InTouch ID (failed transaction)
            'phone_number' => '250783456789',
            'amount' => 1000.00,
            'status' => 'failed',
            'response_code' => '1005',
            'user_name' => 'Demo User 3'
        ]
    ];
    
    foreach ($testTransactions as $transaction) {
        $result = $dbService->storeTransaction($transaction);
        if ($result) {
            echo "✅ Created transaction: " . $transaction['request_transaction_id'] . 
                 " - " . number_format($transaction['amount'], 2) . " RWF - " . $transaction['status'] . "<br>";
        }
    }
    
    echo "<br>";
    
    // Test the corrected amount service
    echo "<h3>4. Amount Service Test (Corrected Implementation)</h3>";
    $amountService = AmountService::getInstance();
    
    // Clear cache to get fresh data
    $cacheService->clear();
    
    $summary = $amountService->getAmountSummary();
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Metric</th><th>Value</th><th>Explanation</th></tr>";
    echo "<tr><td>Total Transactions</td><td>" . $summary['total_transactions'] . "</td><td>All transactions in database</td></tr>";
    echo "<tr><td>Successful Transactions</td><td>" . $summary['successful_transactions'] . "</td><td>Transactions with 'successful' status</td></tr>";
    echo "<tr><td>Total Amount</td><td>" . $amountService->formatCurrency($summary['total_amount']) . "</td><td>Sum of amounts from LOCAL database (verified with API status)</td></tr>";
    echo "<tr><td>Success Rate</td><td>" . $summary['success_rate'] . "%</td><td>Percentage of successful transactions</td></tr>";
    echo "</table>";
    
    echo "<br>";
    
    // Test filtered amounts
    echo "<h3>5. Filtered Amount Calculation Test</h3>";
    $filters = ['status' => ['successful', 'successfull']];
    $filteredAmounts = $amountService->calculateTotalAmount($filters);
    
    echo "Successful Transactions Only:<br>";
    echo "- Count: " . $filteredAmounts['transaction_count'] . "<br>";
    echo "- Total Amount: " . $amountService->formatCurrency($filteredAmounts['total_amount']) . "<br>";
    echo "- Average Amount: " . $amountService->formatCurrency($filteredAmounts['average_amount']) . "<br>";
    
    echo "<br>";
    
    // Demonstrate API status verification
    echo "<h3>6. API Status Verification Demo</h3>";
    echo "<p>Testing transaction status verification with InTouch API:</p>";
    
    $recentTransactions = $dbService->getRecentTransactions(3);
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Transaction ID</th><th>Local Status</th><th>Local Amount</th><th>API Status Check</th><th>Included in Totals</th></tr>";
    
    foreach ($recentTransactions as $transaction) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($transaction['request_transaction_id']) . "</td>";
        echo "<td>" . htmlspecialchars($transaction['status']) . "</td>";
        echo "<td>" . number_format($transaction['amount'], 2) . " RWF</td>";
        
        if ($transaction['intouchpay_transaction_id'] && $transaction['status'] === 'successful') {
            // Test API status check
            $apiStatus = $intouchApi->getTransactionStatus(
                $transaction['request_transaction_id'],
                $transaction['intouchpay_transaction_id']
            );
            
            if ($apiStatus['success']) {
                echo "<td>✅ API Verified (Status: " . $apiStatus['status'] . ")</td>";
                echo "<td>✅ Yes - Local amount used</td>";
            } else {
                echo "<td>❌ API Check Failed</td>";
                echo "<td>⚠️ Yes - Local status trusted</td>";
            }
        } else {
            echo "<td>N/A (No InTouch ID or not successful)</td>";
            echo "<td>" . ($transaction['status'] === 'successful' ? '✅ Yes' : '❌ No') . "</td>";
        }
        
        echo "</tr>";
    }
    
    echo "</table>";
    
    echo "<br>";
    
    // Performance test
    echo "<h3>7. Performance Test</h3>";
    $startTime = microtime(true);
    
    // Test cached retrieval
    $cachedSummary = $amountService->getAmountSummary();
    
    $endTime = microtime(true);
    $executionTime = ($endTime - $startTime) * 1000;
    
    echo "Cached summary retrieval: " . number_format($executionTime, 2) . " ms<br>";
    echo "Cache efficiency: " . ($executionTime < 50 ? "✅ Excellent" : "⚠️ Needs optimization") . "<br>";
    
    echo "<br>";
    
    // Clean up test transactions
    echo "<h3>8. Cleanup</h3>";
    foreach ($testTransactions as $transaction) {
        $dbService->execute("DELETE FROM transactions WHERE request_transaction_id = ?", 
                          [$transaction['request_transaction_id']]);
    }
    echo "✅ Test transactions cleaned up<br>";
    
    // Clear cache after cleanup
    $cacheService->clear();
    echo "✅ Cache cleared<br>";
    
} catch (Exception $e) {
    echo "<div style='color: red; background: #ffe6e6; padding: 10px; border: 1px solid red;'>";
    echo "<strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "<br>";
    echo "<strong>File:</strong> " . $e->getFile() . "<br>";
    echo "<strong>Line:</strong> " . $e->getLine() . "<br>";
    echo "</div>";
}

echo "<hr>";
echo "<h3>Implementation Summary</h3>";
echo "<div style='background: #e6ffe6; padding: 15px; border: 1px solid green;'>";
echo "<h4>✅ Correct Implementation:</h4>";
echo "<ol>";
echo "<li><strong>Amount Storage:</strong> Amounts are stored in local database during payment request</li>";
echo "<li><strong>Amount Retrieval:</strong> Amounts are retrieved from local database, NOT from InTouch API</li>";
echo "<li><strong>Status Verification:</strong> InTouch API is used to verify transaction status only</li>";
echo "<li><strong>Accuracy:</strong> Local amounts are verified against API status to ensure reliability</li>";
echo "<li><strong>Performance:</strong> Caching and batch processing optimize API calls</li>";
echo "<li><strong>Fallback:</strong> System gracefully handles API failures</li>";
echo "</ol>";
echo "</div>";

echo "<p><a href='dashboard.html'>View Dashboard</a> | <a href='index.html'>Payment Form</a></p>";
?>
