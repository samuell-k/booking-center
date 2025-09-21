<?php

/**
 * Cache Service Class
 * 
 * Provides simple file-based caching for API responses to improve
 * performance and reduce database load for frequently accessed data.
 */
class CacheService {
    private $cacheDir;
    private $defaultTTL;
    private static $instance = null;
    
    /**
     * Private constructor for singleton pattern
     */
    private function __construct() {
        $this->cacheDir = __DIR__ . '/../cache/';
        $this->defaultTTL = 300; // 5 minutes default TTL
        
        // Create cache directory if it doesn't exist
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
        }
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
     * Generate cache key from data
     */
    private function generateKey($key, $params = []) {
        if (!empty($params)) {
            $key .= '_' . md5(serialize($params));
        }
        return preg_replace('/[^a-zA-Z0-9_-]/', '_', $key);
    }
    
    /**
     * Get cache file path
     */
    private function getCacheFilePath($key) {
        return $this->cacheDir . $this->generateKey($key) . '.cache';
    }
    
    /**
     * Check if cache exists and is valid
     */
    public function has($key, $params = []) {
        $filePath = $this->getCacheFilePath($key . serialize($params));
        
        if (!file_exists($filePath)) {
            return false;
        }
        
        $cacheData = unserialize(file_get_contents($filePath));
        
        // Check if cache has expired
        if ($cacheData['expires'] < time()) {
            $this->delete($key, $params);
            return false;
        }
        
        return true;
    }
    
    /**
     * Get cached data
     */
    public function get($key, $params = []) {
        $filePath = $this->getCacheFilePath($key . serialize($params));
        
        if (!$this->has($key, $params)) {
            return null;
        }
        
        $cacheData = unserialize(file_get_contents($filePath));
        return $cacheData['data'];
    }
    
    /**
     * Store data in cache
     */
    public function set($key, $data, $ttl = null, $params = []) {
        if ($ttl === null) {
            $ttl = $this->defaultTTL;
        }
        
        $filePath = $this->getCacheFilePath($key . serialize($params));
        
        $cacheData = [
            'data' => $data,
            'created' => time(),
            'expires' => time() + $ttl
        ];
        
        try {
            file_put_contents($filePath, serialize($cacheData), LOCK_EX);
            return true;
        } catch (Exception $e) {
            logMessage("Cache write failed: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
    
    /**
     * Delete cached data
     */
    public function delete($key, $params = []) {
        $filePath = $this->getCacheFilePath($key . serialize($params));
        
        if (file_exists($filePath)) {
            return unlink($filePath);
        }
        
        return true;
    }
    
    /**
     * Clear all cache
     */
    public function clear() {
        $files = glob($this->cacheDir . '*.cache');
        $cleared = 0;
        
        foreach ($files as $file) {
            if (unlink($file)) {
                $cleared++;
            }
        }
        
        return $cleared;
    }
    
    /**
     * Clear expired cache entries
     */
    public function clearExpired() {
        $files = glob($this->cacheDir . '*.cache');
        $cleared = 0;
        
        foreach ($files as $file) {
            $cacheData = unserialize(file_get_contents($file));
            
            if ($cacheData['expires'] < time()) {
                if (unlink($file)) {
                    $cleared++;
                }
            }
        }
        
        return $cleared;
    }
    
    /**
     * Get cache statistics
     */
    public function getStats() {
        $files = glob($this->cacheDir . '*.cache');
        $totalSize = 0;
        $validEntries = 0;
        $expiredEntries = 0;
        
        foreach ($files as $file) {
            $totalSize += filesize($file);
            $cacheData = unserialize(file_get_contents($file));
            
            if ($cacheData['expires'] >= time()) {
                $validEntries++;
            } else {
                $expiredEntries++;
            }
        }
        
        return [
            'total_entries' => count($files),
            'valid_entries' => $validEntries,
            'expired_entries' => $expiredEntries,
            'total_size_bytes' => $totalSize,
            'total_size_mb' => round($totalSize / 1024 / 1024, 2)
        ];
    }
    
    /**
     * Cache wrapper for callable functions
     */
    public function remember($key, $callback, $ttl = null, $params = []) {
        // Check if we have cached data
        if ($this->has($key, $params)) {
            return $this->get($key, $params);
        }
        
        // Execute callback to get fresh data
        $data = call_user_func($callback);
        
        // Cache the result
        $this->set($key, $data, $ttl, $params);
        
        return $data;
    }
    
    /**
     * Get cache key for amount summary
     */
    public function getAmountSummaryCacheKey() {
        return 'amount_summary';
    }
    
    /**
     * Get cache key for amount statistics
     */
    public function getAmountStatsCacheKey($days = 7) {
        return 'amount_stats_' . $days . 'd';
    }
    
    /**
     * Get cache key for transactions
     */
    public function getTransactionsCacheKey($filters, $page, $limit) {
        return 'transactions_' . md5(serialize([$filters, $page, $limit]));
    }
    
    /**
     * Get cache key for recent transactions
     */
    public function getRecentTransactionsCacheKey($limit = 10) {
        return 'recent_transactions_' . $limit;
    }
    
    /**
     * Invalidate amount-related caches
     * Call this when new transactions are added or updated
     */
    public function invalidateAmountCaches() {
        $patterns = [
            'amount_summary',
            'amount_stats_',
            'transactions_',
            'recent_transactions_'
        ];
        
        $files = glob($this->cacheDir . '*.cache');
        $invalidated = 0;
        
        foreach ($files as $file) {
            $filename = basename($file, '.cache');
            
            foreach ($patterns as $pattern) {
                if (strpos($filename, $pattern) === 0) {
                    if (unlink($file)) {
                        $invalidated++;
                    }
                    break;
                }
            }
        }
        
        logMessage("Invalidated $invalidated cache entries", 'INFO');
        return $invalidated;
    }
    
    /**
     * Set cache TTL for different data types
     */
    public function getTTLForDataType($type) {
        $ttls = [
            'summary' => 300,      // 5 minutes
            'stats' => 600,        // 10 minutes
            'transactions' => 180, // 3 minutes
            'recent' => 120        // 2 minutes
        ];
        
        return isset($ttls[$type]) ? $ttls[$type] : $this->defaultTTL;
    }
}
