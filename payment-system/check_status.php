<?php
require_once 'config.php';

header('Content-Type: application/json');

// Enable CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get transaction ID from request
$transactionId = isset($_GET['transaction_id']) ? $_GET['transaction_id'] : (isset($_POST['transaction_id']) ? $_POST['transaction_id'] : '');

if (empty($transactionId)) {
    echo json_encode(['success' => false, 'message' => 'Transaction ID is required']);
    exit;
}

// First check session storage
session_start();
if (isset($_SESSION['pending_transactions'][$transactionId])) {
    $transaction = $_SESSION['pending_transactions'][$transactionId];
    
    // If status is not pending, return the stored status
    if ($transaction['status'] !== 'pending') {
        echo json_encode([
            'success' => true,
            'status' => $transaction['status'],
            'response_code' => isset($transaction['response_code']) ? $transaction['response_code'] : null,
            'status_desc' => isset($transaction['status_desc']) ? $transaction['status_desc'] : null,
            'reference_no' => isset($transaction['reference_no']) ? $transaction['reference_no'] : null,
            'amount' => $transaction['amount'],
            'phone_number' => $transaction['phone_number']
        ]);
        exit;
    }
    
    // If still pending, check with IntouchPay API
    $intouchpayTransactionId = $transaction['intouchpay_transaction_id'];
    
    if ($intouchpayTransactionId) {
        // Generate required parameters for status check
        $timestamp = generateTimestamp();
        $password = generatePassword(INTOUCHPAY_USERNAME, INTOUCHPAY_ACCOUNT_ID, INTOUCHPAY_PARTNER_PASSWORD, $timestamp);
        
        $data = [
            'username' => INTOUCHPAY_USERNAME,
            'timestamp' => $timestamp,
            'password' => $password,
            'requesttransactionid' => $transactionId,
            'transactionid' => $intouchpayTransactionId
        ];
        
        logMessage("Checking transaction status: " . json_encode($data));
        
        // Make API call to check status
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, INTOUCHPAY_GET_TRANSACTION_STATUS_URL);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        
        if ($curlError) {
            logMessage("CURL Error in status check: " . $curlError, 'ERROR');
        } else if ($httpCode === 200) {
            $responseData = json_decode($response, true);
            logMessage("Status check response: " . json_encode($responseData));
            
            if ($responseData && isset($responseData['success']) && $responseData['success']) {
                // Update session with new status
                $newStatus = isset($responseData['status']) ? strtolower($responseData['status']) : 'pending';
                $_SESSION['pending_transactions'][$transactionId]['status'] = $newStatus;
                $_SESSION['pending_transactions'][$transactionId]['response_code'] = isset($responseData['responsecode']) ? $responseData['responsecode'] : null;
                
                echo json_encode([
                    'success' => true,
                    'status' => $newStatus,
                    'response_code' => isset($responseData['responsecode']) ? $responseData['responsecode'] : null,
                    'message' => isset($responseData['message']) ? $responseData['message'] : null,
                    'amount' => $transaction['amount'],
                    'phone_number' => $transaction['phone_number']
                ]);
                exit;
            }
        }
    }
    
    // Return pending status if API call failed or no response
    echo json_encode([
        'success' => true,
        'status' => 'pending',
        'message' => 'Transaction is still pending',
        'amount' => $transaction['amount'],
        'phone_number' => $transaction['phone_number']
    ]);
    
} else {
    // Transaction not found in session
    echo json_encode([
        'success' => false,
        'message' => 'Transaction not found'
    ]);
}
?>
