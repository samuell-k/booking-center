<?php
require_once 'config.php';

try {
    $dbService = DatabaseService::getInstance();
    
    echo "<h2>Current Database Structure</h2>";
    echo "<h3>Transactions Table Columns:</h3>";
    
    $columns = $dbService->query('DESCRIBE transactions');
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
    
    foreach ($columns as $column) {
        echo "<tr>";
        echo "<td>" . $column['Field'] . "</td>";
        echo "<td>" . $column['Type'] . "</td>";
        echo "<td>" . $column['Null'] . "</td>";
        echo "<td>" . $column['Key'] . "</td>";
        echo "<td>" . $column['Default'] . "</td>";
        echo "<td>" . $column['Extra'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // Check if transaction_type column exists
    $hasTransactionType = false;
    foreach ($columns as $column) {
        if ($column['Field'] === 'transaction_type') {
            $hasTransactionType = true;
            break;
        }
    }
    
    echo "<h3>Status:</h3>";
    if ($hasTransactionType) {
        echo "<p style='color: green;'>✓ transaction_type column exists</p>";
    } else {
        echo "<p style='color: red;'>✗ transaction_type column is missing</p>";
        echo "<p>You need to run the database update script or add the column manually.</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
}
?>
