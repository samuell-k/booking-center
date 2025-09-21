<?php
// Test dashboard API endpoints
echo "<h2>Dashboard API Test</h2>";

$baseUrl = 'http://localhost/payment-system/dashboard_api.php';
$endpoints = ['summary', 'stats', 'recent'];

foreach ($endpoints as $endpoint) {
    echo "<h3>Testing endpoint: {$endpoint}</h3>";
    
    $url = $baseUrl . '?endpoint=' . $endpoint;
    
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'ignore_errors' => true
        ]
    ]);
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response === false) {
        echo "❌ Failed to connect to API<br>";
        continue;
    }
    
    $data = json_decode($response, true);
    
    if ($data === null) {
        echo "❌ Invalid JSON response<br>";
        echo "Raw response: " . htmlspecialchars($response) . "<br>";
        continue;
    }
    
    if (isset($data['success']) && $data['success']) {
        echo "✅ Success<br>";
        echo "Data: <pre>" . print_r($data['data'], true) . "</pre>";
    } else {
        echo "❌ API Error: " . (isset($data['message']) ? $data['message'] : 'Unknown error') . "<br>";
    }
    
    echo "<br>";
}

echo "<p><a href='test_amount_api.php'>Test Amount API</a> | <a href='index.html'>Payment Form</a></p>";
?>
