<?php
/**
 * Withdrawal System Test Script
 * Tests the complete withdrawal functionality including API integration
 */

require_once 'config.php';
require_once 'services/IntouchApiService.php';

echo "<h1>Withdrawal System Test</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .success { color: green; }
    .error { color: red; }
    .warning { color: orange; }
    .info { color: blue; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 3px; overflow-x: auto; }
</style>";

// Test 1: Database Schema Verification
echo "<div class='test-section'>";
echo "<h2>1. Database Schema Verification</h2>";

try {
    $dbService = DatabaseService::getInstance();
    
    // Check if transaction_type column exists
    $result = $dbService->query("DESCRIBE transactions");
    $hasTransactionType = false;
    $hasReason = false;
    $hasWithdrawCharge = false;
    
    foreach ($result as $column) {
        if ($column['Field'] === 'transaction_type') $hasTransactionType = true;
        if ($column['Field'] === 'reason') $hasReason = true;
        if ($column['Field'] === 'withdraw_charge') $hasWithdrawCharge = true;
    }
    
    echo "<p class='" . ($hasTransactionType ? 'success' : 'error') . "'>Transaction Type Column: " . ($hasTransactionType ? 'EXISTS' : 'MISSING') . "</p>";
    echo "<p class='" . ($hasReason ? 'success' : 'error') . "'>Reason Column: " . ($hasReason ? 'EXISTS' : 'MISSING') . "</p>";
    echo "<p class='" . ($hasWithdrawCharge ? 'success' : 'error') . "'>Withdraw Charge Column: " . ($hasWithdrawCharge ? 'EXISTS' : 'MISSING') . "</p>";
    
    // Check views
    $views = ['withdrawal_summary', 'payment_summary', 'recent_transactions'];
    foreach ($views as $view) {
        try {
            $dbService->query("SELECT * FROM $view LIMIT 1");
            echo "<p class='success'>View '$view': EXISTS</p>";
        } catch (Exception $e) {
            echo "<p class='error'>View '$view': MISSING - " . $e->getMessage() . "</p>";
        }
    }
    
} catch (Exception $e) {
    echo "<p class='error'>Database Error: " . $e->getMessage() . "</p>";
}

echo "</div>";

// Test 2: IntouchPay API Service
echo "<div class='test-section'>";
echo "<h2>2. IntouchPay API Service Test</h2>";

