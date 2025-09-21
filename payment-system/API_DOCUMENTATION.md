# Payment System API Documentation

## Overview

The Payment System API provides endpoints for retrieving payment data, transaction information, and amount calculations. All amount retrieval is handled through the API layer using service classes, ensuring proper abstraction from direct database access.

## Architecture

### Service Layer Architecture

The API follows a service-oriented architecture with the following layers:

1. **API Layer** (`dashboard_api.php`) - Handles HTTP requests and responses
2. **Service Layer** - Business logic and data processing
   - `AmountService` - Handles all amount-related operations
   - `DatabaseService` - Manages database operations
   - `CacheService` - Provides caching functionality
3. **Database Layer** - Data persistence

### Caching Strategy

- **Summary Data**: Cached for 5 minutes
- **Statistics**: Cached for 10 minutes  
- **Transactions**: Cached for 3 minutes
- **Recent Transactions**: Cached for 2 minutes

Cache is automatically invalidated when new transactions are processed.

## API Endpoints

### Base URL
```
http://localhost/payment-system/dashboard_api.php
```

### Authentication
Currently, no authentication is required. In production, implement proper authentication mechanisms.

---

## 1. Summary Endpoint

**Endpoint:** `GET /dashboard_api.php?endpoint=summary`

**Description:** Retrieves comprehensive payment summary including totals, success rates, and today's statistics.

**Response Format:**
```json
{
  "success": true,
  "data": {
    "total_transactions": 150,
    "successful_transactions": 142,
    "failed_transactions": 5,
    "pending_transactions": 3,
    "total_amount": 2500000.0,
    "successful_amount": 2350000.0,
    "average_amount": 16666.67,
    "success_rate": 94.7,
    "today_transactions": 12,
    "today_successful": 11,
    "today_amount": 180000.0,
    "last_transaction_date": "2025-06-28"
  }
}
```

**Amount Fields:**
- `total_amount`: Total amount of all transactions (RWF)
- `successful_amount`: Total amount of successful transactions (RWF)
- `average_amount`: Average transaction amount (RWF)
- `today_amount`: Total amount for today's transactions (RWF)

---

## 2. Transactions Endpoint

**Endpoint:** `GET /dashboard_api.php?endpoint=transactions`

**Description:** Retrieves paginated transaction list with filtering options.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status ('successful', 'failed', 'pending', 'all')
- `search` (optional): Search in phone number, user name, or transaction ID
- `date_from` (optional): Start date filter (YYYY-MM-DD)
- `date_to` (optional): End date filter (YYYY-MM-DD)

