<?php

/**
 * Cache Warming Script
 * 
 * Pre-warms the cache with frequently accessed data to improve
 * API response times and reduce database load.
 */

require_once __DIR__ . '/../config.php';

class CacheWarmer {
    private $dbService;
    private $amountService;
    private $cacheService;
    private $startTime;
    
    public function __construct() {
        $this->dbService = DatabaseService::getInstance();
        $this->amountService = AmountService::getInstance();
        $this->cacheService = CacheService::getInstance();
        $this->startTime = microtime(true);
    }
    
    /**
     * Run cache warming process
     */
    public function warmCache() {
        echo "=== Cache Warming Process ===\n";
        echo "Started at: " . date('Y-m-d H:i:s') . "\n\n";
        
        $this->clearExpiredCache();
        $this->warmAmountSummary();
        $this->warmAmountStatistics();
        $this->warmTransactionData();
        $this->warmRecentTransactions();
        
        $this->printSummary();
    }
    
    /**
     * Clear expired cache entries
     */
    private function clearExpiredCache() {
        echo "1. Clearing expired cache entries...\n";
        
        $cleared = $this->cacheService->clearExpired();
        echo "   ✓ Cleared $cleared expired cache entries\n\n";
    }
    
    /**
     * Warm amount summary cache
     */
    private function warmAmountSummary() {
        echo "2. Warming amount summary cache...\n";
        
        try {
            $startTime = microtime(true);
            $summary = $this->amountService->getAmountSummary();
            $endTime = microtime(true);
            $duration = round(($endTime - $startTime) * 1000, 2);
            
            echo "   ✓ Amount summary cached (${duration}ms)\n";
            echo "   - Total transactions: " . number_format($summary['total_transactions']) . "\n";
            echo "   - Total amount: " . $this->amountService->formatCurrency($summary['total_amount']) . "\n";
            echo "   - Success rate: " . $summary['success_rate'] . "%\n";
        } catch (Exception $e) {
            echo "   ✗ Failed to warm amount summary: " . $e->getMessage() . "\n";
        }
        
        echo "\n";
    }
    
    /**
     * Warm amount statistics cache
     */
    private function warmAmountStatistics() {
        echo "3. Warming amount statistics cache...\n";
        
        $periods = [7, 30]; // 7 days and 30 days
        
        foreach ($periods as $days) {
            try {
                $startTime = microtime(true);
                $stats = $this->amountService->getAmountStatistics($days);
                $endTime = microtime(true);
                $duration = round(($endTime - $startTime) * 1000, 2);
                
                echo "   ✓ ${days}-day statistics cached (${duration}ms)\n";
                echo "     - Daily stats entries: " . count($stats['daily_stats']) . "\n";
                echo "     - Status distribution entries: " . count($stats['status_distribution']) . "\n";
            } catch (Exception $e) {
                echo "   ✗ Failed to warm ${days}-day statistics: " . $e->getMessage() . "\n";
            }
        }
        
        echo "\n";
    }
    
    /**
     * Warm transaction data cache
     */
    private function warmTransactionData() {
        echo "4. Warming transaction data cache...\n";
        
        $filterSets = [
            ['status' => 'all'],
            ['status' => 'successful'],
            ['status' => 'pending'],
            ['status' => 'failed'],
            ['date_from' => date('Y-m-d', strtotime('-7 days'))],
            ['date_from' => date('Y-m-d', strtotime('-30 days'))]
        ];
        
        foreach ($filterSets as $index => $filters) {
            try {
                $startTime = microtime(true);
                $result = $this->dbService->getTransactions($filters, 1, 20);
                $endTime = microtime(true);
                $duration = round(($endTime - $startTime) * 1000, 2);
                
                $filterDesc = $this->describeFilters($filters);
                echo "   ✓ Transactions cached for $filterDesc (${duration}ms)\n";
                echo "     - Records: " . $result['total_records'] . "\n";
            } catch (Exception $e) {
                $filterDesc = $this->describeFilters($filters);
                echo "   ✗ Failed to warm transactions for $filterDesc: " . $e->getMessage() . "\n";
            }
        }
        
        echo "\n";
    }
    
    /**
     * Warm recent transactions cache
     */
    private function warmRecentTransactions() {
        echo "5. Warming recent transactions cache...\n";
        
        try {
            $startTime = microtime(true);
            $recent = $this->dbService->getRecentTransactions(10);
            $endTime = microtime(true);
            $duration = round(($endTime - $startTime) * 1000, 2);
            
            echo "   ✓ Recent transactions cached (${duration}ms)\n";
            echo "   - Records: " . count($recent) . "\n";
        } catch (Exception $e) {
            echo "   ✗ Failed to warm recent transactions: " . $e->getMessage() . "\n";
        }
        
        echo "\n";
    }
    
    /**
     * Describe filters for logging
     */
    private function describeFilters($filters) {
        $descriptions = [];
        
        foreach ($filters as $key => $value) {
            switch ($key) {
                case 'status':
                    $descriptions[] = "status=$value";
                    break;
                case 'date_from':
                    $descriptions[] = "from=$value";
                    break;
                case 'date_to':
                    $descriptions[] = "to=$value";
                    break;
                case 'search':
                    $descriptions[] = "search='$value'";
                    break;
            }
        }
        
        return empty($descriptions) ? 'default' : implode(', ', $descriptions);
    }
    
