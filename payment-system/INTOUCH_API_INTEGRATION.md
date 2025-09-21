# InTouch API Integration for Amount Retrieval

## Overview

The payment system has been updated to retrieve actual transaction amounts from the InTouch API instead of relying solely on local database amounts. This ensures that the displayed amounts reflect the actual processed amounts from the payment gateway.

## Changes Made

### 1. New IntouchApiService Class

**File:** `services/IntouchApiService.php`

A dedicated service class for handling all InTouch API interactions:

- `getAccountBalance()` - Retrieves account balance from InTouch API
- `getTransactionStatus()` - Gets transaction status and amount from API
- `getTransactionAmount()` - Specifically retrieves transaction amount
- `getBatchTransactionAmounts()` - Efficiently processes multiple transactions
- `testConnection()` - Tests API connectivity

### 2. Updated AmountService Class

**File:** `services/AmountService.php`

Enhanced to integrate with InTouch API:

- **API Integration**: Now uses `IntouchApiService` for amount retrieval
- **Fallback Mechanism**: Falls back to local database amounts if API calls fail
- **Batch Processing**: Uses batch API calls for better performance
- **Caching**: Maintains caching for performance while ensuring data accuracy

### 3. Key Methods Updated

#### `getAmountSummary()`
- Now retrieves actual amounts from InTouch API for successful transactions
- Overrides database amounts with API amounts when available
- Maintains fallback to local amounts for reliability

#### `calculateTotalAmount()`
- For successful transactions, queries InTouch API for actual amounts
- Uses batch processing to minimize API calls
- Preserves filtering functionality while ensuring accurate amounts

#### `getActualAmountsFromAPI()` (New)
- Private method that retrieves amounts from API for successful transactions
- Handles both total amounts and today's amounts
- Implements proper error handling and fallbacks

## How It Works

### 1. Amount Retrieval Flow

```
Dashboard Request → AmountService → Check if successful transactions exist
                                 ↓
                    IntouchApiService → InTouch API → Get actual amounts
                                 ↓
                    Fallback to local DB if API fails → Return combined results
```

### 2. API Call Optimization

- **Batch Processing**: Multiple transactions processed in single batch
- **Caching**: Results cached to avoid repeated API calls
- **Rate Limiting**: Small delays between API calls to avoid overwhelming the service
- **Timeout Handling**: 30-second timeout for API calls

### 3. Error Handling

- **API Failures**: Automatic fallback to local database amounts
- **Network Issues**: Graceful degradation with logging
- **Invalid Responses**: Proper validation and error logging
- **Timeout Scenarios**: Handled with appropriate fallbacks

## Configuration

### API Endpoints Used

- **Balance**: `https://www.intouchpay.co.rw/api/getbalance/`
- **Transaction Status**: `https://www.intouchpay.co.rw/api/gettransactionstatus/`

### Required Parameters

All API calls require:
- `username`: InTouch API username
- `timestamp`: Generated timestamp
- `password`: Generated password hash
- `accountno`: Account ID (for balance calls)
- `requesttransactionid`: Internal transaction ID
- `transactionid`: InTouch transaction ID

## Testing

### Test Script

**File:** `test_amount_api.php`

Comprehensive test script that verifies:

1. **API Connectivity**: Tests connection to InTouch API
2. **Balance Retrieval**: Verifies account balance can be retrieved
3. **Amount Integration**: Tests AmountService with API integration
4. **Performance**: Measures response times and caching effectiveness
5. **Error Handling**: Tests fallback mechanisms

### Running Tests

1. Access `test_amount_api.php` in your browser
2. Review the test results for each component
3. Check for any API connectivity issues
4. Verify that fallback mechanisms work correctly

## Benefits

### 1. Accuracy
- **Real Amounts**: Displays actual processed amounts from payment gateway
- **Up-to-date Data**: Always reflects current transaction status
- **Consistency**: Eliminates discrepancies between local and gateway amounts

### 2. Reliability
- **Fallback System**: Never fails completely due to API issues
- **Error Handling**: Graceful degradation when API is unavailable
- **Logging**: Comprehensive logging for troubleshooting

### 3. Performance
- **Caching**: Reduces repeated API calls
- **Batch Processing**: Minimizes API request overhead
- **Optimized Queries**: Efficient database and API usage

## Monitoring

### Log Messages

The system logs important events:

- API call successes and failures
- Fallback activations
- Performance metrics
- Error conditions

### Key Metrics to Monitor

1. **API Response Times**: Should be under 30 seconds
2. **Success Rates**: API calls should succeed >90% of the time
3. **Fallback Usage**: Monitor how often fallbacks are used
4. **Cache Hit Rates**: Verify caching is effective

## Troubleshooting

### Common Issues

1. **API Timeouts**
   - Check network connectivity
   - Verify InTouch API service status
   - Review timeout settings

2. **Authentication Errors**
   - Verify API credentials in `config.php`
   - Check password generation function
   - Ensure timestamp is correct

3. **Amount Discrepancies**
   - Check if API is returning expected amount fields
   - Verify transaction status mapping
   - Review fallback logic

### Debug Steps

1. Run `test_amount_api.php` to verify integration
2. Check log files for API call details
3. Verify database has correct transaction IDs
4. Test individual API calls manually

## Future Enhancements

1. **Real-time Updates**: Implement webhooks for instant amount updates
2. **Advanced Caching**: Implement Redis for distributed caching
3. **API Monitoring**: Add comprehensive API health monitoring
4. **Bulk Sync**: Periodic bulk synchronization of amounts
