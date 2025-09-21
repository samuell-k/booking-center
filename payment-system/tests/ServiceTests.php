<?php

/**
 * Unit Tests for Service Classes
 * 
 * Simple test framework for testing the service layer classes
 * to ensure amount retrieval works correctly through the API layer.
 */

require_once __DIR__ . '/../config.php';

class ServiceTests {
    private $testResults = [];
    private $dbService;
    private $amountService;
    private $cacheService;
    
    public function __construct() {
        $this->dbService = DatabaseService::getInstance();
        $this->amountService = AmountService::getInstance();
        $this->cacheService = CacheService::getInstance();
    }
    
    /**
     * Run all tests
     */
    public function runAllTests() {
        echo "=== Service Layer Unit Tests ===\n\n";
        
        // Clear cache before testing
        $this->cacheService->clear();
        
        $this->testDatabaseService();
        $this->testAmountService();
        $this->testCacheService();
        $this->testAPIIntegration();
        
        $this->printResults();
    }
    
    /**
     * Test DatabaseService functionality
     */
    private function testDatabaseService() {
        echo "1. Testing DatabaseService...\n";
        
        // Test singleton pattern
        $db1 = DatabaseService::getInstance();
        $db2 = DatabaseService::getInstance();
        $this->assert($db1 === $db2, "DatabaseService singleton pattern");
        
        // Test database connection
        try {
            $pdo = $this->dbService->getPDO();
            $this->assert($pdo instanceof PDO, "Database connection established");
        } catch (Exception $e) {
            $this->assert(false, "Database connection failed: " . $e->getMessage());
        }
        
        // Test dashboard summary
        try {
            $summary = $this->dbService->getDashboardSummary();
            $this->assert(is_array($summary), "Dashboard summary returns array");
            $this->assert(isset($summary['total_transactions']), "Summary contains total_transactions");
            $this->assert(isset($summary['total_amount']), "Summary contains total_amount");
        } catch (Exception $e) {
            $this->assert(false, "Dashboard summary failed: " . $e->getMessage());
        }
        
        // Test today's stats
        try {
            $todayStats = $this->dbService->getTodayStats();
            $this->assert(is_array($todayStats), "Today's stats returns array");
            $this->assert(isset($todayStats['today_amount']), "Today's stats contains amount");
        } catch (Exception $e) {
            $this->assert(false, "Today's stats failed: " . $e->getMessage());
        }
        
        // Test transactions with filters
        try {
            $filters = ['status' => 'all'];
            $result = $this->dbService->getTransactions($filters, 1, 10);
            $this->assert(is_array($result), "Transactions query returns array");
            $this->assert(isset($result['transactions']), "Result contains transactions");
            $this->assert(isset($result['total_records']), "Result contains total_records");
        } catch (Exception $e) {
            $this->assert(false, "Transactions query failed: " . $e->getMessage());
        }
        
        echo "\n";
    }
    
    /**
     * Test AmountService functionality
     */
    private function testAmountService() {
        echo "2. Testing AmountService...\n";
        
        // Test singleton pattern
        $amount1 = AmountService::getInstance();
        $amount2 = AmountService::getInstance();
        $this->assert($amount1 === $amount2, "AmountService singleton pattern");
        
        // Test amount summary
        try {
            $summary = $this->amountService->getAmountSummary();
            $this->assert(is_array($summary), "Amount summary returns array");
            $this->assert(isset($summary['total_amount']), "Summary contains total_amount");
            $this->assert(isset($summary['successful_amount']), "Summary contains successful_amount");
            $this->assert(is_float($summary['total_amount']), "Total amount is float");
        } catch (Exception $e) {
            $this->assert(false, "Amount summary failed: " . $e->getMessage());
        }
        
        // Test amount statistics
        try {
            $stats = $this->amountService->getAmountStatistics(7);
            $this->assert(is_array($stats), "Amount statistics returns array");
            $this->assert(isset($stats['daily_stats']), "Stats contain daily_stats");
            $this->assert(isset($stats['status_distribution']), "Stats contain status_distribution");
        } catch (Exception $e) {
            $this->assert(false, "Amount statistics failed: " . $e->getMessage());
        }
        
        // Test amount validation
        $validation1 = $this->amountService->validateAmount(1000);
        $this->assert($validation1['valid'] === true, "Valid amount (1000) passes validation");
        
        $validation2 = $this->amountService->validateAmount(50);
        $this->assert($validation2['valid'] === false, "Invalid amount (50) fails validation");
        
        $validation3 = $this->amountService->validateAmount(-100);
        $this->assert($validation3['valid'] === false, "Negative amount fails validation");
        
        // Test currency formatting
        $formatted = $this->amountService->formatCurrency(1500.50);
        $this->assert(strpos($formatted, 'RWF') !== false, "Currency formatting includes RWF");
        $this->assert(strpos($formatted, '1,501') !== false, "Currency formatting rounds correctly");
        
        // Test amount calculation with filters
        try {
            $filters = ['status' => ['successful']];
            $calculation = $this->amountService->calculateTotalAmount($filters);
            $this->assert(is_array($calculation), "Amount calculation returns array");
            $this->assert(isset($calculation['total_amount']), "Calculation contains total_amount");
            $this->assert(is_float($calculation['total_amount']), "Calculated amount is float");
        } catch (Exception $e) {
            $this->assert(false, "Amount calculation failed: " . $e->getMessage());
        }
        
        echo "\n";
    }
    
