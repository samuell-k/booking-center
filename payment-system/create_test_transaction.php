<?php
require_once 'config.php';

echo "<h2>Create Test Transaction</h2>";

try {
    $dbService = DatabaseService::getInstance();
    
    // Create a test successful transaction
    $testData = [
        'request_transaction_id' => 'TEST_' . time(),
        'intouchpay_transaction_id' => 'ITP_TEST_' . time(),
        'phone_number' => '250781234567',
        'amount' => 1500.00,
        'status' => 'successful',
        'response_code' => '01',
        'user_name' => 'Test User'
    ];
    
    $result = $dbService->storeTransaction($testData);
    
    if ($result) {
        echo "✅ Test transaction created successfully!<br>";
        echo "Transaction ID: " . $testData['request_transaction_id'] . "<br>";
        echo "Amount: " . number_format($testData['amount'], 2) . " RWF<br>";
        echo "Status: " . $testData['status'] . "<br>";
        
        echo "<br><h3>Testing Amount Retrieval</h3>";
        
        // Test amount service
        $amountService = AmountService::getInstance();
        $summary = $amountService->getAmountSummary();
        
        echo "Total Amount (with API integration): " . $amountService->formatCurrency($summary['total_amount']) . "<br>";
        echo "Total Transactions: " . $summary['total_transactions'] . "<br>";
        echo "Successful Transactions: " . $summary['successful_transactions'] . "<br>";
        
        // Test API amount retrieval for this specific transaction
        echo "<br><h3>Testing API Amount Retrieval</h3>";
        $intouchApi = IntouchApiService::getInstance();
        $apiAmount = $intouchApi->getTransactionAmount(
            $testData['request_transaction_id'],
            $testData['intouchpay_transaction_id']
        );
        
        echo "Local Amount: " . number_format($testData['amount'], 2) . " RWF<br>";
        echo "API Amount: " . ($apiAmount > 0 ? number_format($apiAmount, 2) . " RWF" : "Not available (expected for test transaction)") . "<br>";
        
        echo "<br><p><strong>Note:</strong> The API amount will be 0 for this test transaction since it's not a real InTouch transaction. In production, successful transactions will show the actual amount from the InTouch API.</p>";
        
    } else {
        echo "❌ Failed to create test transaction<br>";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

echo "<br>";
echo "<p><a href='test_amount_api.php'>Test Amount API</a> | ";
echo "<a href='test_dashboard_api.php'>Test Dashboard API</a> | ";
echo "<a href='dashboard.html'>View Dashboard</a></p>";
?>
