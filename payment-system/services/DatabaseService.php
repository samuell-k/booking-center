<?php

/**
 * Database Service Class
 * 
 * Handles all database operations and provides an abstraction layer
 * for database queries. This ensures all database access goes through
 * a centralized service layer.
 */
class DatabaseService {
    private $pdo;
    private $cache;
    private static $instance = null;
    
    /**
     * Private constructor for singleton pattern
     */
    private function __construct() {
        $this->connect();
        $this->cache = CacheService::getInstance();
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
     * Establish database connection
     */
    private function connect() {
        try {
            $this->pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            logMessage("Database connection failed: " . $e->getMessage(), 'ERROR');
            throw new Exception("Database connection failed");
        }
    }
    
    /**
     * Get PDO instance for complex queries
     */
    public function getPDO() {
        return $this->pdo;
    }
    
    /**
     * Execute a prepared statement
     */
    public function execute($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            logMessage("Database query failed: " . $e->getMessage() . " SQL: " . $sql, 'ERROR');
            throw new Exception("Database query failed: " . $e->getMessage());
        }
    }
    
    /**
     * Fetch single row
     */
    public function fetchOne($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->fetch();
    }
    
    /**
     * Fetch all rows
     */
    public function fetchAll($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->fetchAll();
    }
    
    /**
     * Get count of records
     */
    public function count($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->fetchColumn();
    }
    
    /**
     * Insert record and return last insert ID
     */
    public function insert($sql, $params = []) {
        $this->execute($sql, $params);
        return $this->pdo->lastInsertId();
    }
    
    /**
     * Update records and return affected rows
     */
    public function update($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->rowCount();
    }
    
    /**
     * Delete records and return affected rows
     */
    public function delete($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->rowCount();
    }
    
    /**
     * Begin transaction
     */
    public function beginTransaction() {
        return $this->pdo->beginTransaction();
    }
    
    /**
     * Commit transaction
     */
    public function commit() {
        return $this->pdo->commit();
    }
    
    /**
     * Rollback transaction
     */
    public function rollback() {
        return $this->pdo->rollback();
    }
    
    /**
     * Check if in transaction
     */
    public function inTransaction() {
        return $this->pdo->inTransaction();
    }
    
    /**
     * Get dashboard summary from view
     */
    public function getDashboardSummary() {
        return $this->fetchOne("SELECT * FROM dashboard_summary");
    }
    
    /**
     * Get today's transaction statistics
     */
    public function getTodayStats() {
        $sql = "
            SELECT 
                COUNT(*) as today_transactions,
                SUM(CASE WHEN status IN ('successful', 'successfull') THEN 1 ELSE 0 END) as today_successful,
                SUM(amount) as today_amount
            FROM transactions 
            WHERE DATE(created_at) = CURDATE()
        ";
        return $this->fetchOne($sql);
    }
    
    /**
     * Get transactions with filtering and pagination
     */
    public function getTransactions($filters = [], $page = 1, $limit = 20) {
        $offset = ($page - 1) * $limit;
        $whereConditions = [];
        $params = [];
        
        // Build WHERE clause based on filters
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $whereConditions[] = "status = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['transaction_type']) && $filters['transaction_type'] !== 'all') {
            $whereConditions[] = "transaction_type = ?";
            $params[] = $filters['transaction_type'];
        }

        if (!empty($filters['search'])) {
            $whereConditions[] = "(phone_number LIKE ? OR user_name LIKE ? OR request_transaction_id LIKE ? OR reason LIKE ?)";
            $searchTerm = "%" . $filters['search'] . "%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        if (!empty($filters['date_from'])) {
            $whereConditions[] = "DATE(created_at) >= ?";
            $params[] = $filters['date_from'];
        }

        if (!empty($filters['date_to'])) {
            $whereConditions[] = "DATE(created_at) <= ?";
            $params[] = $filters['date_to'];
        }
        
        $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
        
        // Get total count
        $countSql = "SELECT COUNT(*) as total FROM transactions $whereClause";
        $totalRecords = $this->count($countSql, $params);
        
        // Get transactions
        $sql = "
            SELECT
                id,
                request_transaction_id,
                intouchpay_transaction_id,
                phone_number,
                amount,
                transaction_type,
                status,
                response_code,
                reason,
                withdraw_charge,
                user_name,
                created_at,
                completed_at,
                CASE
                    WHEN status IN ('successful', 'successfull') THEN 'success'
                    WHEN status IN ('failed', 'failure') THEN 'danger'
                    WHEN status = 'pending' THEN 'warning'
                    ELSE 'secondary'
                END as status_class,
                CASE
                    WHEN transaction_type = 'payment' THEN 'fas fa-arrow-down text-success'
                    WHEN transaction_type = 'withdrawal' THEN 'fas fa-arrow-up text-primary'
                    ELSE 'fas fa-exchange-alt'
                END as type_icon
            FROM transactions
            $whereClause
            ORDER BY created_at DESC
            LIMIT $limit OFFSET $offset
        ";
        
