<?php
/**
 * Withdrawal Processing Endpoint
 * Handles withdrawal requests using IntouchPay RequestDeposit API
 */

require_once 'config.php';
require_once 'services/IntouchApiService.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // Validate required fields
    if (!isset($input['phone_number']) || !isset($input['amount'])) {
        throw new Exception('Phone number and amount are required');
    }
    
    $phoneNumber = trim($input['phone_number']);
    $amount = floatval($input['amount']);
    $reason = isset($input['reason']) ? trim($input['reason']) : 'Withdrawal request';
    
    // Validate phone number
    if (!validateRwandanPhoneNumber($phoneNumber)) {
        throw new Exception('Invalid Rwandan phone number. Must be 12 digits starting with valid prefix.');
    }
    
    // Validate amount
    if ($amount < 100) {
        throw new Exception('Minimum withdrawal amount is 100 RWF');
    }
    
    if ($amount > 1000000) {
        throw new Exception('Maximum withdrawal amount is 1,000,000 RWF');
    }
    
    logMessage("Processing withdrawal request - Phone: {$phoneNumber}, Amount: {$amount} RWF, Reason: {$reason}");
    
    // Initialize IntouchPay API service
    $intouchApiService = IntouchApiService::getInstance();
    
    // Request withdrawal using IntouchPay RequestDeposit API
    $withdrawalResult = $intouchApiService->requestWithdrawal($phoneNumber, $amount, $reason, true);
    
    if (!$withdrawalResult['success']) {
        logMessage("Withdrawal request failed: " . $withdrawalResult['message'], 'ERROR');
        echo json_encode([
            'success' => false,
            'message' => $withdrawalResult['message'],
            'response_code' => $withdrawalResult['response_code'] ?? null
        ]);
        exit;
    }
    
    // Store withdrawal transaction in database
    try {
        $dbService = DatabaseService::getInstance();
        $cacheService = CacheService::getInstance();
        
        $requestTransactionId = $withdrawalResult['request_transaction_id'];
        $responseCode = $withdrawalResult['response_code'];
        $referenceId = $withdrawalResult['reference_id'];
        
        // Determine status based on response code
        $status = 'pending';
        if ($responseCode === '2001') {
            $status = 'successful';
        } elseif (in_array($responseCode, ['1100', '1101', '1102', '1103', '1104', '1105', '1106', '1107', '1108', '1110', '2000', '2003', '2102', '2105', '2106', '2107', '2108', '2109', '2110', '2111', '2500', '2510', '2518', '2520', '2522', '2525', '2600', '2800'])) {
            $status = 'failed';
        }
        
        $transactionData = [
            'request_transaction_id' => $requestTransactionId,
            'intouchpay_transaction_id' => $referenceId,
            'phone_number' => $phoneNumber,
            'amount' => $amount,
            'transaction_type' => 'withdrawal',
            'status' => $status,
            'response_code' => $responseCode,
            'reason' => $reason,
            'user_name' => isset($input['user_name']) ? trim($input['user_name']) : null
        ];
        
        $transactionId = $dbService->insertTransaction($transactionData);
        
        if ($transactionId) {
            logMessage("Withdrawal transaction stored successfully - ID: {$transactionId}, Request ID: {$requestTransactionId}");
            
            // Clear cache to ensure fresh data
            $cacheService->clearCache();
            
            // Update user statistics if user_name is provided
            if (!empty($transactionData['user_name'])) {
                $dbService->updateUserStats($phoneNumber, $transactionData['user_name'], $amount, 'withdrawal');
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Withdrawal request submitted successfully',
                'transaction_id' => $transactionId,
                'request_transaction_id' => $requestTransactionId,
                'reference_id' => $referenceId,
                'status' => $status,
                'response_code' => $responseCode
            ]);
            
        } else {
            logMessage("Failed to store withdrawal transaction in database", 'ERROR');
            echo json_encode([
                'success' => false,
                'message' => 'Failed to store transaction. Please contact support.'
            ]);
        }
        
    } catch (Exception $dbError) {
        logMessage("Database error during withdrawal processing: " . $dbError->getMessage(), 'ERROR');
        echo json_encode([
            'success' => false,
            'message' => 'Database error. Please try again later.'
        ]);
    }
    
} catch (Exception $e) {
    logMessage("Error processing withdrawal: " . $e->getMessage(), 'ERROR');
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

/**
 * Store withdrawal transaction in session for tracking
 */
function storeWithdrawalInSession($requestTransactionId, $phoneNumber, $amount, $reason, $referenceId = null) {
    session_start();
    
    if (!isset($_SESSION['pending_withdrawals'])) {
        $_SESSION['pending_withdrawals'] = [];
    }
    
    $_SESSION['pending_withdrawals'][$requestTransactionId] = [
        'phone_number' => $phoneNumber,
        'amount' => $amount,
        'reason' => $reason,
        'reference_id' => $referenceId,
        'timestamp' => time(),
        'status' => 'pending'
    ];
}

/**
 * Validate withdrawal amount limits
 */
function validateWithdrawalLimits($amount) {
    $minAmount = 100;
    $maxAmount = 1000000; // 1 million RWF
    
    if ($amount < $minAmount) {
        return ['valid' => false, 'message' => "Minimum withdrawal amount is {$minAmount} RWF"];
    }
    
    if ($amount > $maxAmount) {
        return ['valid' => false, 'message' => "Maximum withdrawal amount is " . number_format($maxAmount) . " RWF"];
    }
    
    return ['valid' => true];
}

/**
 * Check if user has sufficient balance (if balance checking is implemented)
 */
function checkUserBalance($phoneNumber, $amount) {
    // This would require implementing a user balance system
    // For now, we'll assume the IntouchPay API will handle balance validation
    return true;
}

/**
 * Log withdrawal attempt for audit purposes
 */
function logWithdrawalAttempt($phoneNumber, $amount, $reason, $success, $message = '') {
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'phone_number' => $phoneNumber,
        'amount' => $amount,
        'reason' => $reason,
        'success' => $success,
        'message' => $message,
        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    logMessage("Withdrawal attempt: " . json_encode($logData), $success ? 'INFO' : 'WARNING');
}

/**
 * Send withdrawal notification (placeholder for future implementation)
 */
function sendWithdrawalNotification($phoneNumber, $amount, $status) {
    // Placeholder for SMS/email notification system
    // This could be implemented to notify users about withdrawal status
    logMessage("Withdrawal notification sent to {$phoneNumber} - Amount: {$amount} RWF, Status: {$status}", 'INFO');
}

?>
