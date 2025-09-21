<?php

require_once __DIR__ . '/DatabaseService.php';
require_once __DIR__ . '/CacheService.php';
require_once __DIR__ . '/IntouchApiService.php';

/**
 * Amount Service Class
 * 
 * Handles all amount-related operations including calculations,
 * aggregations, formatting, and validation. This service ensures
 * all amount operations go through the API layer.
 */
class AmountService {
    private $db;
    private $cache;
    private $intouchApi;
    private static $instance = null;

    /**
     * Private constructor for singleton pattern
     */
    private function __construct() {
        $this->db = DatabaseService::getInstance();
        $this->cache = CacheService::getInstance();
        $this->intouchApi = IntouchApiService::getInstance();
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
     * Get comprehensive amount summary
     */
    public function getAmountSummary() {
        $cacheKey = $this->cache->getAmountSummaryCacheKey();
        $ttl = $this->cache->getTTLForDataType('summary');

        return $this->cache->remember($cacheKey, function() {
            try {
                // Get summary from database view
                $summary = $this->db->getDashboardSummary();

                // Get today's statistics
                $todayStats = $this->db->getTodayStats();

                // Get actual account balance from InTouch API
                $actualBalance = $this->getActualBalanceFromAPI();

                // Use actual balance from InTouch API as the primary amount source
                if ($actualBalance['success']) {
                    $summary['total_amount'] = $actualBalance['balance'];
                    $summary['actual_balance'] = $actualBalance['balance'];
                    $summary['balance_currency'] = $actualBalance['currency'];
                    $summary['balance_last_updated'] = date('Y-m-d H:i:s');

                    // For today's amount, we'll use a portion of the balance or local calculation
                    $todayStats['today_amount'] = $this->getTodayAmountEstimate($actualBalance['balance']);
                } else {
                    // Fallback to local amounts if balance inquiry fails
                    $verifiedAmounts = $this->getVerifiedAmountsFromAPI();
                    $summary['total_amount'] = $verifiedAmounts['total_amount'];
                    $todayStats['today_amount'] = $verifiedAmounts['today_amount'];
                    $summary['actual_balance'] = 0;
                    $summary['balance_currency'] = 'RWF';
                    $summary['balance_last_updated'] = null;
                }

                // Calculate success rate
                $successRate = $summary['total_transactions'] > 0
                    ? round(($summary['successful_transactions'] / $summary['total_transactions']) * 100, 1)
                    : 0;

                return [
                    'total_transactions' => (int)$summary['total_transactions'],
                    'successful_transactions' => (int)$summary['successful_transactions'],
                    'failed_transactions' => (int)$summary['failed_transactions'],
                    'pending_transactions' => (int)$summary['pending_transactions'],
                    'total_amount' => (float)$summary['total_amount'],
                    'successful_amount' => (float)$summary['successful_amount'],
                    'average_amount' => (float)$summary['average_amount'],
                    'success_rate' => $successRate,
                    'today_transactions' => (int)$todayStats['today_transactions'],
                    'today_successful' => (int)$todayStats['today_successful'],
                    'today_amount' => (float)$todayStats['today_amount'],
                    'last_transaction_date' => $summary['last_transaction_date']
                ];
            } catch (Exception $e) {
                logMessage("Error getting amount summary: " . $e->getMessage(), 'ERROR');
                throw new Exception("Failed to retrieve amount summary");
            }
        }, $ttl);
    }
    
    /**
     * Get amount statistics for charts and analytics
     */
    public function getAmountStatistics($days = 7) {
        $cacheKey = $this->cache->getAmountStatsCacheKey($days);
        $ttl = $this->cache->getTTLForDataType('stats');

        return $this->cache->remember($cacheKey, function() use ($days) {
            try {
                // Get daily statistics
                $dailyStats = $this->db->getDailyStats($days);

                // Get status distribution
                $statusStats = $this->db->getStatusDistribution();

                // Process daily stats to ensure all amounts are properly formatted
                foreach ($dailyStats as &$stat) {
                    $stat['amount'] = (float)$stat['amount'];
                    $stat['total'] = (int)$stat['total'];
                    $stat['successful'] = (int)$stat['successful'];
                    $stat['failed'] = (int)$stat['failed'];
                }

                // Process status stats
                foreach ($statusStats as &$stat) {
                    $stat['amount'] = (float)$stat['amount'];
                    $stat['count'] = (int)$stat['count'];
                }

                return [
                    'daily_stats' => $dailyStats,
                    'status_distribution' => $statusStats
                ];
            } catch (Exception $e) {
                logMessage("Error getting amount statistics: " . $e->getMessage(), 'ERROR');
                throw new Exception("Failed to retrieve amount statistics");
            }
        }, $ttl);
    }
    
    /**
     * Calculate total amount for specific criteria
     */
    public function calculateTotalAmount($filters = []) {
        try {
            $whereConditions = [];
            $params = [];
            
            // Build WHERE clause based on filters
            if (!empty($filters['status'])) {
                if (is_array($filters['status'])) {
                    $placeholders = str_repeat('?,', count($filters['status']) - 1) . '?';
                    $whereConditions[] = "status IN ($placeholders)";
                    $params = array_merge($params, $filters['status']);
                } else {
                    $whereConditions[] = "status = ?";
                    $params[] = $filters['status'];
                }
            }
            
            if (!empty($filters['date_from'])) {
                $whereConditions[] = "DATE(created_at) >= ?";
                $params[] = $filters['date_from'];
            }
            
            if (!empty($filters['date_to'])) {
                $whereConditions[] = "DATE(created_at) <= ?";
                $params[] = $filters['date_to'];
            }
            
            if (!empty($filters['phone_number'])) {
                $whereConditions[] = "phone_number = ?";
                $params[] = $filters['phone_number'];
            }
            
            $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
            
            $sql = "
                SELECT 
                    COUNT(*) as transaction_count,
                    SUM(amount) as total_amount,
                    AVG(amount) as average_amount,
                    MIN(amount) as min_amount,
                    MAX(amount) as max_amount
                FROM transactions 
                $whereClause
            ";
            
            $result = $this->db->fetchOne($sql, $params);

            // For successful transactions, use balance inquiry if no specific filters
            $actualTotal = $result['total_amount'];
            if (!empty($filters['status']) &&
                (in_array('successful', (array)$filters['status']) || in_array('successfull', (array)$filters['status']))) {

                // If no date filters, use account balance as it represents total successful amount
                if (empty($filters['date_from']) && empty($filters['date_to']) && empty($filters['phone_number'])) {
                    $balanceResult = $this->getActualBalanceFromAPI();
                    if ($balanceResult['success']) {
                        $actualTotal = $balanceResult['balance'];
                    } else {
                        $verifiedAmounts = $this->getFilteredVerifiedAmounts($filters);
                        $actualTotal = $verifiedAmounts['total_amount'];
                    }
                } else {
                    // Use filtered verification for specific date ranges or phone numbers
                    $verifiedAmounts = $this->getFilteredVerifiedAmounts($filters);
                    $actualTotal = $verifiedAmounts['total_amount'];
                }
            }

            return [
                'transaction_count' => (int)$result['transaction_count'],
                'total_amount' => (float)($actualTotal ?? 0),
                'average_amount' => (float)($result['average_amount'] ?? 0),
                'min_amount' => (float)($result['min_amount'] ?? 0),
                'max_amount' => (float)($result['max_amount'] ?? 0)
            ];
        } catch (Exception $e) {
            logMessage("Error calculating total amount: " . $e->getMessage(), 'ERROR');
            throw new Exception("Failed to calculate total amount");
        }
    }
    
    /**
     * Get amount breakdown by status
     */
    public function getAmountBreakdownByStatus() {
        try {
            $sql = "
                SELECT 
                    status,
                    COUNT(*) as count,
                    SUM(amount) as total_amount,
                    AVG(amount) as average_amount
                FROM transactions 
                GROUP BY status
                ORDER BY total_amount DESC
            ";
            
            $results = $this->db->fetchAll($sql);
            
            foreach ($results as &$result) {
                $result['count'] = (int)$result['count'];
                $result['total_amount'] = (float)$result['total_amount'];
                $result['average_amount'] = (float)$result['average_amount'];
            }
            
            return $results;
        } catch (Exception $e) {
            logMessage("Error getting amount breakdown: " . $e->getMessage(), 'ERROR');
            throw new Exception("Failed to get amount breakdown");
        }
    }
    
    /**
     * Get monthly amount trends
     */
    public function getMonthlyAmountTrends($months = 12) {
        try {
            $sql = "
                SELECT 
                    DATE_FORMAT(created_at, '%Y-%m') as month,
                    COUNT(*) as transaction_count,
                    SUM(amount) as total_amount,
                    AVG(amount) as average_amount,
                    SUM(CASE WHEN status IN ('successful', 'successfull') THEN amount ELSE 0 END) as successful_amount
                FROM transactions 
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month ASC
            ";
            
            $results = $this->db->fetchAll($sql, [$months]);
            
            foreach ($results as &$result) {
                $result['transaction_count'] = (int)$result['transaction_count'];
                $result['total_amount'] = (float)$result['total_amount'];
                $result['average_amount'] = (float)$result['average_amount'];
                $result['successful_amount'] = (float)$result['successful_amount'];
            }
            
            return $results;
        } catch (Exception $e) {
            logMessage("Error getting monthly trends: " . $e->getMessage(), 'ERROR');
            throw new Exception("Failed to get monthly amount trends");
        }
    }
    
    /**
     * Validate amount according to business rules
     */
    public function validateAmount($amount) {
        $errors = [];
        
        // Convert to float
        $amount = (float)$amount;
        
        // Check if amount is positive
        if ($amount <= 0) {
            $errors[] = 'Amount must be greater than 0';
        }
        
        // Check minimum amount (100 RWF)
        if ($amount < 100) {
            $errors[] = 'Amount must be at least 100 RWF';
        }
        
        // Check maximum amount (optional - can be configured)
        $maxAmount = 10000000; // 10 million RWF
        if ($amount > $maxAmount) {
            $errors[] = "Amount cannot exceed " . $this->formatCurrency($maxAmount);
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'amount' => $amount
        ];
    }
    
    /**
     * Format amount as Rwandan Francs
     */
    public function formatCurrency($amount) {
        return number_format((float)$amount, 0, '.', ',') . ' RWF';
    }
    
    /**
     * Format amount for API responses
     */
    public function formatAmountForAPI($amount) {
        return (float)$amount;
    }
    
    /**
     * Convert amount to different currencies (if needed in future)
     */
    public function convertAmount($amount, $fromCurrency = 'RWF', $toCurrency = 'USD') {
        // For now, just return the amount as RWF is the primary currency
        // This method can be extended to support currency conversion
        if ($fromCurrency === $toCurrency) {
            return (float)$amount;
        }
        
        // Placeholder for future currency conversion logic
        throw new Exception("Currency conversion not implemented yet");
    }
    
    /**
     * Get amount statistics for a specific time period
     */
    public function getAmountStatsForPeriod($startDate, $endDate) {
        try {
            $sql = "
                SELECT
                    COUNT(*) as transaction_count,
                    SUM(amount) as total_amount,
                    AVG(amount) as average_amount,
                    MIN(amount) as min_amount,
                    MAX(amount) as max_amount,
                    SUM(CASE WHEN status IN ('successful', 'successfull') THEN amount ELSE 0 END) as successful_amount,
                    SUM(CASE WHEN status IN ('failed', 'failure') THEN amount ELSE 0 END) as failed_amount,
                    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount
                FROM transactions
                WHERE DATE(created_at) BETWEEN ? AND ?
            ";

            $result = $this->db->fetchOne($sql, [$startDate, $endDate]);

            return [
                'period' => ['start' => $startDate, 'end' => $endDate],
                'transaction_count' => (int)$result['transaction_count'],
                'total_amount' => (float)($result['total_amount'] ?? 0),
                'average_amount' => (float)($result['average_amount'] ?? 0),
                'min_amount' => (float)($result['min_amount'] ?? 0),
                'max_amount' => (float)($result['max_amount'] ?? 0),
                'successful_amount' => (float)($result['successful_amount'] ?? 0),
                'failed_amount' => (float)($result['failed_amount'] ?? 0),
                'pending_amount' => (float)($result['pending_amount'] ?? 0)
            ];
        } catch (Exception $e) {
            logMessage("Error getting period stats: " . $e->getMessage(), 'ERROR');
            throw new Exception("Failed to get amount statistics for period");
        }
    }

    /**
     * Get verified amounts for successful transactions
     *
     * Since InTouch API doesn't provide amount information in status responses,
     * this method uses local database amounts but verifies transaction status
     * with the API to ensure accuracy.
     */
    private function getVerifiedAmountsFromAPI() {
        try {
            // Get successful transactions that need API verification
            $sql = "
                SELECT
                    request_transaction_id,
                    intouchpay_transaction_id,
                    amount as local_amount,
                    created_at,
                    status as local_status
                FROM transactions
                WHERE status IN ('successful', 'successfull')
                AND intouchpay_transaction_id IS NOT NULL
                ORDER BY created_at DESC
                LIMIT 50
            ";

            $transactions = $this->db->fetchAll($sql);
            $totalAmount = 0;
            $todayAmount = 0;
            $today = date('Y-m-d');

            // For performance and reliability, use local amounts but optionally verify with API
            // Only verify a small sample to avoid overwhelming the API
            $sampleSize = min(5, count($transactions));
            $verifiedStatuses = [];

            if ($sampleSize > 0) {
                $sampleTransactions = array_slice($transactions, 0, $sampleSize);
                $verifiedStatuses = $this->intouchApi->getBatchTransactionStatuses($sampleTransactions);
            }

            foreach ($transactions as $transaction) {
                $requestId = $transaction['request_transaction_id'];
                $localAmount = (float)$transaction['local_amount'];
                $includeAmount = false;

                // Check if we have API verification for this transaction
                if (isset($verifiedStatuses[$requestId])) {
                    $apiStatus = $verifiedStatuses[$requestId];

                    // Include amount if API confirms success OR if API call failed (trust local)
                    if ($apiStatus['success'] &&
                        (strtolower($apiStatus['status']) === 'successful' ||
                         strtolower($apiStatus['status']) === 'successfull' ||
                         $apiStatus['response_code'] === '01')) {
                        $includeAmount = true;
                    } else if (!$apiStatus['success']) {
                        // API call failed, trust local status
                        logMessage("API verification failed for {$requestId}, trusting local status", 'INFO');
                        $includeAmount = true;
                    }
                } else {
                    // No API verification attempted or available, trust local status
                    $includeAmount = true;
                }

                if ($includeAmount) {
                    $totalAmount += $localAmount;

                    // Check if transaction is from today
                    if (date('Y-m-d', strtotime($transaction['created_at'])) === $today) {
                        $todayAmount += $localAmount;
                    }
                }
            }

            return [
                'total_amount' => $totalAmount,
                'today_amount' => $todayAmount
            ];

        } catch (Exception $e) {
            logMessage("Error verifying amounts with API: " . $e->getMessage(), 'ERROR');
            // Fallback to local database amounts
            return $this->getLocalAmountSummary();
        }
    }

    /**
     * Get amount summary from local database only
     */
    private function getLocalAmountSummary() {
        try {
            $sql = "
                SELECT
                    SUM(amount) as total_amount,
                    SUM(CASE WHEN DATE(created_at) = CURDATE() THEN amount ELSE 0 END) as today_amount
                FROM transactions
                WHERE status IN ('successful', 'successfull')
            ";

            $result = $this->db->fetchOne($sql);

            return [
                'total_amount' => (float)($result['total_amount'] ?? 0),
                'today_amount' => (float)($result['today_amount'] ?? 0)
            ];

        } catch (Exception $e) {
            logMessage("Error getting local amount summary: " . $e->getMessage(), 'ERROR');
            return [
                'total_amount' => 0,
                'today_amount' => 0
            ];
        }
    }

    /**
     * Get actual account balance from InTouch API
     */
    private function getActualBalanceFromAPI() {
        try {
            $balanceResult = $this->intouchApi->getAccountBalance();

            if ($balanceResult['success']) {
                logMessage("Successfully retrieved account balance: " . $balanceResult['balance'] . " " . $balanceResult['currency'], 'INFO');

                return [
                    'success' => true,
                    'balance' => (float)$balanceResult['balance'],
                    'currency' => $balanceResult['currency']
                ];
            } else {
                logMessage("Failed to retrieve account balance: " . $balanceResult['error'], 'WARNING');
                return [
                    'success' => false,
                    'balance' => 0,
                    'currency' => 'RWF',
                    'error' => $balanceResult['error']
                ];
            }
        } catch (Exception $e) {
            logMessage("Error getting account balance: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'balance' => 0,
                'currency' => 'RWF',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Estimate today's amount based on account balance and local transactions
     */
    private function getTodayAmountEstimate($totalBalance) {
        try {
            // Get today's successful transactions from local database
            $sql = "
                SELECT SUM(amount) as today_local_amount
                FROM transactions
                WHERE DATE(created_at) = CURDATE()
                AND status IN ('successful', 'successfull')
            ";

            $result = $this->db->fetchOne($sql);
            $todayLocalAmount = (float)($result['today_local_amount'] ?? 0);

            // If we have local transactions for today, use that amount
            // Otherwise, estimate based on a percentage of total balance
            if ($todayLocalAmount > 0) {
                return $todayLocalAmount;
            } else {
                // No transactions today, return 0
                return 0;
            }

        } catch (Exception $e) {
            logMessage("Error estimating today's amount: " . $e->getMessage(), 'ERROR');
            return 0;
        }
    }

    /**
     * Get transaction amount from InTouch API
     */
    private function getTransactionAmountFromAPI($requestTransactionId, $intouchpayTransactionId) {
        return $this->intouchApi->getTransactionAmount($requestTransactionId, $intouchpayTransactionId);
    }

    /**
     * Get filtered verified amounts
     *
     * Uses local database amounts but verifies transaction status with API
     */
    private function getFilteredVerifiedAmounts($filters = []) {
        try {
            $whereConditions = [];
            $params = [];

            // Build WHERE clause based on filters
            $whereConditions[] = "status IN ('successful', 'successfull')";
            $whereConditions[] = "intouchpay_transaction_id IS NOT NULL";

            if (!empty($filters['date_from'])) {
                $whereConditions[] = "DATE(created_at) >= ?";
                $params[] = $filters['date_from'];
            }

            if (!empty($filters['date_to'])) {
                $whereConditions[] = "DATE(created_at) <= ?";
                $params[] = $filters['date_to'];
            }

            if (!empty($filters['phone_number'])) {
                $whereConditions[] = "phone_number = ?";
                $params[] = $filters['phone_number'];
            }

            $whereClause = "WHERE " . implode(" AND ", $whereConditions);

            $sql = "
                SELECT
                    request_transaction_id,
                    intouchpay_transaction_id,
                    amount as local_amount
                FROM transactions
                $whereClause
                ORDER BY created_at DESC
                LIMIT 30
            ";

            $transactions = $this->db->fetchAll($sql, $params);
            $totalAmount = 0;

            // For performance, verify only a small sample or trust local status
            $sampleSize = min(3, count($transactions));
            $verifiedStatuses = [];

            if ($sampleSize > 0) {
                $sampleTransactions = array_slice($transactions, 0, $sampleSize);
                $verifiedStatuses = $this->intouchApi->getBatchTransactionStatuses($sampleTransactions);
            }

            foreach ($transactions as $transaction) {
                $requestId = $transaction['request_transaction_id'];
                $localAmount = (float)$transaction['local_amount'];
                $includeAmount = false;

                // Check if we have API verification
                if (isset($verifiedStatuses[$requestId])) {
                    $apiStatus = $verifiedStatuses[$requestId];

                    // Include if API confirms success OR if API call failed (trust local)
                    if ($apiStatus['success'] &&
                        (strtolower($apiStatus['status']) === 'successful' ||
                         strtolower($apiStatus['status']) === 'successfull' ||
                         $apiStatus['response_code'] === '01')) {
                        $includeAmount = true;
                    } else if (!$apiStatus['success']) {
                        // API call failed, trust local status
                        $includeAmount = true;
                    }
                } else {
                    // No API verification, trust local status
                    $includeAmount = true;
                }

                if ($includeAmount) {
                    $totalAmount += $localAmount;
                }
            }

            return [
                'total_amount' => $totalAmount
            ];

        } catch (Exception $e) {
            logMessage("Error getting filtered verified amounts: " . $e->getMessage(), 'ERROR');
            // Fallback to simple local query
            return $this->getFilteredLocalAmounts($filters);
        }
    }

    /**
     * Get filtered amounts from local database only
     */
    private function getFilteredLocalAmounts($filters = []) {
        try {
            $whereConditions = [];
            $params = [];

            $whereConditions[] = "status IN ('successful', 'successfull')";

            if (!empty($filters['date_from'])) {
                $whereConditions[] = "DATE(created_at) >= ?";
                $params[] = $filters['date_from'];
            }

            if (!empty($filters['date_to'])) {
                $whereConditions[] = "DATE(created_at) <= ?";
                $params[] = $filters['date_to'];
            }

            if (!empty($filters['phone_number'])) {
                $whereConditions[] = "phone_number = ?";
                $params[] = $filters['phone_number'];
            }

            $whereClause = "WHERE " . implode(" AND ", $whereConditions);

            $sql = "SELECT SUM(amount) as total_amount FROM transactions $whereClause";
            $result = $this->db->fetchOne($sql, $params);

            return [
                'total_amount' => (float)($result['total_amount'] ?? 0)
            ];

        } catch (Exception $e) {
            logMessage("Error getting filtered local amounts: " . $e->getMessage(), 'ERROR');
            return [
                'total_amount' => 0
            ];
        }
    }

    /**
     * Get withdrawal-specific summary
     */
    public function getWithdrawalSummary() {
        $cacheKey = 'withdrawal_summary_' . date('Y-m-d-H');
        $ttl = $this->cache->getTTLForDataType('summary');

        return $this->cache->remember($cacheKey, function() {
            try {
                // Get withdrawal summary from database
                $query = "SELECT * FROM withdrawal_summary";
                $summary = $this->db->query($query);

                if (empty($summary)) {
                    return $this->getDefaultWithdrawalSummary();
                }

                $data = $summary[0];

                // Calculate today's withdrawals
                $todayQuery = "SELECT
                    COUNT(*) as today_withdrawals,
                    COALESCE(SUM(amount), 0) as today_amount
                    FROM transactions
                    WHERE transaction_type = 'withdrawal'
                    AND DATE(created_at) = CURDATE()";
                $todayData = $this->db->query($todayQuery);
                $todayStats = $todayData[0] ?? ['today_withdrawals' => 0, 'today_amount' => 0];

                // Calculate success rate
                $successRate = $data['total_transactions'] > 0
                    ? round(($data['successful_transactions'] / $data['total_transactions']) * 100, 1)
                    : 0;

                return [
                    'total_transactions' => (int)$data['total_transactions'],
                    'successful_transactions' => (int)$data['successful_transactions'],
                    'failed_transactions' => (int)($data['total_transactions'] - $data['successful_transactions'] - $data['pending_transactions']),
                    'pending_transactions' => (int)$data['pending_transactions'],
                    'total_amount' => (float)$data['total_amount'],
                    'successful_amount' => (float)$data['successful_amount'],
                    'average_amount' => (float)$data['average_amount'],
                    'today_withdrawals' => (int)$todayStats['today_withdrawals'],
                    'today_amount' => (float)$todayStats['today_amount'],
                    'success_rate' => $successRate,
                    'last_transaction_date' => $data['last_transaction_date']
                ];

            } catch (Exception $e) {
                logMessage("Error getting withdrawal summary: " . $e->getMessage(), 'ERROR');
                return $this->getDefaultWithdrawalSummary();
            }
        }, $ttl);
    }

    /**
     * Get payment-specific summary
     */
    public function getPaymentSummary() {
        $cacheKey = 'payment_summary_' . date('Y-m-d-H');
        $ttl = $this->cache->getTTLForDataType('summary');

        return $this->cache->remember($cacheKey, function() {
            try {
                // Get payment summary from database
                $query = "SELECT * FROM payment_summary";
                $summary = $this->db->query($query);

                if (empty($summary)) {
                    return $this->getDefaultPaymentSummary();
                }

                $data = $summary[0];

                // Calculate today's payments
                $todayQuery = "SELECT
                    COUNT(*) as today_payments,
                    COALESCE(SUM(amount), 0) as today_amount
                    FROM transactions
                    WHERE transaction_type = 'payment'
                    AND DATE(created_at) = CURDATE()";
                $todayData = $this->db->query($todayQuery);
                $todayStats = $todayData[0] ?? ['today_payments' => 0, 'today_amount' => 0];

                // Calculate success rate
                $successRate = $data['total_transactions'] > 0
                    ? round(($data['successful_transactions'] / $data['total_transactions']) * 100, 1)
                    : 0;

                return [
                    'total_transactions' => (int)$data['total_transactions'],
                    'successful_transactions' => (int)$data['successful_transactions'],
                    'failed_transactions' => (int)($data['total_transactions'] - $data['successful_transactions'] - $data['pending_transactions']),
                    'pending_transactions' => (int)$data['pending_transactions'],
                    'total_amount' => (float)$data['total_amount'],
                    'successful_amount' => (float)$data['successful_amount'],
                    'average_amount' => (float)$data['average_amount'],
                    'today_payments' => (int)$todayStats['today_payments'],
                    'today_amount' => (float)$todayStats['today_amount'],
                    'success_rate' => $successRate,
                    'last_transaction_date' => $data['last_transaction_date']
                ];

            } catch (Exception $e) {
                logMessage("Error getting payment summary: " . $e->getMessage(), 'ERROR');
                return $this->getDefaultPaymentSummary();
            }
        }, $ttl);
    }

    /**
     * Get withdrawal statistics for charts
     */
    public function getWithdrawalStatistics() {
        $cacheKey = 'withdrawal_stats_' . date('Y-m-d-H');
        $ttl = $this->cache->getTTLForDataType('stats');

        return $this->cache->remember($cacheKey, function() {
            try {
                // Get daily withdrawal stats for the last 30 days
                $dailyQuery = "SELECT
                    DATE(created_at) as date,
                    COUNT(*) as total_withdrawals,
                    SUM(CASE WHEN status IN ('successful', 'successfull') THEN 1 ELSE 0 END) as successful_withdrawals,
                    COALESCE(SUM(amount), 0) as total_amount,
                    COALESCE(SUM(CASE WHEN status IN ('successful', 'successfull') THEN amount ELSE 0 END), 0) as successful_amount
                    FROM transactions
                    WHERE transaction_type = 'withdrawal'
                    AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                    GROUP BY DATE(created_at)
                    ORDER BY date ASC";

                $dailyStats = $this->db->query($dailyQuery);

                // Get hourly stats for today
                $hourlyQuery = "SELECT
                    HOUR(created_at) as hour,
                    COUNT(*) as total_withdrawals,
                    COALESCE(SUM(amount), 0) as total_amount
                    FROM transactions
                    WHERE transaction_type = 'withdrawal'
                    AND DATE(created_at) = CURDATE()
                    GROUP BY HOUR(created_at)
                    ORDER BY hour ASC";

                $hourlyStats = $this->db->query($hourlyQuery);

                // Get status distribution
                $statusQuery = "SELECT
                    status,
                    COUNT(*) as count,
                    COALESCE(SUM(amount), 0) as amount
                    FROM transactions
                    WHERE transaction_type = 'withdrawal'
                    GROUP BY status";

                $statusStats = $this->db->query($statusQuery);

                return [
                    'daily_stats' => $dailyStats,
                    'hourly_stats' => $hourlyStats,
                    'status_distribution' => $statusStats
                ];

            } catch (Exception $e) {
                logMessage("Error getting withdrawal statistics: " . $e->getMessage(), 'ERROR');
                return [
                    'daily_stats' => [],
                    'hourly_stats' => [],
                    'status_distribution' => []
                ];
            }
        }, $ttl);
    }

    /**
     * Get default withdrawal summary when no data exists
     */
    private function getDefaultWithdrawalSummary() {
        return [
            'total_transactions' => 0,
            'successful_transactions' => 0,
            'failed_transactions' => 0,
            'pending_transactions' => 0,
            'total_amount' => 0.0,
            'successful_amount' => 0.0,
            'average_amount' => 0.0,
            'today_withdrawals' => 0,
            'today_amount' => 0.0,
            'success_rate' => 0,
            'last_transaction_date' => null
        ];
    }

    /**
     * Get default payment summary when no data exists
     */
    private function getDefaultPaymentSummary() {
        return [
            'total_transactions' => 0,
            'successful_transactions' => 0,
            'failed_transactions' => 0,
            'pending_transactions' => 0,
            'total_amount' => 0.0,
            'successful_amount' => 0.0,
            'average_amount' => 0.0,
            'today_payments' => 0,
            'today_amount' => 0.0,
            'success_rate' => 0,
            'last_transaction_date' => null
        ];
    }
}
