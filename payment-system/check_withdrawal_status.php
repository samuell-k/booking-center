<?php
/**
 * Withdrawal Status Checking Endpoint
 * Checks the status of withdrawal transactions using IntouchPay API
 */

require_once 'config.php';
require_once 'services/IntouchApiService.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get transaction ID from request
$transactionId = isset($_GET['transaction_id']) ? $_GET['transaction_id'] : (isset($_POST['transaction_id']) ? $_POST['transaction_id'] : '');

if (empty($transactionId)) {
    echo json_encode(['success' => false, 'message' => 'Transaction ID is required']);
    exit;
}

try {
    // Initialize services
    $dbService = DatabaseService::getInstance();
    $intouchApiService = IntouchApiService::getInstance();
    
    // First check database for transaction details
    $transaction = $dbService->getTransactionByRequestId($transactionId);
    
    if (!$transaction) {
        echo json_encode(['success' => false, 'message' => 'Transaction not found']);
        exit;
    }
    
    // Check if this is a withdrawal transaction
    if ($transaction['transaction_type'] !== 'withdrawal') {
        echo json_encode(['success' => false, 'message' => 'This endpoint is for withdrawal transactions only']);
        exit;
    }
    
    // If transaction is already completed (successful or failed), return stored status
    if (in_array($transaction['status'], ['successful', 'successfull', 'failed', 'failure'])) {
        echo json_encode([
            'success' => true,
            'status' => $transaction['status'],
            'response_code' => $transaction['response_code'],
            'status_desc' => $transaction['status_desc'],
            'reference_no' => $transaction['reference_no'],
            'amount' => (float)$transaction['amount'],
            'phone_number' => $transaction['phone_number'],
            'reason' => $transaction['reason'],
            'withdraw_charge' => (float)($transaction['withdraw_charge'] ?? 0),
            'created_at' => $transaction['created_at'],
            'completed_at' => $transaction['completed_at']
        ]);
        exit;
    }
    
    // If still pending and we have IntouchPay transaction ID, check with API
    $intouchpayTransactionId = $transaction['intouchpay_transaction_id'];
    
    if ($intouchpayTransactionId) {
        logMessage("Checking withdrawal status for transaction: {$transactionId}, IntouchPay ID: {$intouchpayTransactionId}");
        
        // Get status from IntouchPay API
        $statusResult = $intouchApiService->getTransactionStatus($transactionId, $intouchpayTransactionId);
        
        if ($statusResult['success']) {
            $apiStatus = strtolower($statusResult['status']);
            $responseCode = $statusResult['response_code'];
            $message = $statusResult['message'] ?? '';
            
            // Map API status to our status
            $mappedStatus = 'pending';
            if ($responseCode === '2001') {
                $mappedStatus = 'successful';
            } elseif (in_array($responseCode, ['1100', '1101', '1102', '1103', '1104', '1105', '1106', '1107', '1108', '1110', '2000', '2003', '2102', '2105', '2106', '2107', '2108', '2109', '2110', '2111', '2500', '2510', '2518', '2520', '2522', '2525', '2600', '2800'])) {
                $mappedStatus = 'failed';
            }
            
            // Update database if status changed
            if ($mappedStatus !== $transaction['status']) {
                $updateData = [
                    'status' => $mappedStatus,
                    'response_code' => $responseCode,
                    'status_desc' => $message
                ];
                
                if ($mappedStatus !== 'pending') {
                    $updateData['completed_at'] = date('Y-m-d H:i:s');
                }
                
                $dbService->updateTransaction($transaction['id'], $updateData);
                
                logMessage("Withdrawal status updated - ID: {$transactionId}, Status: {$mappedStatus}, Code: {$responseCode}");
                
                // Update session if exists
                session_start();
                if (isset($_SESSION['pending_withdrawals'][$transactionId])) {
                    $_SESSION['pending_withdrawals'][$transactionId]['status'] = $mappedStatus;
                    $_SESSION['pending_withdrawals'][$transactionId]['response_code'] = $responseCode;
                    $_SESSION['pending_withdrawals'][$transactionId]['status_desc'] = $message;
                }
            }
            
            echo json_encode([
                'success' => true,
                'status' => $mappedStatus,
                'response_code' => $responseCode,
                'status_desc' => $message,
                'amount' => (float)$transaction['amount'],
                'phone_number' => $transaction['phone_number'],
                'reason' => $transaction['reason'],
                'withdraw_charge' => (float)($transaction['withdraw_charge'] ?? 0),
                'created_at' => $transaction['created_at'],
                'completed_at' => $mappedStatus !== 'pending' ? date('Y-m-d H:i:s') : null
            ]);
            
        } else {
            // API call failed, return current database status
            echo json_encode([
                'success' => true,
                'status' => $transaction['status'],
                'response_code' => $transaction['response_code'],
                'status_desc' => 'Unable to verify status with payment gateway',
                'amount' => (float)$transaction['amount'],
                'phone_number' => $transaction['phone_number'],
                'reason' => $transaction['reason'],
                'withdraw_charge' => (float)($transaction['withdraw_charge'] ?? 0),
                'created_at' => $transaction['created_at'],
                'completed_at' => $transaction['completed_at']
            ]);
        }
        
    } else {
        // No IntouchPay transaction ID, return current status
        echo json_encode([
            'success' => true,
            'status' => $transaction['status'],
            'response_code' => $transaction['response_code'],
            'status_desc' => 'Withdrawal request submitted, awaiting processing',
            'amount' => (float)$transaction['amount'],
            'phone_number' => $transaction['phone_number'],
            'reason' => $transaction['reason'],
            'withdraw_charge' => (float)($transaction['withdraw_charge'] ?? 0),
            'created_at' => $transaction['created_at'],
            'completed_at' => $transaction['completed_at']
        ]);
    }
    
} catch (Exception $e) {
    logMessage("Error checking withdrawal status: " . $e->getMessage(), 'ERROR');
    echo json_encode([
        'success' => false,
        'message' => 'Error checking withdrawal status: ' . $e->getMessage()
    ]);
}

