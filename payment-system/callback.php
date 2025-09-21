<?php
require_once 'config.php';

// Log all incoming requests for debugging
$rawInput = file_get_contents('php://input');
logMessage("Callback received: " . $rawInput);

// Set response headers
header('Content-Type: application/json');

// Get the callback data
$input = json_decode($rawInput, true);

if (!$input) {
    // Try to get from POST data
    $input = $_POST;
}

// Check if we have jsonpayload (as mentioned in the documentation)
if (isset($input['jsonpayload'])) {
    $callbackData = $input['jsonpayload'];
} else {
    $callbackData = $input;
}

logMessage("Processed callback data: " . json_encode($callbackData));

// Validate required fields
$requiredFields = ['requesttransactionid', 'transactionid', 'responsecode', 'status'];
foreach ($requiredFields as $field) {
    if (!isset($callbackData[$field])) {
        logMessage("Missing required field: " . $field, 'ERROR');
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required field: ' . $field]);
        exit;
    }
}

$requestTransactionId = $callbackData['requesttransactionid'];
$intouchpayTransactionId = $callbackData['transactionid'];
$responseCode = $callbackData['responsecode'];
$status = $callbackData['status'];
$statusDesc = isset($callbackData['statusdesc']) ? $callbackData['statusdesc'] : '';
$referenceNo = isset($callbackData['referenceno']) ? $callbackData['referenceno'] : '';

// Update transaction status in session
session_start();
if (isset($_SESSION['pending_transactions'][$requestTransactionId])) {
    $_SESSION['pending_transactions'][$requestTransactionId]['status'] = strtolower($status);
    $_SESSION['pending_transactions'][$requestTransactionId]['response_code'] = $responseCode;
    $_SESSION['pending_transactions'][$requestTransactionId]['status_desc'] = $statusDesc;
    $_SESSION['pending_transactions'][$requestTransactionId]['reference_no'] = $referenceNo;
    $_SESSION['pending_transactions'][$requestTransactionId]['completed_at'] = date('Y-m-d H:i:s');
    
    logMessage("Updated transaction status for ID: " . $requestTransactionId . " to " . $status);
} else {
    logMessage("Transaction not found in session: " . $requestTransactionId, 'WARNING');
}

// Update database with transaction status using service layer
try {
    $dbService = DatabaseService::getInstance();
    $cacheService = CacheService::getInstance();

    $updateData = [
        'status' => strtolower($status),
        'response_code' => $responseCode,
        'status_desc' => $statusDesc,
        'reference_no' => $referenceNo,
        'intouchpay_transaction_id' => $intouchpayTransactionId
    ];

    $dbService->updateTransactionStatus($requestTransactionId, $updateData);

    // Invalidate amount-related caches since transaction status changed
    $cacheService->invalidateAmountCaches();

    logMessage("Database updated via service layer for transaction: " . $requestTransactionId);
} catch (Exception $e) {
    logMessage("Service layer error: " . $e->getMessage(), 'ERROR');
}

// Send success response back to IntouchPay
echo json_encode([
    'message' => 'success',
    'success' => true,
    'request_id' => $requestTransactionId
]);

logMessage("Callback processed successfully for transaction: " . $requestTransactionId);
?>
