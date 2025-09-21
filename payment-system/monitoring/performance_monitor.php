<?php

/**
 * Performance Monitor
 * 
 * Provides real-time performance monitoring and metrics collection
 * for the payment system API endpoints and services.
 */

require_once __DIR__ . '/../config.php';

class PerformanceMonitor {
    private $errorHandler;
    private $cacheService;
    
    public function __construct() {
        $this->errorHandler = ErrorHandler::getInstance();
        $this->cacheService = CacheService::getInstance();
    }
    
    /**
     * Display performance dashboard
     */
    public function displayDashboard() {
        $this->renderHeader();
        $this->renderSystemMetrics();
        $this->renderAPIMetrics();
        $this->renderCacheMetrics();
        $this->renderErrorMetrics();
        $this->renderFooter();
    }
    
    /**
     * Render HTML header
     */
    private function renderHeader() {
        echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment System - Performance Monitor</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .metric-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #2c3e50; }
        .metric-value { font-size: 24px; font-weight: bold; color: #27ae60; margin-bottom: 5px; }
        .metric-label { color: #7f8c8d; font-size: 14px; }
        .status-good { color: #27ae60; }
        .status-warning { color: #f39c12; }
        .status-error { color: #e74c3c; }
        .refresh-btn { background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .refresh-btn:hover { background: #2980b9; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; }
        .progress-bar { width: 100%; height: 20px; background: #ecf0f1; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: #3498db; transition: width 0.3s ease; }
    </style>
    <script>
        function refreshPage() { location.reload(); }
        setInterval(refreshPage, 30000); // Auto-refresh every 30 seconds
    </script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Payment System Performance Monitor</h1>
            <p>Real-time monitoring and metrics for API endpoints and services</p>
            <button class="refresh-btn" onclick="refreshPage()">🔄 Refresh Now</button>
            <span style="float: right;">Last updated: ' . date('Y-m-d H:i:s') . '</span>
        </div>';
    }
    
    /**
     * Render system metrics
     */
    private function renderSystemMetrics() {
        $memoryUsage = memory_get_usage(true);
        $memoryLimit = ini_get('memory_limit');
        $memoryUsageMB = round($memoryUsage / 1024 / 1024, 2);
        $memoryLimitMB = $this->parseMemoryLimit($memoryLimit);
        $memoryPercent = $memoryLimitMB > 0 ? round(($memoryUsageMB / $memoryLimitMB) * 100, 1) : 0;
        
        $diskFree = disk_free_space('.');
        $diskTotal = disk_total_space('.');
        $diskUsed = $diskTotal - $diskFree;
        $diskPercent = round(($diskUsed / $diskTotal) * 100, 1);
        
        echo '<div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-title">💾 System Resources</div>
                <div class="metric-value">' . $memoryUsageMB . ' MB</div>
                <div class="metric-label">Memory Usage (' . $memoryPercent . '% of ' . $memoryLimit . ')</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ' . min($memoryPercent, 100) . '%;"></div>
                </div>
                <br>
                <div class="metric-value">' . round($diskFree / 1024 / 1024 / 1024, 2) . ' GB</div>
                <div class="metric-label">Disk Free (' . (100 - $diskPercent) . '% available)</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ' . $diskPercent . '%;"></div>
                </div>
            </div>';
    }
    
    /**
     * Render API metrics
     */
    private function renderAPIMetrics() {
        $perfStats = $this->errorHandler->getPerformanceStats(24);
        $avgResponseTime = $perfStats['avg_response_time'];
        $avgMemoryUsage = $perfStats['avg_memory_usage'];
        $totalRequests = $perfStats['total_requests'];
        
        $responseTimeStatus = $avgResponseTime < 100 ? 'status-good' : 
                             ($avgResponseTime < 500 ? 'status-warning' : 'status-error');
        
        echo '<div class="metric-card">
                <div class="metric-title">⚡ API Performance (24h)</div>
                <div class="metric-value ' . $responseTimeStatus . '">' . $avgResponseTime . ' ms</div>
                <div class="metric-label">Average Response Time</div>
                <br>
                <div class="metric-value">' . number_format($totalRequests) . '</div>
                <div class="metric-label">Total Requests</div>
                <br>
                <div class="metric-value">' . $avgMemoryUsage . ' MB</div>
                <div class="metric-label">Average Memory Usage</div>
            </div>';
        
        // Test API endpoints
        $this->renderAPIEndpointTests();
    }
    
    /**
     * Render API endpoint tests
     */
    private function renderAPIEndpointTests() {
        $endpoints = [
            'summary' => 'dashboard_api.php?endpoint=summary',
            'transactions' => 'dashboard_api.php?endpoint=transactions&limit=5',
            'stats' => 'dashboard_api.php?endpoint=stats',
            'recent' => 'dashboard_api.php?endpoint=recent'
        ];
        
        echo '<div class="metric-card">
                <div class="metric-title">🔗 API Endpoint Health</div>
                <table>
                    <tr><th>Endpoint</th><th>Status</th><th>Response Time</th></tr>';
        
        foreach ($endpoints as $name => $url) {
            $result = $this->testEndpoint($url);
            $statusClass = $result['success'] ? 'status-good' : 'status-error';
            $statusText = $result['success'] ? '✅ OK' : '❌ Error';
            
            echo '<tr>
                    <td>' . ucfirst($name) . '</td>
                    <td class="' . $statusClass . '">' . $statusText . '</td>
                    <td>' . $result['response_time'] . ' ms</td>
                  </tr>';
        }
        
        echo '</table></div>';
    }
    
    /**
     * Render cache metrics
     */
    private function renderCacheMetrics() {
        $cacheStats = $this->cacheService->getStats();
        $hitRate = $cacheStats['valid_entries'] > 0 ? 
                   round(($cacheStats['valid_entries'] / $cacheStats['total_entries']) * 100, 1) : 0;
        
        $hitRateStatus = $hitRate > 80 ? 'status-good' : 
                        ($hitRate > 50 ? 'status-warning' : 'status-error');
        
        echo '<div class="metric-card">
                <div class="metric-title">🗄️ Cache Performance</div>
                <div class="metric-value ' . $hitRateStatus . '">' . $hitRate . '%</div>
                <div class="metric-label">Cache Hit Rate</div>
                <br>
                <div class="metric-value">' . $cacheStats['total_entries'] . '</div>
                <div class="metric-label">Total Cache Entries</div>
                <br>
                <div class="metric-value">' . $cacheStats['total_size_mb'] . ' MB</div>
                <div class="metric-label">Cache Size</div>
                <br>
                <div class="metric-value ' . ($cacheStats['expired_entries'] > 0 ? 'status-warning' : 'status-good') . '">' . $cacheStats['expired_entries'] . '</div>
                <div class="metric-label">Expired Entries</div>
            </div>';
    }
    
    /**
     * Render error metrics
     */
    private function renderErrorMetrics() {
        $errorStats = $this->errorHandler->getErrorStats(24);
        $errorRate = $errorStats['total_errors'];
        $errorStatus = $errorRate == 0 ? 'status-good' : 
                      ($errorRate < 10 ? 'status-warning' : 'status-error');
        
        echo '<div class="metric-card">
                <div class="metric-title">🚨 Error Monitoring (24h)</div>
                <div class="metric-value ' . $errorStatus . '">' . $errorStats['total_errors'] . '</div>
                <div class="metric-label">Total Errors</div>';
        
        if (!empty($errorStats['error_types'])) {
            echo '<br><strong>Error Types:</strong><br>';
            foreach ($errorStats['error_types'] as $type => $count) {
                echo '<div>' . $type . ': ' . $count . '</div>';
            }
        }
        
        if (!empty($errorStats['recent_errors'])) {
            echo '<br><strong>Recent Errors:</strong>';
            echo '<table>';
            foreach (array_slice($errorStats['recent_errors'], 0, 5) as $error) {
                echo '<tr>
                        <td>' . $error['timestamp'] . '</td>
                        <td>' . $error['type'] . '</td>
                        <td>' . substr($error['message'], 0, 50) . '...</td>
                      </tr>';
            }
            echo '</table>';
        }
        
        echo '</div>';
    }
    
    /**
     * Test API endpoint
     */
    private function testEndpoint($url) {
        $fullUrl = 'http://localhost/payment-system/' . $url;
        $startTime = microtime(true);
        
        $context = stream_context_create([
            'http' => [
                'timeout' => 5,
                'ignore_errors' => true
            ]
        ]);
        
        $response = @file_get_contents($fullUrl, false, $context);
        $endTime = microtime(true);
        $responseTime = round(($endTime - $startTime) * 1000, 2);
        
        $success = false;
        if ($response !== false) {
            $data = json_decode($response, true);
            $success = isset($data['success']) && $data['success'] === true;
        }
        
        return [
            'success' => $success,
            'response_time' => $responseTime,
            'response' => $response
        ];
    }
    
    /**
     * Parse memory limit string
     */
    private function parseMemoryLimit($limit) {
        if ($limit == -1) return 0;
        
        $unit = strtolower(substr($limit, -1));
        $value = (int)$limit;
        
        switch ($unit) {
            case 'g': return $value * 1024;
            case 'm': return $value;
            case 'k': return $value / 1024;
            default: return $value / 1024 / 1024;
        }
    }
    
    /**
     * Render footer
     */
    private function renderFooter() {
        echo '</div>
        <div style="text-align: center; margin-top: 20px; color: #7f8c8d;">
            <p>🔄 Auto-refreshes every 30 seconds | 
               <a href="?action=clear_cache">Clear Cache</a> | 
               <a href="?action=warm_cache">Warm Cache</a> |
               <a href="../scripts/warm_cache.php?action=stats">Cache Stats</a>
            </p>
        </div>
    </div>
</body>
</html>';
    }
    
    /**
     * Get system health status
     */
    public function getHealthStatus() {
        $health = [
            'status' => 'healthy',
            'timestamp' => date('c'),
            'checks' => []
        ];
        
        // Database check
        try {
            $db = DatabaseService::getInstance();
            $db->getPDO()->query('SELECT 1');
            $health['checks']['database'] = ['status' => 'ok', 'message' => 'Database connection successful'];
        } catch (Exception $e) {
            $health['checks']['database'] = ['status' => 'error', 'message' => $e->getMessage()];
            $health['status'] = 'unhealthy';
        }
        
        // Cache check
        try {
            $cache = CacheService::getInstance();
            $cache->set('health_check', 'ok', 60);
            $result = $cache->get('health_check');
            if ($result === 'ok') {
                $health['checks']['cache'] = ['status' => 'ok', 'message' => 'Cache working properly'];
            } else {
                $health['checks']['cache'] = ['status' => 'warning', 'message' => 'Cache not working properly'];
            }
        } catch (Exception $e) {
            $health['checks']['cache'] = ['status' => 'error', 'message' => $e->getMessage()];
            $health['status'] = 'degraded';
        }
        
        // API endpoints check
        $endpoints = ['summary', 'transactions', 'stats', 'recent'];
        $failedEndpoints = 0;
        
        foreach ($endpoints as $endpoint) {
            $result = $this->testEndpoint("dashboard_api.php?endpoint=$endpoint");
            if ($result['success']) {
                $health['checks']["api_$endpoint"] = ['status' => 'ok', 'response_time' => $result['response_time']];
            } else {
                $health['checks']["api_$endpoint"] = ['status' => 'error', 'message' => 'Endpoint failed'];
                $failedEndpoints++;
            }
        }
        
        if ($failedEndpoints > 0) {
            $health['status'] = $failedEndpoints >= count($endpoints) ? 'unhealthy' : 'degraded';
        }
        
        return $health;
    }
}

// Handle web requests
if (!empty($_GET['action'])) {
    $monitor = new PerformanceMonitor();
    
    switch ($_GET['action']) {
        case 'health':
            header('Content-Type: application/json');
            echo json_encode($monitor->getHealthStatus());
            break;
            
        case 'clear_cache':
            $cache = CacheService::getInstance();
            $cleared = $cache->clear();
            echo "<h2>Cache Cleared</h2><p>Cleared $cleared cache entries.</p>";
            echo "<p><a href='performance_monitor.php'>Back to Monitor</a></p>";
            break;
            
        case 'warm_cache':
            echo "<h2>Warming Cache...</h2>";
            include __DIR__ . '/../scripts/warm_cache.php';
            echo "<p><a href='performance_monitor.php'>Back to Monitor</a></p>";
            break;
            
        default:
            $monitor->displayDashboard();
    }
} else {
    $monitor = new PerformanceMonitor();
    $monitor->displayDashboard();
}
?>