/**
 * Get withdrawal status description based on response code
 */
function getWithdrawalStatusDescription($responseCode) {
    $descriptions = [
        '2001' => 'Withdrawal completed successfully',
        '1100' => 'Error in withdrawal request',
        '1101' => 'Service ID not recognized',
        '1102' => 'Invalid mobile phone number',
        '1103' => 'Withdrawal amount above allowed maximum',
        '1104' => 'Withdrawal amount below allowed minimum',
        '1105' => 'Network not supported',
        '1106' => 'Operation not permitted',
        '1107' => 'Payment account not configured',
        '1108' => 'Insufficient account balance',
        '1110' => 'Duplicate withdrawal request',
        '2000' => 'General withdrawal failure',
        '2003' => 'Transaction not allowed',
        '2102' => 'Subscriber could not be identified',
        '2105' => 'Mobile account does not exist',
        '2106' => 'Cannot withdraw to own account',
        '2107' => 'Invalid amount format',
        '2108' => 'Insufficient funds on source account',
        '2109' => 'Daily withdrawal limit exceeded',
        '2110' => 'Source account not active',
        '2111' => 'Mobile account not active',
        '2500' => 'Service failure',
        '2510' => 'Service temporarily unavailable',
        '2518' => 'Could not perform operation',
        '2520' => 'Incorrect account password',
        '2522' => 'Invalid amount',
        '2525' => 'Resource not active',
        '2600' => 'Network failure - request timed out',
        '2800' => 'Deposit channel failure'
    ];
    
    return $descriptions[$responseCode] ?? 'Unknown status';
}

/**
 * Log withdrawal status check for audit purposes
 */
function logWithdrawalStatusCheck($transactionId, $status, $responseCode) {
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'transaction_id' => $transactionId,
        'status' => $status,
        'response_code' => $responseCode,
        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    logMessage("Withdrawal status check: " . json_encode($logData), 'INFO');
}

?>
