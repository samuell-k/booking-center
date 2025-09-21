<?php
/**
 * Dashboard API Endpoints
 * Provides data for the payment dashboard
 */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get the requested endpoint
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

try {
    // Initialize services
    $dbService = DatabaseService::getInstance();
    $amountService = AmountService::getInstance();

    switch ($endpoint) {
        case 'summary':
            getSummary($amountService);
            break;

        case 'transactions':
            getTransactions($dbService);
            break;

        case 'stats':
            getStats($amountService);
            break;

        case 'recent':
            getRecentTransactions($dbService);
            break;

        case 'withdrawal-summary':
            getWithdrawalSummary($amountService);
            break;

        case 'payment-summary':
            getPaymentSummary($amountService);
            break;

        case 'withdrawal-stats':
            getWithdrawalStats($amountService);
            break;

        case 'combined-stats':
            getCombinedStats($amountService);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid endpoint']);
    }

} catch (Exception $e) {
    logMessage("API Error: " . $e->getMessage(), 'ERROR');
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

/**
 * Get dashboard summary statistics
 */
function getSummary($amountService) {
    try {
        $summaryData = $amountService->getAmountSummary();

        echo json_encode([
            'success' => true,
            'data' => $summaryData
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to get summary: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get transactions with filtering and pagination
 */
function getTransactions($dbService) {
    try {
        // Get parameters
        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? min(100, max(10, (int)$_GET['limit'])) : 20;

        // Build filters array
        $filters = [
            'status' => isset($_GET['status']) ? $_GET['status'] : '',
            'transaction_type' => isset($_GET['transaction_type']) ? $_GET['transaction_type'] : '',
            'search' => isset($_GET['search']) ? trim($_GET['search']) : '',
            'date_from' => isset($_GET['date_from']) ? $_GET['date_from'] : '',
            'date_to' => isset($_GET['date_to']) ? $_GET['date_to'] : ''
        ];

        // Get transactions using the database service
        $result = $dbService->getTransactions($filters, $page, $limit);

        // Format the data
        foreach ($result['transactions'] as &$transaction) {
            $transaction['amount'] = (float)$transaction['amount'];
            $transaction['withdraw_charge'] = isset($transaction['withdraw_charge']) ? (float)$transaction['withdraw_charge'] : 0;
            $transaction['created_at_formatted'] = date('M j, Y g:i A', strtotime($transaction['created_at']));
            $transaction['phone_formatted'] = formatPhoneNumber($transaction['phone_number']);
            $transaction['transaction_type'] = $transaction['transaction_type'] ?? 'payment';

            // Add type-specific formatting
            $transaction['type_icon'] = $transaction['transaction_type'] === 'withdrawal'
                ? 'fas fa-arrow-up text-primary'
                : 'fas fa-arrow-down text-success';
            $transaction['type_label'] = ucfirst($transaction['transaction_type']);
        }

        echo json_encode([
            'success' => true,
            'data' => [
                'transactions' => $result['transactions'],
                'pagination' => [
                    'current_page' => $result['current_page'],
                    'total_pages' => $result['total_pages'],
                    'total_records' => $result['total_records'],
                    'per_page' => $result['per_page'],
                    'has_next' => $result['current_page'] < $result['total_pages'],
                    'has_prev' => $result['current_page'] > 1
                ]
            ]
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to get transactions: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get statistics for charts
 */
function getStats($amountService) {
    try {
        $statsData = $amountService->getAmountStatistics();

        echo json_encode([
            'success' => true,
            'data' => $statsData
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to get statistics: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get recent transactions (last 10)
 */
function getRecentTransactions($dbService) {
    try {
        $transactions = $dbService->getRecentTransactions(10);

        // Format the data
        foreach ($transactions as &$transaction) {
            $transaction['amount'] = (float)$transaction['amount'];
            $transaction['withdraw_charge'] = isset($transaction['withdraw_charge']) ? (float)$transaction['withdraw_charge'] : 0;
            $transaction['created_at_formatted'] = date('M j, Y g:i A', strtotime($transaction['created_at']));
            $transaction['phone_formatted'] = formatPhoneNumber($transaction['phone_number']);
            $transaction['transaction_type'] = $transaction['transaction_type'] ?? 'payment';

            // Add type-specific formatting
            $transaction['type_icon'] = $transaction['transaction_type'] === 'withdrawal'
                ? 'fas fa-arrow-up text-primary'
                : 'fas fa-arrow-down text-success';
            $transaction['type_label'] = ucfirst($transaction['transaction_type']);
        }

        echo json_encode([
            'success' => true,
            'data' => $transactions
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to get recent transactions: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get withdrawal-specific summary statistics
 */
function getWithdrawalSummary($amountService) {
    try {
        $summaryData = $amountService->getWithdrawalSummary();

        echo json_encode([
            'success' => true,
            'data' => $summaryData
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to get withdrawal summary: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get payment-specific summary statistics
 */
function getPaymentSummary($amountService) {
    try {
        $summaryData = $amountService->getPaymentSummary();

        echo json_encode([
            'success' => true,
            'data' => $summaryData
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to get payment summary: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get withdrawal statistics for charts
 */
function getWithdrawalStats($amountService) {
    try {
        $statsData = $amountService->getWithdrawalStatistics();

        echo json_encode([
            'success' => true,
            'data' => $statsData
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to get withdrawal statistics: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get combined payment and withdrawal statistics
 */
function getCombinedStats($amountService) {
    try {
        $paymentStats = $amountService->getPaymentStatistics();
        $withdrawalStats = $amountService->getWithdrawalStatistics();
        $overallStats = $amountService->getAmountStatistics();

        echo json_encode([
            'success' => true,
            'data' => [
                'payments' => $paymentStats,
                'withdrawals' => $withdrawalStats,
                'overall' => $overallStats
            ]
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to get combined statistics: ' . $e->getMessage()
        ]);
    }
}

?>
