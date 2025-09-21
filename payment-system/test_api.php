<?php
require_once 'config.php';

echo "<h2>IntouchPay API Test</h2>";

// Test 1: Check configuration
echo "<h3>1. Configuration Test</h3>";
echo "Username: " . INTOUCHPAY_USERNAME . "<br>";
echo "Account ID: " . INTOUCHPAY_ACCOUNT_ID . "<br>";
echo "API URL: " . INTOUCHPAY_REQUEST_PAYMENT_URL . "<br>";

// Test 2: Password generation
echo "<h3>2. Password Generation Test</h3>";
$timestamp = generateTimestamp();
$password = generatePassword(INTOUCHPAY_USERNAME, INTOUCHPAY_ACCOUNT_ID, INTOUCHPAY_PARTNER_PASSWORD, $timestamp);
echo "Timestamp: " . $timestamp . "<br>";
echo "Generated Password: " . $password . "<br>";

// Test 3: Phone number validation
echo "<h3>3. Phone Number Validation Test</h3>";
$testNumbers = [
    '250781234567', // Valid MTN
    '250721234567', // Valid Airtel
    '25078123456',  // Too short
    '2507812345678', // Too long
    '250881234567', // Invalid prefix
    'abcd1234567'   // Non-numeric
];

foreach ($testNumbers as $number) {
    $isValid = validateRwandanPhoneNumber($number) ? 'Valid' : 'Invalid';
    echo "Phone: $number - $isValid<br>";
}

// Test 4: Balance inquiry (if you want to test connectivity)
echo "<h3>4. Balance Inquiry Test</h3>";
$timestamp = generateTimestamp();
$password = generatePassword(INTOUCHPAY_USERNAME, INTOUCHPAY_ACCOUNT_ID, INTOUCHPAY_PARTNER_PASSWORD, $timestamp);

$data = [
    'username' => INTOUCHPAY_USERNAME,
    'timestamp' => $timestamp,
    'accountno' => INTOUCHPAY_ACCOUNT_ID,
    'password' => $password
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, INTOUCHPAY_GET_BALANCE_URL);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo "CURL Error: " . $curlError . "<br>";
} else {
    echo "HTTP Code: " . $httpCode . "<br>";
    echo "Response: " . $response . "<br>";
    
    $responseData = json_decode($response, true);
    if ($responseData) {
        echo "Parsed Response: <pre>" . print_r($responseData, true) . "</pre>";
    }
}

echo "<h3>5. System Status</h3>";
echo "PHP Version: " . phpversion() . "<br>";
echo "CURL Extension: " . (extension_loaded('curl') ? 'Available' : 'Not Available') . "<br>";
echo "JSON Extension: " . (extension_loaded('json') ? 'Available' : 'Not Available') . "<br>";
echo "Session Support: " . (function_exists('session_start') ? 'Available' : 'Not Available') . "<br>";

// Test session functionality
session_start();
$_SESSION['test'] = 'working';
echo "Session Test: " . (isset($_SESSION['test']) && $_SESSION['test'] === 'working' ? 'Working' : 'Not Working') . "<br>";

echo "<hr>";
echo "<p><strong>Note:</strong> If the balance inquiry test shows authentication errors, that's normal for testing. The important thing is that the connection is working.</p>";
echo "<p><a href='index.html'>Go to Payment Form</a></p>";
?>