**Example Request:**
```
GET /dashboard_api.php?endpoint=transactions&page=1&limit=10&status=successful&date_from=2025-06-01
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "request_transaction_id": "TXN_20250628_1234",
        "intouchpay_transaction_id": "ITP_789456",
        "phone_number": "250781234567",
        "phone_formatted": "250 781 234 567",
        "amount": 5000.0,
        "status": "successful",
        "status_class": "success",
        "response_code": "01",
        "user_name": "John Doe",
        "created_at": "2025-06-28 10:30:00",
        "created_at_formatted": "Jun 28, 2025 10:30 AM",
        "completed_at": "2025-06-28 10:31:15"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 15,
      "total_records": 150,
      "per_page": 10,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

**Amount Fields:**
- `amount`: Transaction amount in RWF (float)

---

## 3. Statistics Endpoint

**Endpoint:** `GET /dashboard_api.php?endpoint=stats`

**Description:** Retrieves statistical data for charts and analytics including daily trends and status distribution.

**Response Format:**
```json
{
  "success": true,
  "data": {
    "daily_stats": [
      {
        "date": "2025-06-22",
        "total": 25,
        "successful": 23,
        "failed": 2,
        "amount": 450000.0
      },
      {
        "date": "2025-06-23",
        "total": 30,
        "successful": 28,
        "failed": 2,
        "amount": 520000.0
      }
    ],
    "status_distribution": [
      {
        "status": "successful",
        "count": 142,
        "amount": 2350000.0
      },
      {
        "status": "pending",
        "count": 3,
        "amount": 45000.0
      },
      {
        "status": "failed",
        "count": 5,
        "amount": 105000.0
      }
    ]
  }
}
```

**Amount Fields:**
- `daily_stats[].amount`: Daily total amount (RWF)
- `status_distribution[].amount`: Total amount per status (RWF)

---

## 4. Recent Transactions Endpoint

**Endpoint:** `GET /dashboard_api.php?endpoint=recent`

**Description:** Retrieves the 10 most recent transactions.

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 150,
      "request_transaction_id": "TXN_20250628_5678",
      "intouchpay_transaction_id": "ITP_123789",
      "phone_number": "250788765432",
      "phone_formatted": "250 788 765 432",
      "amount": 15000.0,
      "status": "successful",
      "status_class": "success",
      "response_code": "01",
      "user_name": "Jane Smith",
      "created_at": "2025-06-28 14:45:00",
      "created_at_formatted": "Jun 28, 2025 2:45 PM",
      "completed_at": "2025-06-28 14:46:30"
    }
  ]
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common Error Scenarios:**
- Invalid endpoint
- Database connection failure
- Service layer exceptions
- Cache failures (gracefully handled)

---

## Amount Service Methods

The `AmountService` class provides additional methods for amount calculations:

### Available Methods

1. **`getAmountSummary()`** - Used by summary endpoint
2. **`getAmountStatistics($days)`** - Used by stats endpoint
3. **`calculateTotalAmount($filters)`** - Calculate amounts with custom filters
4. **`getAmountBreakdownByStatus()`** - Get amount breakdown by transaction status
5. **`getMonthlyAmountTrends($months)`** - Get monthly amount trends
6. **`validateAmount($amount)`** - Validate amount according to business rules
7. **`formatCurrency($amount)`** - Format amount as RWF currency
8. **`getAmountStatsForPeriod($startDate, $endDate)`** - Get amount stats for date range

### Custom Amount Calculations

Example usage for custom amount calculations:

```php
$amountService = AmountService::getInstance();

// Calculate total for successful transactions in date range
$filters = [
    'status' => ['successful'],
    'date_from' => '2025-06-01',
    'date_to' => '2025-06-30'
];
$result = $amountService->calculateTotalAmount($filters);

// Get monthly trends
$trends = $amountService->getMonthlyAmountTrends(6); // Last 6 months
```

---

## Cache Management

### Cache Invalidation

Cache is automatically invalidated when:
- New transactions are created
- Transaction status is updated
- Manual cache clearing is triggered

### Manual Cache Operations

```php
$cache = CacheService::getInstance();

// Clear all amount-related caches
$cache->invalidateAmountCaches();

// Clear all cache
$cache->clear();

// Get cache statistics
$stats = $cache->getStats();
```

---

## Performance Considerations

1. **Caching**: All amount calculations are cached to reduce database load
2. **Pagination**: Transaction lists are paginated to handle large datasets
3. **Indexing**: Database views are used for optimized summary queries
4. **Service Layer**: Business logic is separated for better maintainability

---

## Security Notes

1. **Input Validation**: All parameters are validated and sanitized
2. **SQL Injection**: Prepared statements are used throughout
3. **Error Handling**: Detailed errors are logged but not exposed to clients
4. **Rate Limiting**: Consider implementing rate limiting in production

---

## Integration Examples

### JavaScript Frontend Integration

```javascript
// Get summary data
async function loadSummary() {
    const response = await fetch('dashboard_api.php?endpoint=summary');
    const data = await response.json();
    
    if (data.success) {
        console.log('Total Amount:', data.data.total_amount);
        console.log('Success Rate:', data.data.success_rate + '%');
    }
}

// Get filtered transactions
async function loadTransactions(filters) {
    const params = new URLSearchParams({
        endpoint: 'transactions',
        ...filters
    });
    
    const response = await fetch(`dashboard_api.php?${params}`);
    const data = await response.json();
    
    return data.success ? data.data : null;
}
```

This API ensures that all amount retrieval goes through the proper service layer, providing consistent data access, caching, and error handling.
