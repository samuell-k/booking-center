# SmartSports Rwanda Backend API

A comprehensive sports ticketing platform backend built with Node.js, PostgreSQL, and Redis. This API powers the SmartSports Rwanda ecosystem including web applications, mobile apps, and scanner devices.

## 🚀 Features

### Core Features
- **User Management**: Registration, authentication, profile management
- **Event Management**: Create and manage sports events and matches
- **Ticketing System**: Digital ticket generation with QR codes
- **Payment Processing**: Multiple payment methods (MTN MoMo, Airtel Money, Cards, Bank transfers)
- **Digital Wallet**: Built-in wallet system for users
- **Team Management**: Team profiles and analytics dashboards
- **Venue Management**: Venue information and capacity management
- **Scanner Integration**: QR code validation for entry systems
- **Notifications**: Email, SMS, and push notifications
- **Analytics**: Comprehensive reporting and analytics

### Payment Methods
- **MTN Mobile Money**: Direct integration with MTN MoMo API
- **Airtel Money**: Direct integration with Airtel Money API
- **Bank Transfers**: Rwanda Payment Gateway (RSwitch) integration
- **Credit/Debit Cards**: Stripe and local card processing
- **Digital Wallet**: Internal wallet system with top-up functionality

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse and DDoS
- **Data Encryption**: Sensitive data encryption at rest and in transit
- **QR Code Security**: Signed QR codes with tamper detection
- **Fraud Detection**: Built-in fraud scoring and detection
- **Audit Logging**: Comprehensive audit trails

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Cache**: Redis 6+
- **Authentication**: JWT + Passport.js
- **Payment APIs**: MTN MoMo, Airtel Money, RSwitch, Stripe
- **Notifications**: Twilio, Africa's Talking, NodeMailer
- **QR Codes**: qrcode library with custom security
- **File Storage**: AWS S3 compatible
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest + Supertest
- **Monitoring**: Winston logging

## 📋 Prerequisites

- Node.js 18.0 or higher
- PostgreSQL 14.0 or higher
- Redis 6.0 or higher
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/newtechnology12/smartsports-rw-backend.git
   cd smartsports-rw-backend/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Create database
   createdb smartsports_rwanda
   
   # Run migrations
   npm run migrate
   
   # Seed initial data (optional)
   npm run seed
   ```

5. **Start Redis server**
   ```bash
   redis-server
   ```

6. **Start the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔐 Environment Variables

### Required Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/smartsports_rwanda
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartsports_rwanda
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Mobile Money APIs
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_SUBSCRIPTION_KEY=your_mtn_key
AIRTEL_MONEY_CLIENT_ID=your_airtel_client_id
AIRTEL_MONEY_CLIENT_SECRET=your_airtel_secret

# Notifications
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 📚 API Documentation

The API documentation is available at:
- **Development**: http://localhost:5000/api/docs
- **Production**: https://api.smartsports.rw/api/docs

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token

#### Events
- `GET /api/v1/events` - List events
- `POST /api/v1/events` - Create event
- `GET /api/v1/events/:id` - Get event details
- `PUT /api/v1/events/:id` - Update event

#### Tickets
- `POST /api/v1/tickets/purchase` - Purchase tickets
- `GET /api/v1/tickets/user/:userId` - Get user tickets
- `POST /api/v1/tickets/transfer` - Transfer ticket

#### Payments
- `POST /api/v1/payments/initiate` - Initiate payment
- `GET /api/v1/payments/:id/status` - Check payment status
- `POST /api/v1/payments/webhook` - Payment webhooks

#### Scanner
- `POST /api/v1/scanner/validate` - Validate QR code
- `POST /api/v1/scanner/scan` - Process ticket scan

## 🏗 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── database/        # Database migrations and seeds
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── server.js        # Application entry point
├── tests/               # Test files
├── logs/                # Log files
├── .env.example         # Environment variables template
├── knexfile.js          # Database configuration
└── package.json         # Dependencies and scripts
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Database Schema

The database includes the following main tables:
- `users` - User accounts and profiles
- `teams` - Sports teams information
- `venues` - Event venues and facilities
- `events` - Sports events and matches
- `tickets` - Digital tickets with QR codes
- `payments` - Payment transactions
- `wallets` - User digital wallets
- `wallet_transactions` - Wallet transaction history
- `notifications` - System notifications
- `scanner_logs` - QR code scan logs

## 🔄 Database Migrations

```bash
# Create new migration
npx knex migrate:make migration_name

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Reset database
npm run migrate:rollback --all
npm run migrate
```

## 📱 Mobile Money Integration

### MTN Mobile Money
- Sandbox: `https://sandbox.momodeveloper.mtn.com`
- Production: `https://api.mtn.com`
- Supported: Collections, Disbursements

### Airtel Money
- Sandbox: `https://openapiuat.airtel.africa`
- Production: `https://openapi.airtel.africa`
- Supported: Merchant payments

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t smartsports-backend .

# Run container
docker run -p 5000:5000 --env-file .env smartsports-backend
```

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure production database
- [ ] Set up Redis cluster
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies
- [ ] Set up CI/CD pipeline

## 📈 Monitoring and Logging

- **Logs**: Winston logger with file and console transports
- **Health Check**: `/health` endpoint for monitoring
- **Metrics**: Built-in performance monitoring
- **Error Tracking**: Comprehensive error logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@smartsports.rw
- Documentation: https://docs.smartsports.rw
- Issues: https://github.com/newtechnology12/smartsports-rw-backend/issues

## 🔮 Roadmap

- [ ] Machine Learning fraud detection
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Blockchain ticket verification
- [ ] IoT scanner integration
- [ ] Advanced reporting features
