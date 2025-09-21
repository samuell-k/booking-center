<?php

/**
 * Error Handler Service
 * 
 * Provides centralized error handling, logging, and monitoring
 * for the payment system API and services.
 */
class ErrorHandler {
    private static $instance = null;
    private $errorLog = 'error_log.txt';
    private $performanceLog = 'performance_log.txt';
    private $startTime;
    
    /**
     * Private constructor for singleton pattern
     */
    private function __construct() {
        $this->startTime = microtime(true);
        
        // Set custom error and exception handlers
        set_error_handler([$this, 'handleError']);
        set_exception_handler([$this, 'handleException']);
        register_shutdown_function([$this, 'handleShutdown']);
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
     * Handle PHP errors
     */
    public function handleError($severity, $message, $file, $line) {
        // Don't handle errors that are suppressed with @
        if (!(error_reporting() & $severity)) {
            return false;
        }
        
        $errorType = $this->getErrorType($severity);
        $errorMessage = "[$errorType] $message in $file on line $line";
        
        $this->logError($errorMessage, 'PHP_ERROR');
        
        // For fatal errors, throw an exception
        if ($severity === E_ERROR || $severity === E_CORE_ERROR || $severity === E_COMPILE_ERROR) {
            throw new ErrorException($message, 0, $severity, $file, $line);
        }
        
        return true;
    }
    
    /**
     * Handle uncaught exceptions
     */
    public function handleException($exception) {
        $errorMessage = sprintf(
            "[EXCEPTION] %s: %s in %s on line %d\nStack trace:\n%s",
            get_class($exception),
            $exception->getMessage(),
            $exception->getFile(),
            $exception->getLine(),
            $exception->getTraceAsString()
        );
        
        $this->logError($errorMessage, 'EXCEPTION');
        
        // Send appropriate response based on context
        if (!headers_sent()) {
            if ($this->isAPIRequest()) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'An internal error occurred',
                    'error_id' => $this->generateErrorId()
                ]);
            } else {
                header('HTTP/1.1 500 Internal Server Error');
                echo "An internal error occurred. Please try again later.";
            }
        }
    }
    
    /**
     * Handle shutdown errors (fatal errors)
     */
    public function handleShutdown() {
        $error = error_get_last();
        
        if ($error && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE])) {
            $errorMessage = sprintf(
                "[FATAL] %s in %s on line %d",
                $error['message'],
                $error['file'],
                $error['line']
            );
            
            $this->logError($errorMessage, 'FATAL');
        }
        
        // Log performance metrics
        $this->logPerformance();
    }
    
    /**
     * Log error with context
     */
    public function logError($message, $type = 'ERROR', $context = []) {
        $timestamp = date('Y-m-d H:i:s');
        $requestId = $this->getRequestId();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        $ip = $this->getClientIP();
        $url = $_SERVER['REQUEST_URI'] ?? 'Unknown';
        
        $logEntry = [
            'timestamp' => $timestamp,
            'type' => $type,
            'request_id' => $requestId,
            'message' => $message,
            'url' => $url,
            'ip' => $ip,
            'user_agent' => $userAgent,
            'context' => $context
        ];
        
        $logLine = json_encode($logEntry) . PHP_EOL;
        file_put_contents($this->errorLog, $logLine, FILE_APPEND | LOCK_EX);
        
        // Also log to the main log file
        logMessage("[$type] $message", $type);
    }
    
    /**
     * Log performance metrics
     */
    public function logPerformance() {
        $endTime = microtime(true);
        $executionTime = ($endTime - $this->startTime) * 1000; // Convert to milliseconds
        $memoryUsage = memory_get_peak_usage(true);
        $memoryUsageMB = round($memoryUsage / 1024 / 1024, 2);
        
        $performanceData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'request_id' => $this->getRequestId(),
            'url' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
            'method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
            'execution_time_ms' => round($executionTime, 2),
            'memory_usage_mb' => $memoryUsageMB,
            'response_code' => http_response_code()
        ];
        
        $logLine = json_encode($performanceData) . PHP_EOL;
        file_put_contents($this->performanceLog, $logLine, FILE_APPEND | LOCK_EX);
    }
    
    /**
     * Handle API errors with proper JSON response
     */
    public function handleAPIError($message, $code = 500, $details = []) {
        $errorId = $this->generateErrorId();
        
        $this->logError($message, 'API_ERROR', [
            'error_id' => $errorId,
            'code' => $code,
            'details' => $details
        ]);
        
        if (!headers_sent()) {
            header('Content-Type: application/json');
            http_response_code($code);
        }
        
        echo json_encode([
            'success' => false,
            'message' => $message,
            'error_id' => $errorId,
            'timestamp' => date('c')
        ]);
        
        exit;
    }
    
    /**
     * Handle service layer errors
     */
    public function handleServiceError($service, $method, $exception) {
        $errorMessage = sprintf(
            "Service error in %s::%s - %s",
            $service,
            $method,
            $exception->getMessage()
        );
        
        $this->logError($errorMessage, 'SERVICE_ERROR', [
            'service' => $service,
            'method' => $method,
            'exception_class' => get_class($exception),
            'file' => $exception->getFile(),
            'line' => $exception->getLine()
        ]);
        
        throw new Exception("Service operation failed: $method");
    }
    
    /**
     * Get error type string from severity level
     */
    private function getErrorType($severity) {
        $errorTypes = [
            E_ERROR => 'ERROR',
            E_WARNING => 'WARNING',
            E_PARSE => 'PARSE',
            E_NOTICE => 'NOTICE',
            E_CORE_ERROR => 'CORE_ERROR',
            E_CORE_WARNING => 'CORE_WARNING',
            E_COMPILE_ERROR => 'COMPILE_ERROR',
            E_COMPILE_WARNING => 'COMPILE_WARNING',
            E_USER_ERROR => 'USER_ERROR',
            E_USER_WARNING => 'USER_WARNING',
            E_USER_NOTICE => 'USER_NOTICE',
            E_STRICT => 'STRICT',
            E_RECOVERABLE_ERROR => 'RECOVERABLE_ERROR',
            E_DEPRECATED => 'DEPRECATED',
            E_USER_DEPRECATED => 'USER_DEPRECATED'
        ];
        
        return $errorTypes[$severity] ?? 'UNKNOWN';
    }
    
    /**
     * Check if current request is an API request
     */
    private function isAPIRequest() {
        $requestUri = $_SERVER['REQUEST_URI'] ?? '';
        return strpos($requestUri, 'api.php') !== false || 
               strpos($requestUri, '.php') !== false ||
               (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);
    }
    
    /**
     * Generate unique error ID for tracking
     */
    private function generateErrorId() {
        return 'ERR_' . date('YmdHis') . '_' . substr(md5(uniqid()), 0, 8);
    }
    
    /**
     * Get unique request ID
     */
    private function getRequestId() {
        static $requestId = null;
        
        if ($requestId === null) {
            $requestId = 'REQ_' . date('YmdHis') . '_' . substr(md5(uniqid()), 0, 8);
        }
        
        return $requestId;
    }
    
    /**
     * Get client IP address
     */
    private function getClientIP() {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = $_SERVER[$key];
                // Handle comma-separated IPs (from proxies)
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                return $ip;
            }
        }
        
        return 'Unknown';
    }
    
    /**
     * Get error statistics
     */
    public function getErrorStats($hours = 24) {
        if (!file_exists($this->errorLog)) {
            return ['total_errors' => 0, 'error_types' => [], 'recent_errors' => []];
        }
        
        $lines = file($this->errorLog, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $cutoffTime = time() - ($hours * 3600);
        $stats = ['total_errors' => 0, 'error_types' => [], 'recent_errors' => []];
        
        foreach (array_reverse($lines) as $line) {
            $data = json_decode($line, true);
            if (!$data) continue;
            
            $errorTime = strtotime($data['timestamp']);
            if ($errorTime < $cutoffTime) break;
            
            $stats['total_errors']++;
            $type = $data['type'] ?? 'UNKNOWN';
            $stats['error_types'][$type] = ($stats['error_types'][$type] ?? 0) + 1;
            
            if (count($stats['recent_errors']) < 10) {
                $stats['recent_errors'][] = [
                    'timestamp' => $data['timestamp'],
                    'type' => $type,
                    'message' => $data['message'],
                    'url' => $data['url'] ?? 'Unknown'
                ];
            }
        }
        
        return $stats;
    }
    
    /**
     * Get performance statistics
     */
    public function getPerformanceStats($hours = 24) {
        if (!file_exists($this->performanceLog)) {
            return ['total_requests' => 0, 'avg_response_time' => 0, 'avg_memory_usage' => 0];
        }
        
        $lines = file($this->performanceLog, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $cutoffTime = time() - ($hours * 3600);
        $stats = ['total_requests' => 0, 'total_time' => 0, 'total_memory' => 0];
        
        foreach (array_reverse($lines) as $line) {
            $data = json_decode($line, true);
            if (!$data) continue;
            
            $requestTime = strtotime($data['timestamp']);
            if ($requestTime < $cutoffTime) break;
            
            $stats['total_requests']++;
            $stats['total_time'] += $data['execution_time_ms'] ?? 0;
            $stats['total_memory'] += $data['memory_usage_mb'] ?? 0;
        }
        
        return [
            'total_requests' => $stats['total_requests'],
            'avg_response_time' => $stats['total_requests'] > 0 ? round($stats['total_time'] / $stats['total_requests'], 2) : 0,
            'avg_memory_usage' => $stats['total_requests'] > 0 ? round($stats['total_memory'] / $stats['total_requests'], 2) : 0
        ];
    }
}
