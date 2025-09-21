<?php

require_once __DIR__ . '/../config.php';

/**
 * InTouch API Service
 * Handles all interactions with the InTouch Payment API
 */
class IntouchApiService {
    private static $instance = null;
    
    private function __construct() {
        // Private constructor for singleton
    }
    
    /**
     * Get singleton instance
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Get account balance from InTouch API
     *
     * According to InTouch API documentation, the getbalance API returns:
     * Success: {"balance":"0.0", "success": true}
     * Failure: {"success":false, "responsecode":"007", "message": "No such user"}
     */
    public function getAccountBalance() {
        try {
            $timestamp = generateTimestamp();
            $password = generatePassword(INTOUCHPAY_USERNAME, INTOUCHPAY_ACCOUNT_ID, INTOUCHPAY_PARTNER_PASSWORD, $timestamp);

            $data = [
                'username' => INTOUCHPAY_USERNAME,
                'timestamp' => $timestamp,
                'accountno' => INTOUCHPAY_ACCOUNT_ID,
                'password' => $password
            ];

            logMessage("Requesting account balance from InTouch API", 'INFO');

            $response = $this->makeApiCall(INTOUCHPAY_GET_BALANCE_URL, $data, 'POST', false);

            if ($response && isset($response['success']) && $response['success']) {
                $balance = isset($response['balance']) ? (float)$response['balance'] : 0;

                logMessage("Account balance retrieved successfully: {$balance} RWF", 'INFO');

                return [
                    'success' => true,
                    'balance' => $balance,
                    'currency' => 'RWF', // InTouch API uses RWF
                    'raw_response' => $response
                ];
            } else {
                $errorMsg = isset($response['message']) ? $response['message'] : 'Unknown error';
                $responseCode = isset($response['responsecode']) ? $response['responsecode'] : 'N/A';

                logMessage("Balance inquiry failed - Code: {$responseCode}, Message: {$errorMsg}", 'ERROR');

                return [
                    'success' => false,
                    'balance' => 0,
                    'currency' => 'RWF',
                    'error' => $errorMsg,
                    'response_code' => $responseCode,
                    'raw_response' => $response
                ];
            }

        } catch (Exception $e) {
            logMessage("Exception in getAccountBalance: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'balance' => 0,
                'currency' => 'RWF',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Get transaction status from InTouch API
     * Note: According to InTouch API documentation, the gettransactionstatus API
     * does NOT return amount information, only status, response code, and message.
     */
    public function getTransactionStatus($requestTransactionId, $intouchpayTransactionId) {
        try {
            $timestamp = generateTimestamp();
            $password = generatePassword(INTOUCHPAY_USERNAME, INTOUCHPAY_ACCOUNT_ID, INTOUCHPAY_PARTNER_PASSWORD, $timestamp);

            $data = [
                'username' => INTOUCHPAY_USERNAME,
                'timestamp' => $timestamp,
                'password' => $password,
                'requesttransactionid' => $requestTransactionId,
                'transactionid' => $intouchpayTransactionId
            ];

            $response = $this->makeApiCall(INTOUCHPAY_GET_TRANSACTION_STATUS_URL, $data, 'POST', true);

            if ($response && isset($response['success']) && $response['success']) {
                return [
                    'success' => true,
                    'status' => isset($response['status']) ? strtolower($response['status']) : 'unknown',
                    'response_code' => isset($response['responsecode']) ? $response['responsecode'] : null,
                    'message' => isset($response['message']) ? $response['message'] : null
                ];
            }

            return [
                'success' => false,
                'status' => 'unknown',
                'error' => 'Failed to get transaction status'
            ];

        } catch (Exception $e) {
            logMessage("Error getting transaction status for {$requestTransactionId}: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'status' => 'unknown',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Get transaction amount from InTouch API
     *
     * IMPORTANT: According to InTouch API documentation, the gettransactionstatus API
     * does NOT return amount information. The amount should be retrieved from your
     * local database where it was stored during the original payment request.
     *
     * This method returns 0 and logs a warning to indicate that amount retrieval
     * from the API is not supported.
     */
    public function getTransactionAmount($requestTransactionId, $intouchpayTransactionId) {
        logMessage("Warning: InTouch API does not provide transaction amounts in status responses. Using local database amount instead.", 'WARNING');
        return 0; // API doesn't provide amount information
    }
    
    /**
     * Make API call to InTouch
     */
    private function makeApiCall($url, $data, $method = 'POST', $jsonRequest = false) {
        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            
            if ($method === 'POST') {
                curl_setopt($ch, CURLOPT_POST, true);
                
                if ($jsonRequest) {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                        'Content-Type: application/json'
                    ]);
                } else {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
                    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                        'Content-Type: application/x-www-form-urlencoded'
                    ]);
                }
            }
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);
            
            if ($curlError) {
                logMessage("CURL Error in API call: " . $curlError, 'ERROR');
                return null;
            }
            
            if ($httpCode !== 200) {
                logMessage("HTTP Error in API call: " . $httpCode, 'ERROR');
                return null;
            }
            
            $responseData = json_decode($response, true);
            
            if (!$responseData) {
                logMessage("Invalid JSON response from API: " . $response, 'ERROR');
                return null;
            }
            
            return $responseData;
            
        } catch (Exception $e) {
            logMessage("Exception in API call: " . $e->getMessage(), 'ERROR');
            return null;
        }
    }
    
