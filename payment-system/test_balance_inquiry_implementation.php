<?php
require_once 'config.php';

echo "<h2>Balance Inquiry Implementation Test</h2>";
echo "<p><strong>Using InTouch API Balance Inquiry for Amount Status:</strong></p>";
echo "<ul>";
echo "<li>✅ Uses <code>getbalance</code> API to retrieve actual account balance</li>";
echo "<li>✅ Account balance represents the actual amount status from InTouch</li>";
echo "<li>✅ Provides real-time amount information directly from payment gateway</li>";
echo "</ul>";

try {
    // Clear cache first
    echo "<h3>1. Clearing Cache</h3>";
    $cacheService = CacheService::getInstance();
    $cacheService->clear();
    echo "✅ Cache cleared<br><br>";
    
    // Test InTouch API Balance Inquiry
    echo "<h3>2. InTouch API Balance Inquiry Test</h3>";
    $intouchApi = IntouchApiService::getInstance();
    
    echo "Testing balance inquiry API call...<br>";
    $balanceResult = $intouchApi->getAccountBalance();
    
    if ($balanceResult['success']) {
        echo "✅ <strong>Balance Inquiry Successful!</strong><br>";
        echo "Account Balance: <strong>" . number_format($balanceResult['balance'], 2) . " " . $balanceResult['currency'] . "</strong><br>";
        echo "This represents the actual amount status from InTouch Pay<br>";
        
        if (isset($balanceResult['raw_response'])) {
            echo "Raw API Response: <code>" . json_encode($balanceResult['raw_response']) . "</code><br>";
        }
    } else {
        echo "❌ Balance Inquiry Failed<br>";
        echo "Error: " . $balanceResult['error'] . "<br>";
        if (isset($balanceResult['response_code'])) {
            echo "Response Code: " . $balanceResult['response_code'] . "<br>";
        }
    }
    
    echo "<br>";
    
    // Test Amount Service with Balance Inquiry
    echo "<h3>3. Amount Service with Balance Inquiry</h3>";
    $amountService = AmountService::getInstance();
    
    echo "Testing amount summary using balance inquiry...<br>";
    $summary = $amountService->getAmountSummary();
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Metric</th><th>Value</th><th>Source</th></tr>";
    echo "<tr><td>Total Amount</td><td>" . $amountService->formatCurrency($summary['total_amount']) . "</td><td>" . 
         (isset($summary['actual_balance']) && $summary['actual_balance'] > 0 ? "InTouch API Balance" : "Local Database") . "</td></tr>";
    
    if (isset($summary['actual_balance'])) {
        echo "<tr><td>Actual Balance</td><td>" . $amountService->formatCurrency($summary['actual_balance']) . "</td><td>InTouch API</td></tr>";
        echo "<tr><td>Balance Currency</td><td>" . $summary['balance_currency'] . "</td><td>InTouch API</td></tr>";
        echo "<tr><td>Last Updated</td><td>" . ($summary['balance_last_updated'] ?? 'N/A') . "</td><td>System</td></tr>";
    }
    
    echo "<tr><td>Total Transactions</td><td>" . $summary['total_transactions'] . "</td><td>Local Database</td></tr>";
    echo "<tr><td>Successful Transactions</td><td>" . $summary['successful_transactions'] . "</td><td>Local Database</td></tr>";
    echo "<tr><td>Success Rate</td><td>" . $summary['success_rate'] . "%</td><td>Calculated</td></tr>";
    echo "</table>";
    
    echo "<br>";
    
    // Test Filtered Amount Calculation with Balance
    echo "<h3>4. Filtered Amount Calculation Test</h3>";
    
    // Test with successful transactions filter (should use balance inquiry)
    echo "<h4>4.1 All Successful Transactions (Uses Balance Inquiry)</h4>";
    $successfulFilter = ['status' => ['successful', 'successfull']];
    $successfulAmounts = $amountService->calculateTotalAmount($successfulFilter);
    
    echo "Filter: Successful transactions only<br>";
    echo "Total Amount: " . $amountService->formatCurrency($successfulAmounts['total_amount']) . "<br>";
    echo "Source: " . ($balanceResult['success'] ? "InTouch API Balance Inquiry" : "Local Database Fallback") . "<br>";
    echo "Transaction Count: " . $successfulAmounts['transaction_count'] . "<br>";
    
    echo "<br>";
    
    // Test with date filter (should use local database)
    echo "<h4>4.2 Today's Transactions (Uses Local Database)</h4>";
    $todayFilter = [
        'status' => ['successful', 'successfull'],
        'date_from' => date('Y-m-d'),
        'date_to' => date('Y-m-d')
    ];
    $todayAmounts = $amountService->calculateTotalAmount($todayFilter);
    
    echo "Filter: Today's successful transactions<br>";
    echo "Total Amount: " . $amountService->formatCurrency($todayAmounts['total_amount']) . "<br>";
    echo "Source: Local Database (date-filtered)<br>";
    echo "Transaction Count: " . $todayAmounts['transaction_count'] . "<br>";
    
    echo "<br>";
    
    // Demonstrate Balance vs Local Comparison
    echo "<h3>5. Balance vs Local Database Comparison</h3>";
    
    // Get local successful amount
    $localSuccessfulSql = "
        SELECT 
            COUNT(*) as count,
            SUM(amount) as total_amount
        FROM transactions 
        WHERE status IN ('successful', 'successfull')
    ";
    $localResult = DatabaseService::getInstance()->fetchOne($localSuccessfulSql);
    $localAmount = (float)($localResult['total_amount'] ?? 0);
    $localCount = (int)($localResult['count'] ?? 0);
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Source</th><th>Amount</th><th>Description</th></tr>";
    echo "<tr><td>InTouch API Balance</td><td>" . 
         ($balanceResult['success'] ? number_format($balanceResult['balance'], 2) . " RWF" : "Failed to retrieve") . 
         "</td><td>Actual balance in InTouch account</td></tr>";
    echo "<tr><td>Local Database</td><td>" . number_format($localAmount, 2) . " RWF</td><td>Sum of {$localCount} successful transactions in local DB</td></tr>";
    
    if ($balanceResult['success']) {
        $difference = $balanceResult['balance'] - $localAmount;
        echo "<tr><td>Difference</td><td>" . number_format($difference, 2) . " RWF</td><td>" . 
             ($difference > 0 ? "API balance is higher" : ($difference < 0 ? "Local amount is higher" : "Amounts match")) . "</td></tr>";
    }
    echo "</table>";
    
    echo "<br>";
    
    // Performance Test
    echo "<h3>6. Performance Test</h3>";
    
    // Test balance inquiry performance
    $startTime = microtime(true);
    $balanceTest = $intouchApi->getAccountBalance();
    $balanceTime = (microtime(true) - $startTime) * 1000;
    
    echo "Balance Inquiry Time: " . number_format($balanceTime, 2) . " ms<br>";
    
    // Test cached summary performance
    $startTime = microtime(true);
    $cachedSummary = $amountService->getAmountSummary();
    $summaryTime = (microtime(true) - $startTime) * 1000;
    
    echo "Cached Summary Time: " . number_format($summaryTime, 2) . " ms<br>";
    echo "Performance: " . ($summaryTime < 100 ? "✅ Excellent" : "⚠️ Needs optimization") . "<br>";
    
    echo "<br>";
    
    // Test Dashboard API with Balance
    echo "<h3>7. Dashboard API Test</h3>";
    $url = 'http://localhost/payment-system/dashboard_api.php?endpoint=summary';
    
    $context = stream_context_create([
        'http' => [
            'timeout' => 15,
            'ignore_errors' => true
        ]
    ]);
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response !== false) {
        $data = json_decode($response, true);
        
        if ($data && isset($data['success']) && $data['success']) {
            echo "✅ Dashboard API working with balance inquiry<br>";
            echo "API Total Amount: " . number_format($data['data']['total_amount'], 2) . " RWF<br>";
            echo "Source: " . (isset($data['data']['actual_balance']) && $data['data']['actual_balance'] > 0 ? 
                 "InTouch API Balance" : "Local Database") . "<br>";
        } else {
            echo "❌ Dashboard API error: " . (isset($data['message']) ? $data['message'] : 'Unknown error') . "<br>";
        }
    } else {
        echo "❌ Failed to connect to Dashboard API<br>";
    }
    
} catch (Exception $e) {
    echo "<div style='color: red; background: #ffe6e6; padding: 10px; border: 1px solid red;'>";
    echo "<strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "<br>";
    echo "<strong>File:</strong> " . $e->getFile() . "<br>";
    echo "<strong>Line:</strong> " . $e->getLine() . "<br>";
    echo "</div>";
}

echo "<hr>";
echo "<h3>Balance Inquiry Implementation Summary</h3>";
echo "<div style='background: #e6ffe6; padding: 15px; border: 1px solid green;'>";
echo "<h4>✅ Balance Inquiry Solution:</h4>";
echo "<ol>";
echo "<li><strong>Primary Source:</strong> InTouch API <code>getbalance</code> endpoint for total amount</li>";
echo "<li><strong>Real-time Data:</strong> Account balance reflects actual processed amounts</li>";
echo "<li><strong>Fallback:</strong> Local database used when API is unavailable</li>";
echo "<li><strong>Filtered Queries:</strong> Local database used for date/phone specific filters</li>";
echo "<li><strong>Performance:</strong> Balance cached for efficiency</li>";
echo "<li><strong>Accuracy:</strong> Shows actual amount status from payment gateway</li>";
echo "</ol>";
echo "</div>";

echo "<p><a href='dashboard.html'>View Dashboard</a> | <a href='index.html'>Payment Form</a></p>";
?>
