# IntouchPay Payment System

A PHP-based payment system integrated with IntouchPay API for processing mobile money payments in Rwanda.

## Features

- **Payment Processing**: Send payment requests to Rwandan mobile money accounts
- **Real-time Status Checking**: Automatically check payment status and notify users
- **Phone Number Validation**: Validates Rwandan phone numbers (MTN and Airtel)
- **Responsive Design**: Mobile-friendly payment form and dashboard
- **Payment Dashboard**: Comprehensive transaction monitoring and analytics
- **Database Storage**: Persistent transaction storage with MySQL
- **Data Filtering**: Advanced filtering by status, date, phone number, and more
- **Toast Notifications**: User-friendly notifications
- **Real-time Updates**: Dashboard auto-refreshes every 30 seconds

## Files Structure

```
payment-system/
├── home.html               # Landing page with navigation
├── index.html              # Main payment form
├── dashboard.html          # Payment dashboard interface
├── config.php              # Configuration and utility functions
├── process_payment.php     # Payment processing endpoint
├── callback.php            # IntouchPay callback handler
├── check_status.php        # Payment status checking endpoint
├── dashboard_api.php       # Dashboard data API endpoints
├── database_setup.sql      # Database schema and sample data
├── init_database.php       # Database initialization script
├── test_dashboard.php      # Dashboard system test script
├── test_api.php            # API testing page
├── DASHBOARD_SETUP.md      # Dashboard setup guide
├── README.md               # This file
└── payment_log.txt         # Log file (created automatically)
```

## Setup Instructions

### Basic Setup

1. **Configure Your Credentials**
   - Open `config.php`
   - Update the callback URL to match your domain:

     ```php
     define('CALLBACK_URL', 'http://yourdomain.com/payment-system/callback.php');
     ```

### Dashboard Setup

2. **Initialize Database**
   - Run the database setup script:

     ```bash
     php init_database.php
     ```

   - This creates the database, tables, and sample data

3. **Test the System**
   - Run the test script to verify everything works:

     ```bash
     php test_dashboard.php
     ```

4. **Access the System**
   - Landing page: `home.html`
   - Payment form: `index.html`
   - Dashboard: `dashboard.html`

### Testing and Usage

5. **Test the System**
   - Visit `test_api.php` in your browser to verify configuration
   - Check that all extensions are available and API connectivity works

6. **Use the Payment Form**
   - Open `index.html` in your browser
   - Enter amount (minimum 100 RWF) and phone number
   - Submit the form to process payment

7. **Monitor with Dashboard**
   - Access the dashboard to view real-time transaction data
   - Use filters to search and analyze payment history

## API Credentials Used

- **Username**: testa
- **Account ID**: 250160000011
- **Partner Password**: [Configured in config.php]

## How It Works

1. **Payment Request**: User submits form → `process_payment.php` → IntouchPay API
2. **User Approval**: Customer receives SMS/USSD prompt to approve payment
3. **Status Checking**: Frontend polls `check_status.php` every 10 seconds
4. **Completion**: IntouchPay sends callback to `callback.php` when payment is completed

## Phone Number Format

- Must be exactly 12 digits
- Must start with valid Rwandan prefixes:
  - MTN: 250078, 250079, 250781-250789
  - Airtel: 250072-250077, 250720-250729

## Error Handling

The system handles various error scenarios:
- Invalid phone numbers
- Network connectivity issues
- API authentication errors
- Payment failures
- Timeout scenarios

## Logging

All payment activities are logged to `payment_log.txt` for debugging and monitoring.

## Security Notes

- Passwords are generated using SHA256 encryption
- All API communications use HTTPS
- Session-based transaction tracking
- Input validation and sanitization

## Testing

1. Visit `test_api.php` to verify system configuration
2. Use the payment form with test amounts (minimum 100 RWF)
3. Check logs in `payment_log.txt` for debugging

## Support

For issues with IntouchPay API integration, contact IntouchPay support with your account details.