    /**
     * Request withdrawal (deposit to subscriber) using IntouchPay RequestDeposit API
     *
     * According to IntouchPay API documentation, the RequestDeposit API is used for
     * sending payments to subscribers (withdrawals from our perspective).
     */
    public function requestWithdrawal($phoneNumber, $amount, $reason = '', $includeWithdrawCharge = true) {
        try {
            $timestamp = generateTimestamp();
            $password = generatePassword(INTOUCHPAY_USERNAME, INTOUCHPAY_ACCOUNT_ID, INTOUCHPAY_PARTNER_PASSWORD, $timestamp);
            $requestTransactionId = generateTransactionId();

            $data = [
                'username' => INTOUCHPAY_USERNAME,
                'timestamp' => $timestamp,
                'amount' => $amount,
                'withdrawcharge' => $includeWithdrawCharge ? 1 : 0, // Set to 1 to include withdraw charges
                'reason' => $reason ?: 'Withdrawal request',
                'sid' => 1, // Service ID. Set to 1 for Bulk Payments as per documentation
                'password' => $password,
                'mobilephone' => $phoneNumber,
                'requesttransactionid' => $requestTransactionId,
                'accountno' => INTOUCHPAY_ACCOUNT_ID
            ];

            logMessage("Initiating withdrawal request: " . json_encode($data), 'INFO');

            $response = $this->makeApiCall(INTOUCHPAY_REQUEST_DEPOSIT_URL, $data, 'POST', false);

            logMessage("Withdrawal response: " . json_encode($response), 'INFO');

            if ($response && isset($response['success']) && $response['success']) {
                return [
                    'success' => true,
                    'request_transaction_id' => $requestTransactionId,
                    'reference_id' => isset($response['referenceid']) ? $response['referenceid'] : null,
                    'response_code' => isset($response['responsecode']) ? $response['responsecode'] : null,
                    'message' => 'Withdrawal request successful',
                    'raw_response' => $response
                ];
            } else {
                $errorMsg = 'Withdrawal request failed';
                $responseCode = isset($response['responsecode']) ? $response['responsecode'] : 'N/A';

                // Map response codes to user-friendly messages
                $errorMessages = [
                    '1100' => 'Error in Request',
                    '1101' => 'Service ID not Recognized',
                    '1102' => 'Invalid Mobile Phone Number',
                    '1103' => 'Payment Above Allowed Maximum',
                    '1104' => 'Payment Below Allowed Minimum',
                    '1105' => 'Network Not Supported',
                    '1106' => 'Operation Not Permitted',
                    '1107' => 'Payment Account Not Configured',
                    '1108' => 'Insufficient Account Balance',
                    '1110' => 'Duplicate Remit ID',
                    '2003' => 'Transaction Not Allowed',
                    '2102' => 'Subscriber Could not be Identified',
                    '2105' => 'Non Existent Mobile Account',
                    '2106' => 'Own Mobile Account Provided',
                    '2107' => 'Invalid Amount Format',
                    '2108' => 'Insufficient Funds on Source Account',
                    '2109' => 'Daily Limit Exceeded',
                    '2110' => 'Source Account Not Active',
                    '2111' => 'Mobile Account Not Active',
                    '2000' => 'General Failure',
                    '2500' => 'Service Failure',
                    '2510' => 'Service Temporarily Unavailable',
                    '2518' => 'Could Not Perform Operation',
                    '2520' => 'Incorrect Account Password',
                    '2522' => 'Invalid Amount',
                    '2525' => 'Resource Not Active',
                    '2600' => 'Network Failure - Request Timed Out',
                    '2800' => 'Deposit Channel Failure'
                ];

                if (isset($errorMessages[$responseCode])) {
                    $errorMsg = $errorMessages[$responseCode];
                }

                logMessage("Withdrawal failed - Code: {$responseCode}, Message: {$errorMsg}", 'ERROR');

                return [
                    'success' => false,
                    'request_transaction_id' => $requestTransactionId,
                    'response_code' => $responseCode,
                    'message' => $errorMsg,
                    'raw_response' => $response
                ];
            }

        } catch (Exception $e) {
            logMessage("Exception in requestWithdrawal: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'request_transaction_id' => null,
                'message' => 'System error: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Test API connectivity
     */
    public function testConnection() {
        $balance = $this->getAccountBalance();
        return $balance['success'];
    }
    
    /**
     * Get multiple transaction statuses in batch
     *
     * Note: This method only retrieves transaction statuses, not amounts.
     * According to InTouch API documentation, amounts are not provided
     * in the gettransactionstatus response.
     */
    public function getBatchTransactionStatuses($transactions) {
        $results = [];

        foreach ($transactions as $transaction) {
            $status = $this->getTransactionStatus(
                $transaction['request_transaction_id'],
                $transaction['intouchpay_transaction_id']
            );

            $results[$transaction['request_transaction_id']] = $status;

            // Add small delay to avoid overwhelming the API
            usleep(100000); // 0.1 second delay
        }

        return $results;
    }

    /**
     * Get multiple transaction amounts in batch
     *
     * DEPRECATED: This method is deprecated because InTouch API does not
     * provide amount information in transaction status responses.
     * Use local database amounts instead.
     */
    public function getBatchTransactionAmounts($transactions) {
        logMessage("Warning: getBatchTransactionAmounts is deprecated. InTouch API does not provide amount information.", 'WARNING');

        // Return empty amounts since API doesn't provide this information
        $results = [];
        foreach ($transactions as $transaction) {
            $results[$transaction['request_transaction_id']] = 0;
        }

        return $results;
    }
}

?>