try {
    $intouchApiService = IntouchApiService::getInstance();
    
    // Test connection
    echo "<p class='info'>Testing API connectivity...</p>";
    $connectionTest = $intouchApiService->testConnection();
    echo "<p class='" . ($connectionTest ? 'success' : 'error') . "'>API Connection: " . ($connectionTest ? 'SUCCESS' : 'FAILED') . "</p>";
    
    // Test balance inquiry
    echo "<p class='info'>Testing balance inquiry...</p>";
    $balanceResult = $intouchApiService->getAccountBalance();
    if ($balanceResult['success']) {
        echo "<p class='success'>Balance Inquiry: SUCCESS</p>";
        echo "<p class='info'>Current Balance: " . $balanceResult['balance'] . " " . $balanceResult['currency'] . "</p>";
    } else {
        echo "<p class='error'>Balance Inquiry: FAILED - " . $balanceResult['error'] . "</p>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>API Service Error: " . $e->getMessage() . "</p>";
}

echo "</div>";

// Test 3: Withdrawal Processing Simulation
echo "<div class='test-section'>";
echo "<h2>3. Withdrawal Processing Simulation</h2>";

try {
    // Test with a small amount to avoid actual charges
    $testPhoneNumber = '250781234567'; // Test phone number
    $testAmount = 100; // Minimum amount
    $testReason = 'Test withdrawal';
    
    echo "<p class='info'>Simulating withdrawal request...</p>";
    echo "<p>Phone: $testPhoneNumber</p>";
    echo "<p>Amount: $testAmount RWF</p>";
    echo "<p>Reason: $testReason</p>";
    
    // Validate phone number
    $phoneValid = validateRwandanPhoneNumber($testPhoneNumber);
    echo "<p class='" . ($phoneValid ? 'success' : 'error') . "'>Phone Validation: " . ($phoneValid ? 'VALID' : 'INVALID') . "</p>";
    
    // Test withdrawal request (commented out to avoid actual API calls)
    /*
    $withdrawalResult = $intouchApiService->requestWithdrawal($testPhoneNumber, $testAmount, $testReason, true);
    
    if ($withdrawalResult['success']) {
        echo "<p class='success'>Withdrawal Request: SUCCESS</p>";
        echo "<p>Request Transaction ID: " . $withdrawalResult['request_transaction_id'] . "</p>";
        echo "<p>Reference ID: " . ($withdrawalResult['reference_id'] ?? 'N/A') . "</p>";
        echo "<p>Response Code: " . ($withdrawalResult['response_code'] ?? 'N/A') . "</p>";
    } else {
        echo "<p class='error'>Withdrawal Request: FAILED - " . $withdrawalResult['message'] . "</p>";
    }
    */
    
    echo "<p class='warning'>Actual API call commented out to prevent charges. Uncomment in production testing.</p>";
    
} catch (Exception $e) {
    echo "<p class='error'>Withdrawal Processing Error: " . $e->getMessage() . "</p>";
}

echo "</div>";

// Test 4: Dashboard API Endpoints
echo "<div class='test-section'>";
echo "<h2>4. Dashboard API Endpoints Test</h2>";

$endpoints = [
    'summary' => 'Overall Summary',
    'withdrawal-summary' => 'Withdrawal Summary',
    'payment-summary' => 'Payment Summary',
    'transactions' => 'Transactions List',
    'combined-stats' => 'Combined Statistics'
];

foreach ($endpoints as $endpoint => $description) {
    try {
        $url = "dashboard_api.php?endpoint=$endpoint";
        $response = file_get_contents($url);
        $data = json_decode($response, true);
        
        if ($data && isset($data['success']) && $data['success']) {
            echo "<p class='success'>$description ($endpoint): SUCCESS</p>";
        } else {
            echo "<p class='error'>$description ($endpoint): FAILED - " . ($data['message'] ?? 'Unknown error') . "</p>";
        }
    } catch (Exception $e) {
        echo "<p class='error'>$description ($endpoint): ERROR - " . $e->getMessage() . "</p>";
    }
}

echo "</div>";

// Test 5: File Existence Check
echo "<div class='test-section'>";
echo "<h2>5. File Existence Check</h2>";

$requiredFiles = [
    'withdrawal.html' => 'Withdrawal Form',
    'process_withdrawal.php' => 'Withdrawal Processing Endpoint',
    'check_withdrawal_status.php' => 'Withdrawal Status Checking',
    'services/IntouchApiService.php' => 'IntouchPay API Service',
    'services/DatabaseService.php' => 'Database Service',
    'services/AmountService.php' => 'Amount Service'
];

foreach ($requiredFiles as $file => $description) {
    $exists = file_exists($file);
    echo "<p class='" . ($exists ? 'success' : 'error') . "'>$description ($file): " . ($exists ? 'EXISTS' : 'MISSING') . "</p>";
}

echo "</div>";

// Test 6: Configuration Check
echo "<div class='test-section'>";
echo "<h2>6. Configuration Check</h2>";

$requiredConstants = [
    'INTOUCHPAY_USERNAME' => 'IntouchPay Username',
    'INTOUCHPAY_PARTNER_PASSWORD' => 'IntouchPay Partner Password',
    'INTOUCHPAY_ACCOUNT_ID' => 'IntouchPay Account ID',
    'INTOUCHPAY_REQUEST_DEPOSIT_URL' => 'Request Deposit URL'
];

foreach ($requiredConstants as $constant => $description) {
    $defined = defined($constant);
    echo "<p class='" . ($defined ? 'success' : 'error') . "'>$description ($constant): " . ($defined ? 'DEFINED' : 'NOT DEFINED') . "</p>";
}

echo "</div>";

// Test 7: Sample Data Check
echo "<div class='test-section'>";
echo "<h2>7. Sample Data Check</h2>";

try {
    $dbService = DatabaseService::getInstance();
    
    // Check for withdrawal transactions
    $withdrawalCount = $dbService->count("SELECT COUNT(*) as total FROM transactions WHERE transaction_type = 'withdrawal'");
    echo "<p class='info'>Withdrawal Transactions in Database: $withdrawalCount</p>";
    
    // Check for payment transactions
    $paymentCount = $dbService->count("SELECT COUNT(*) as total FROM transactions WHERE transaction_type = 'payment'");
    echo "<p class='info'>Payment Transactions in Database: $paymentCount</p>";
    
    // Get recent transactions
    $recentTransactions = $dbService->query("SELECT * FROM recent_transactions LIMIT 5");
    echo "<p class='info'>Recent Transactions Sample:</p>";
    echo "<pre>" . json_encode($recentTransactions, JSON_PRETTY_PRINT) . "</pre>";
    
} catch (Exception $e) {
    echo "<p class='error'>Sample Data Error: " . $e->getMessage() . "</p>";
}

echo "</div>";

// Test Summary
echo "<div class='test-section'>";
echo "<h2>Test Summary</h2>";
echo "<p class='info'>Withdrawal system testing completed. Review the results above to ensure all components are working correctly.</p>";
echo "<p class='warning'><strong>Important:</strong> Before going live, test with actual small amounts to verify IntouchPay API integration.</p>";
echo "<p class='info'><strong>Next Steps:</strong></p>";
echo "<ul>";
echo "<li>Test the withdrawal form UI at <a href='withdrawal.html'>withdrawal.html</a></li>";
echo "<li>Test the dashboard with withdrawal data at <a href='dashboard.html'>dashboard.html</a></li>";
echo "<li>Verify withdrawal status checking functionality</li>";
echo "<li>Test error handling with invalid inputs</li>";
echo "</ul>";
echo "</div>";

?>