    /**
     * Print warming summary
     */
    private function printSummary() {
        $endTime = microtime(true);
        $totalDuration = round(($endTime - $this->startTime) * 1000, 2);
        
        echo "=== Cache Warming Summary ===\n";
        echo "Completed at: " . date('Y-m-d H:i:s') . "\n";
        echo "Total duration: ${totalDuration}ms\n";
        
        // Get cache statistics
        $stats = $this->cacheService->getStats();
        echo "Cache entries: " . $stats['total_entries'] . "\n";
        echo "Valid entries: " . $stats['valid_entries'] . "\n";
        echo "Cache size: " . $stats['total_size_mb'] . " MB\n";
        
        echo "\n✅ Cache warming completed successfully!\n";
        echo "API responses should now be faster for frequently accessed data.\n";
    }
    
    /**
     * Warm cache for specific endpoint
     */
    public function warmEndpoint($endpoint, $params = []) {
        echo "Warming cache for endpoint: $endpoint\n";
        
        try {
            switch ($endpoint) {
                case 'summary':
                    $this->warmAmountSummary();
                    break;
                    
                case 'stats':
                    $this->warmAmountStatistics();
                    break;
                    
                case 'transactions':
                    $filters = $params['filters'] ?? ['status' => 'all'];
                    $page = $params['page'] ?? 1;
                    $limit = $params['limit'] ?? 20;
                    
                    $startTime = microtime(true);
                    $this->dbService->getTransactions($filters, $page, $limit);
                    $endTime = microtime(true);
                    $duration = round(($endTime - $startTime) * 1000, 2);
                    
                    echo "   ✓ Transactions endpoint cached (${duration}ms)\n";
                    break;
                    
                case 'recent':
                    $this->warmRecentTransactions();
                    break;
                    
                default:
                    echo "   ✗ Unknown endpoint: $endpoint\n";
            }
        } catch (Exception $e) {
            echo "   ✗ Failed to warm $endpoint: " . $e->getMessage() . "\n";
        }
    }
    
    /**
     * Schedule cache warming (for cron jobs)
     */
    public function scheduleWarming() {
        echo "=== Scheduled Cache Warming ===\n";
        echo "This can be run via cron job for automatic cache warming.\n\n";
        
        // Clear expired entries first
        $this->clearExpiredCache();
        
        // Warm most critical data
        $this->warmAmountSummary();
        $this->warmAmountStatistics();
        
        // Warm recent data only
        try {
            $recentFilters = ['date_from' => date('Y-m-d', strtotime('-7 days'))];
            $this->dbService->getTransactions($recentFilters, 1, 20);
            echo "   ✓ Recent transactions warmed\n";
        } catch (Exception $e) {
            echo "   ✗ Failed to warm recent transactions: " . $e->getMessage() . "\n";
        }
        
        $this->warmRecentTransactions();
        
        echo "\n✅ Scheduled warming completed!\n";
    }
}

// Handle command line execution
if (php_sapi_name() === 'cli') {
    $warmer = new CacheWarmer();
    
    // Check command line arguments
    $command = $argv[1] ?? 'full';
    
    switch ($command) {
        case 'full':
            $warmer->warmCache();
            break;
            
        case 'schedule':
            $warmer->scheduleWarming();
            break;
            
        case 'endpoint':
            $endpoint = $argv[2] ?? 'summary';
            $warmer->warmEndpoint($endpoint);
            break;
            
        case 'clear':
            $cache = CacheService::getInstance();
            $cleared = $cache->clear();
            echo "Cleared $cleared cache entries.\n";
            break;
            
        default:
            echo "Usage: php warm_cache.php [full|schedule|endpoint|clear] [endpoint_name]\n";
            echo "  full     - Warm all cache (default)\n";
            echo "  schedule - Warm critical cache only (for cron)\n";
            echo "  endpoint - Warm specific endpoint cache\n";
            echo "  clear    - Clear all cache\n";
    }
} else {
    // Web execution
    if (isset($_GET['action'])) {
        $warmer = new CacheWarmer();
        
        switch ($_GET['action']) {
            case 'warm':
                $warmer->warmCache();
                break;
                
            case 'schedule':
                $warmer->scheduleWarming();
                break;
                
            case 'stats':
                $cache = CacheService::getInstance();
                $stats = $cache->getStats();
                echo "<h2>Cache Statistics</h2>";
                echo "<pre>" . json_encode($stats, JSON_PRETTY_PRINT) . "</pre>";
                break;
                
            default:
                echo "<h2>Cache Warmer</h2>";
                echo "<p><a href='?action=warm'>Warm All Cache</a></p>";
                echo "<p><a href='?action=schedule'>Schedule Warming</a></p>";
                echo "<p><a href='?action=stats'>View Cache Stats</a></p>";
        }
    } else {
        echo "<h2>Cache Warmer</h2>";
        echo "<p><a href='?action=warm'>Warm All Cache</a></p>";
        echo "<p><a href='?action=schedule'>Schedule Warming</a></p>";
        echo "<p><a href='?action=stats'>View Cache Stats</a></p>";
    }
}
?>
