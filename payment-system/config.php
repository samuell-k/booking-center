<?php
/**
 * IntouchPay API Configuration
 */

// IntouchPay API Configuration
define('INTOUCHPAY_USERNAME', 'testa');
define('INTOUCHPAY_PARTNER_PASSWORD', '+$J<wtZktTDs&-Mk("h5=<PH#Jf769P5/Z<*xbR~');
define('INTOUCHPAY_ACCOUNT_ID', '250160000011');

// API URLs
define('INTOUCHPAY_BASE_URL', 'https://www.intouchpay.co.rw/api/');
define('INTOUCHPAY_REQUEST_PAYMENT_URL', INTOUCHPAY_BASE_URL . 'requestpayment/');
define('INTOUCHPAY_REQUEST_DEPOSIT_URL', INTOUCHPAY_BASE_URL . 'requestdeposit/');
define('INTOUCHPAY_GET_TRANSACTION_STATUS_URL', INTOUCHPAY_BASE_URL . 'gettransactionstatus/');
define('INTOUCHPAY_GET_BALANCE_URL', INTOUCHPAY_BASE_URL . 'getbalance/');

// Your callback URL (update this to your actual domain)
define('CALLBACK_URL', 'http://localhost/payment-system/callback.php');

// Database configuration (if you want to store transactions)
define('DB_HOST', 'localhost');
define('DB_NAME', 'payment_system');
define('DB_USER', 'root');
define('DB_PASS', '');

// Include service classes
require_once __DIR__ . '/services/DatabaseService.php';
require_once __DIR__ . '/services/AmountService.php';
require_once __DIR__ . '/services/CacheService.php';
require_once __DIR__ . '/services/ErrorHandler.php';

// Initialize error handler
ErrorHandler::getInstance();

// Response codes mapping
$RESPONSE_CODES = [
    '1000' => 'Pending',
    '01' => 'Successful',
    '0002' => 'Missing Username Information',
    '0003' => 'Missing Password Information',
    '0004' => 'Missing Date Information',
    '0005' => 'Invalid Password',
    '0006' => 'User Does not have an intouchPay Account',
    '0007' => 'No such user',
    '0008' => 'Failed to Authenticate',
    '2100' => 'Amount should be greater than 0',
    '2200' => 'Amount below minimum',
    '2300' => 'Amount above maximum',
    '2400' => 'Duplicate Transaction ID',
    '2500' => 'Route Not Found',
    '2600' => 'Operation Not Allowed',
    '2700' => 'Failed to Complete Transaction',
    '1005' => 'Failed Due to Insufficient Funds',
    '1002' => 'Mobile number not registered on mobile money',
    '1008' => 'General Failure',
    '1200' => 'Invalid Number',
    '1100' => 'Number not supported on this Mobile money network',
    '1300' => 'Failed to Complete Transaction, Unknown Exception',
    '2001' => 'Request Successful'
];

/**
 * Generate password for IntouchPay API
 */
function generatePassword($username, $accountno, $partnerpassword, $timestamp) {
    $string = $username . $accountno . $partnerpassword . $timestamp;
    return hash('sha256', $string);
}

/**
 * Generate timestamp in required format
 */
function generateTimestamp() {
    return date('YmdHis');
}

/**
 * Generate unique transaction ID
 */
function generateTransactionId() {
    return 'TXN' . time() . rand(1000, 9999);
}

/**
 * Validate Rwandan phone number
 */
function validateRwandanPhoneNumber($phone) {
    // Must be exactly 12 numeric characters
    if (!preg_match('/^\d{12}$/', $phone)) {
        return false;
    }
    
    // Check if it starts with valid Rwandan prefixes
    $validPrefixes = [
        '250078', '250079', // MTN
        '250072', '250073', '250075', '250076', '250077', // Airtel
        '250781', '250782', '250783', '250784', '250785', '250786', '250787', '250788', '250789', // MTN
        '250720', '250721', '250722', '250723', '250724', '250725', '250726', '250727', '250728', '250729' // Airtel
    ];
    
    foreach ($validPrefixes as $prefix) {
        if (strpos($phone, $prefix) === 0) {
            return true;
        }
    }
    
    return false;
}

/**
 * Format phone number for display
 */
function formatPhoneNumber($phone) {
    if (strlen($phone) === 12) {
        return substr($phone, 0, 3) . ' ' . substr($phone, 3, 3) . ' ' . substr($phone, 6, 3) . ' ' . substr($phone, 9);
    }
    return $phone;
}

/**
 * Log function for debugging
 */
function logMessage($message, $type = 'INFO') {
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] [$type] $message" . PHP_EOL;
    file_put_contents('payment_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
}
?>