        $transactions = $this->fetchAll($sql, $params);
        
        return [
            'transactions' => $transactions,
            'total_records' => $totalRecords,
            'total_pages' => ceil($totalRecords / $limit),
            'current_page' => $page,
            'per_page' => $limit
        ];
    }
    
    /**
     * Get daily statistics for charts
     */
    public function getDailyStats($days = 7) {
        $sql = "
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as total,
                SUM(CASE WHEN status IN ('successful', 'successfull') THEN 1 ELSE 0 END) as successful,
                SUM(CASE WHEN status IN ('failed', 'failure') THEN 1 ELSE 0 END) as failed,
                SUM(amount) as amount
            FROM transactions 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ";
        return $this->fetchAll($sql, [$days]);
    }
    
    /**
     * Get status distribution statistics
     */
    public function getStatusDistribution() {
        $sql = "
            SELECT 
                status,
                COUNT(*) as count,
                SUM(amount) as amount
            FROM transactions 
            GROUP BY status
        ";
        return $this->fetchAll($sql);
    }
    
    /**
     * Get recent transactions
     */
    public function getRecentTransactions($limit = 10) {
        return $this->fetchAll("SELECT * FROM recent_transactions LIMIT ?", [$limit]);
    }
    
    /**
     * Store new transaction
     */
    public function storeTransaction($data) {
        $sql = "
            INSERT INTO transactions (
                request_transaction_id,
                intouchpay_transaction_id,
                phone_number,
                amount,
                status,
                response_code,
                user_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ";
        
        return $this->insert($sql, [
            $data['request_transaction_id'],
            $data['intouchpay_transaction_id'] ?? null,
            $data['phone_number'],
            $data['amount'],
            $data['status'] ?? 'pending',
            $data['response_code'] ?? null,
            $data['user_name'] ?? null
        ]);
    }
    
    /**
     * Update transaction status
     */
    public function updateTransactionStatus($requestTransactionId, $data) {
        $sql = "UPDATE transactions SET
            status = ?,
            response_code = ?,
            status_desc = ?,
            reference_no = ?,
            intouchpay_transaction_id = ?,
            completed_at = NOW()
            WHERE request_transaction_id = ?";
        
        return $this->update($sql, [
            $data['status'],
            $data['response_code'] ?? null,
            $data['status_desc'] ?? null,
            $data['reference_no'] ?? null,
            $data['intouchpay_transaction_id'] ?? null,
            $requestTransactionId
        ]);
    }

    /**
     * Get transaction by request transaction ID
     */
    public function getTransactionByRequestId($requestTransactionId) {
        $sql = "SELECT * FROM transactions WHERE request_transaction_id = ?";
        $result = $this->fetchAll($sql, [$requestTransactionId]);
        return !empty($result) ? $result[0] : null;
    }

    /**
     * Update transaction status and details
     */
    public function updateTransaction($transactionId, $updateData) {
        $setParts = [];
        $params = [];

        foreach ($updateData as $field => $value) {
            $setParts[] = "$field = ?";
            $params[] = $value;
        }

        // Always update the updated_at timestamp
        $setParts[] = "updated_at = CURRENT_TIMESTAMP";
        $params[] = $transactionId;

        $sql = "UPDATE transactions SET " . implode(', ', $setParts) . " WHERE id = ?";

        return $this->execute($sql, $params);
    }

    /**
     * Update user statistics for withdrawals
     */
    public function updateUserStats($phoneNumber, $userName, $amount, $transactionType = 'payment') {
        try {
            // Check if user exists
            $existingUser = $this->fetchAll("SELECT * FROM users WHERE phone_number = ?", [$phoneNumber]);

            if (empty($existingUser)) {
                // Create new user
                $sql = "INSERT INTO users (phone_number, name, total_payments, total_amount, last_payment_at)
                        VALUES (?, ?, 1, ?, NOW())";
                $this->execute($sql, [$phoneNumber, $userName, $amount]);
            } else {
                // Update existing user
                $sql = "UPDATE users SET
                        name = COALESCE(?, name),
                        total_payments = total_payments + 1,
                        total_amount = total_amount + ?,
                        last_payment_at = NOW(),
                        updated_at = CURRENT_TIMESTAMP
                        WHERE phone_number = ?";
                $this->execute($sql, [$userName, $amount, $phoneNumber]);
            }

            return true;
        } catch (Exception $e) {
            logMessage("Error updating user stats: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
}
