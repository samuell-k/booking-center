<?php
require_once 'config.php';

header('Content-Type: application/json');

// Enable CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

// Validate required fields
$phoneNumber = isset($input['phone_number']) ? trim($input['phone_number']) : '';
$amount = isset($input['amount']) ? floatval($input['amount']) : 0;

if (empty($phoneNumber)) {
    echo json_encode(['success' => false, 'message' => 'Phone number is required']);
    exit;
}

if ($amount <= 0) {
    echo json_encode(['success' => false, 'message' => 'Amount must be greater than 0']);
    exit;
}

if ($amount < 100) {
    echo json_encode(['success' => false, 'message' => 'Amount must be at least 100 RWF']);
    exit;
}

// Validate phone number
if (!validateRwandanPhoneNumber($phoneNumber)) {
    echo json_encode(['success' => false, 'message' => 'Invalid Rwandan phone number']);
    exit;
}

// Generate required parameters
$timestamp = generateTimestamp();
$requestTransactionId = generateTransactionId();
$password = generatePassword(INTOUCHPAY_USERNAME, INTOUCHPAY_ACCOUNT_ID, INTOUCHPAY_PARTNER_PASSWORD, $timestamp);

// Prepare data for IntouchPay API
$data = [
    'username' => INTOUCHPAY_USERNAME,
    'timestamp' => $timestamp,
    'amount' => $amount,
    'password' => $password,
    'mobilephone' => $phoneNumber,
    'requesttransactionid' => $requestTransactionId,
    'accountno' => INTOUCHPAY_ACCOUNT_ID,
    'callbackurl' => CALLBACK_URL
];

logMessage("Initiating payment request: " . json_encode($data));

// Make API call to IntouchPay
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, INTOUCHPAY_REQUEST_PAYMENT_URL);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    logMessage("CURL Error: " . $curlError, 'ERROR');
    echo json_encode(['success' => false, 'message' => 'Network error occurred']);
    exit;
}

if ($httpCode !== 200) {
    logMessage("HTTP Error: " . $httpCode, 'ERROR');
    echo json_encode(['success' => false, 'message' => 'Payment service unavailable']);
    exit;
}

// Parse response
$responseData = json_decode($response, true);

if (!$responseData) {
    logMessage("Invalid JSON response: " . $response, 'ERROR');
    echo json_encode(['success' => false, 'message' => 'Invalid response from payment service']);
    exit;
}

logMessage("Payment response: " . json_encode($responseData));

// Store transaction in database and session for tracking
session_start();
$_SESSION['pending_transactions'][$requestTransactionId] = [
    'phone_number' => $phoneNumber,
    'amount' => $amount,
    'timestamp' => $timestamp,
    'intouchpay_transaction_id' => isset($responseData['transactionid']) ? $responseData['transactionid'] : null,
    'status' => 'pending'
];

// Store in database using service layer
try {
    $dbService = DatabaseService::getInstance();
    $cacheService = CacheService::getInstance();

    $userName = isset($input['user_name']) ? trim($input['user_name']) : null;
    $responseCode = isset($responseData['responsecode']) ? $responseData['responsecode'] : null;
    $intouchpayTransactionId = isset($responseData['transactionid']) ? $responseData['transactionid'] : null;

    $transactionData = [
        'request_transaction_id' => $requestTransactionId,
        'intouchpay_transaction_id' => $intouchpayTransactionId,
        'phone_number' => $phoneNumber,
        'amount' => $amount,
        'status' => 'pending',
        'response_code' => $responseCode,
        'user_name' => $userName
    ];

    $dbService->storeTransaction($transactionData);

    // Invalidate amount-related caches since we added a new transaction
    $cacheService->invalidateAmountCaches();

    logMessage("Transaction stored via service layer: " . $requestTransactionId);

} catch (Exception $e) {
    logMessage("Service layer error: " . $e->getMessage(), 'ERROR');
    // Continue execution even if database storage fails
}

// Return response to frontend
if (isset($responseData['success']) && $responseData['success']) {
    echo json_encode([
        'success' => true,
        'message' => 'Payment request sent successfully',
        'transaction_id' => $requestTransactionId,
        'intouchpay_transaction_id' => isset($responseData['transactionid']) ? $responseData['transactionid'] : null,
        'status' => isset($responseData['status']) ? $responseData['status'] : 'Pending',
        'response_code' => isset($responseData['responsecode']) ? $responseData['responsecode'] : null
    ]);
} else {
    $errorMessage = isset($responseData['message']) ? $responseData['message'] : 'Payment request failed';
    $responseCode = isset($responseData['responsecode']) ? $responseData['responsecode'] : 'unknown';
    
    echo json_encode([
        'success' => false,
        'message' => $errorMessage,
        'response_code' => $responseCode
    ]);
}
?>