    /**
     * Test CacheService functionality
     */
    private function testCacheService() {
        echo "3. Testing CacheService...\n";
        
        // Test singleton pattern
        $cache1 = CacheService::getInstance();
        $cache2 = CacheService::getInstance();
        $this->assert($cache1 === $cache2, "CacheService singleton pattern");
        
        // Test cache set and get
        $testData = ['test' => 'data', 'amount' => 1500.0];
        $cacheKey = 'test_cache_key';
        
        $setResult = $this->cacheService->set($cacheKey, $testData, 60);
        $this->assert($setResult === true, "Cache set operation successful");
        
        $hasResult = $this->cacheService->has($cacheKey);
        $this->assert($hasResult === true, "Cache has operation returns true for existing key");
        
        $getData = $this->cacheService->get($cacheKey);
        $this->assert($getData === $testData, "Cache get returns correct data");
        
        // Test cache deletion
        $deleteResult = $this->cacheService->delete($cacheKey);
        $this->assert($deleteResult === true, "Cache delete operation successful");
        
        $hasAfterDelete = $this->cacheService->has($cacheKey);
        $this->assert($hasAfterDelete === false, "Cache has returns false after deletion");
        
        // Test cache remember function
        $rememberResult = $this->cacheService->remember('test_remember', function() {
            return ['computed' => 'value', 'amount' => 2500.0];
        }, 60);
        
        $this->assert(is_array($rememberResult), "Cache remember returns computed value");
        $this->assert($rememberResult['computed'] === 'value', "Cache remember returns correct data");
        
        // Test cache statistics
        $stats = $this->cacheService->getStats();
        $this->assert(is_array($stats), "Cache stats returns array");
        $this->assert(isset($stats['total_entries']), "Stats contain total_entries");
        
        echo "\n";
    }
    
    /**
     * Test API integration
     */
    private function testAPIIntegration() {
        echo "4. Testing API Integration...\n";
        
        // Test summary endpoint
        $summaryUrl = 'http://localhost/payment-system/dashboard_api.php?endpoint=summary';
        $summaryResponse = $this->makeAPIRequest($summaryUrl);
        
        if ($summaryResponse) {
            $this->assert($summaryResponse['success'] === true, "Summary API returns success");
            $this->assert(isset($summaryResponse['data']['total_amount']), "Summary API contains total_amount");
        } else {
            $this->assert(false, "Summary API request failed");
        }
        
        // Test transactions endpoint
        $transactionsUrl = 'http://localhost/payment-system/dashboard_api.php?endpoint=transactions&limit=5';
        $transactionsResponse = $this->makeAPIRequest($transactionsUrl);
        
        if ($transactionsResponse) {
            $this->assert($transactionsResponse['success'] === true, "Transactions API returns success");
            $this->assert(isset($transactionsResponse['data']['transactions']), "Transactions API contains transactions array");
        } else {
            $this->assert(false, "Transactions API request failed");
        }
        
        // Test stats endpoint
        $statsUrl = 'http://localhost/payment-system/dashboard_api.php?endpoint=stats';
        $statsResponse = $this->makeAPIRequest($statsUrl);
        
        if ($statsResponse) {
            $this->assert($statsResponse['success'] === true, "Stats API returns success");
            $this->assert(isset($statsResponse['data']['daily_stats']), "Stats API contains daily_stats");
        } else {
            $this->assert(false, "Stats API request failed");
        }
        
        // Test recent endpoint
        $recentUrl = 'http://localhost/payment-system/dashboard_api.php?endpoint=recent';
        $recentResponse = $this->makeAPIRequest($recentUrl);
        
        if ($recentResponse) {
            $this->assert($recentResponse['success'] === true, "Recent API returns success");
            $this->assert(is_array($recentResponse['data']), "Recent API returns array");
        } else {
            $this->assert(false, "Recent API request failed");
        }
        
        echo "\n";
    }
    
    /**
     * Make API request for testing
     */
    private function makeAPIRequest($url) {
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'ignore_errors' => true
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            return null;
        }
        
        return json_decode($response, true);
    }
    
    /**
     * Assert function for testing
     */
    private function assert($condition, $message) {
        $this->testResults[] = [
            'condition' => $condition,
            'message' => $message
        ];
        
        $status = $condition ? '✓' : '✗';
        echo "   $status $message\n";
    }
    
    /**
     * Print test results summary
     */
    private function printResults() {
        $total = count($this->testResults);
        $passed = array_filter($this->testResults, function($result) {
            return $result['condition'];
        });
        $passedCount = count($passed);
        $failedCount = $total - $passedCount;
        
        echo "=== Test Results Summary ===\n";
        echo "Total Tests: $total\n";
        echo "Passed: $passedCount\n";
        echo "Failed: $failedCount\n";
        
        if ($failedCount > 0) {
            echo "\nFailed Tests:\n";
            foreach ($this->testResults as $result) {
                if (!$result['condition']) {
                    echo "✗ " . $result['message'] . "\n";
                }
            }
        }
        
        $successRate = $total > 0 ? round(($passedCount / $total) * 100, 1) : 0;
        echo "\nSuccess Rate: $successRate%\n";
        
        if ($successRate >= 90) {
            echo "🎉 Excellent! Service layer is working correctly.\n";
        } elseif ($successRate >= 70) {
            echo "⚠️  Good, but some issues need attention.\n";
        } else {
            echo "❌ Critical issues found. Please review failed tests.\n";
        }
    }
}

// Run tests if this file is executed directly
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'])) {
    $tests = new ServiceTests();
    $tests->runAllTests();
}
?>
