# Payment Dashboard Setup Guide

## Overview
This guide will help you set up the complete payment dashboard system that provides comprehensive monitoring and management of all payment transactions.

## Features
- **Real-time Dashboard**: Live updates of payment statistics and transaction status
- **Transaction Management**: Complete transaction history with filtering and search
- **Payment Analytics**: Visual representation of payment data and trends
- **Status Tracking**: Clear distinction between pending, successful, and failed payments
- **User-friendly Interface**: Responsive design that works on all devices
- **Data Filtering**: Filter by status, date range, phone number, or transaction ID

## Files Added/Modified

### New Files:
1. `database_setup.sql` - Database schema for storing transactions
2. `init_database.php` - Database initialization script
3. `dashboard_api.php` - Backend API for dashboard data
4. `dashboard.html` - Main dashboard interface
5. `home.html` - Landing page with navigation options
6. `DASHBOARD_SETUP.md` - This setup guide

### Modified Files:
1. `process_payment.php` - Updated to store transactions in database
2. `callback.php` - Updated to update database on payment completion
3. `index.html` - Added navigation link to dashboard

## Setup Instructions

### Step 1: Database Setup
1. Make sure MySQL is running on your system
2. Run the database initialization script:
   ```bash
   php init_database.php
   ```
   This will:
   - Create the `payment_system` database
   - Create necessary tables (transactions, payment_stats, users)
   - Insert sample data for testing
   - Create database views for dashboard queries

### Step 2: Verify Configuration
1. Check `config.php` to ensure database credentials are correct:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'payment_system');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```

### Step 3: Test the System
1. **Access the Landing Page**: Open `home.html` in your browser
2. **Test Payment Form**: Click "Make Payment" to access the payment interface
3. **Test Dashboard**: Click "Payment Dashboard" to access the dashboard
4. **Make a Test Payment**: Use the payment form with a test amount (minimum 100 RWF)
5. **Verify Dashboard Updates**: Check that new transactions appear in the dashboard

## Dashboard Features

### Summary Cards
- **Total Transactions**: Shows total number of transactions
- **Successful Payments**: Shows successful transactions and success rate
- **Total Amount**: Shows total payment amount processed
- **Pending Payments**: Shows transactions awaiting approval

### Transaction Table
- **Complete Transaction History**: All transactions with full details
- **Status Indicators**: Color-coded status badges (green=success, yellow=pending, red=failed)
- **User Information**: Phone numbers and user names when available
- **Transaction IDs**: Both internal and IntouchPay transaction IDs
- **Timestamps**: Creation and completion times

### Filtering Options
- **Status Filter**: Filter by pending, successful, or failed transactions
- **Search**: Search by phone number, user name, or transaction ID
- **Date Range**: Filter transactions by date range
- **Real-time Updates**: Dashboard refreshes automatically every 30 seconds

### Responsive Design
- **Mobile-friendly**: Optimized for mobile devices and tablets
- **Touch-friendly**: Large buttons and touch targets
- **Adaptive Layout**: Adjusts to different screen sizes

## API Endpoints

The dashboard uses the following API endpoints:

1. **Summary Data**: `dashboard_api.php?endpoint=summary`
   - Returns overall statistics and summary information

2. **Transactions**: `dashboard_api.php?endpoint=transactions`
   - Returns paginated transaction list with filtering options
   - Parameters: page, limit, status, search, date_from, date_to

3. **Statistics**: `dashboard_api.php?endpoint=stats`
   - Returns data for charts and analytics

4. **Recent Transactions**: `dashboard_api.php?endpoint=recent`
   - Returns the 10 most recent transactions

## Database Schema

### Transactions Table
- `id`: Primary key
- `request_transaction_id`: Internal transaction ID
- `intouchpay_transaction_id`: IntouchPay's transaction ID
- `phone_number`: Customer phone number
- `amount`: Payment amount in RWF
- `status`: Transaction status (pending, successful, failed)
- `response_code`: API response code
- `user_name`: Customer name (optional)
- `created_at`: Transaction creation time
- `completed_at`: Transaction completion time

### Payment Stats Table
- Daily aggregated statistics for analytics

### Users Table
- Customer information and payment history

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check MySQL is running
   - Verify database credentials in `config.php`
   - Ensure `payment_system` database exists

2. **Dashboard Not Loading Data**
   - Check browser console for JavaScript errors
   - Verify `dashboard_api.php` is accessible
   - Check database connection

3. **Transactions Not Appearing**
   - Verify database is being updated in `process_payment.php`
   - Check payment processing is working correctly
   - Review error logs in `payment_log.txt`

### Performance Optimization:

1. **Database Indexes**: Already included in schema for optimal performance
2. **Pagination**: Implemented to handle large transaction volumes
3. **Caching**: Consider adding Redis/Memcached for high-traffic scenarios
4. **Auto-refresh**: Configurable refresh interval (default: 30 seconds)

## Security Considerations

1. **Input Validation**: All user inputs are validated and sanitized
2. **SQL Injection Protection**: Using prepared statements
3. **CORS Headers**: Properly configured for API access
4. **Error Handling**: Graceful error handling without exposing sensitive data

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Support

For technical support or questions:
1. Check the browser console for JavaScript errors
2. Review `payment_log.txt` for backend errors
3. Verify database connectivity and data integrity
4. Test API endpoints directly for debugging

The dashboard provides a comprehensive view of your payment system with real-time updates and powerful filtering capabilities.
