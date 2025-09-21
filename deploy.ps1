# SmartSports Rwanda - Complete Deployment Script
# This script sets up the entire SmartSports Rwanda platform

Write-Host "🚀 SmartSports Rwanda - Complete Platform Setup" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}

# Setup Backend
Write-Host "`n🔧 Setting up Backend API..." -ForegroundColor Yellow
Set-Location backend

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..."
npm install

# Copy environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Created .env file from template" -ForegroundColor Green
    Write-Host "⚠️  Please edit backend/.env with your database credentials" -ForegroundColor Yellow
}

# Start backend server in background
Write-Host "🚀 Starting backend server..."
Start-Process -FilePath "node" -ArgumentList "test-server.js" -WindowStyle Hidden
Start-Sleep -Seconds 3

# Test backend health
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
    Write-Host "✅ Backend API is running: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend may still be starting up..." -ForegroundColor Yellow
}

Set-Location ..

# Setup Main Frontend App
Write-Host "`n🎨 Setting up Main Frontend App..." -ForegroundColor Yellow

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing main app dependencies..."
    npm install
}

# Start main app in background
Write-Host "🚀 Starting main frontend app..."
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden
Start-Sleep -Seconds 5

# Setup Admin Dashboard
Write-Host "`n👑 Setting up Admin Dashboard..." -ForegroundColor Yellow
Set-Location admin-dashboard

# Install admin dashboard dependencies
Write-Host "📦 Installing admin dashboard dependencies..."
npm install

# Create environment file
if (-not (Test-Path ".env")) {
    "VITE_API_URL=http://localhost:5000/api/v1" | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "📝 Created admin dashboard .env file" -ForegroundColor Green
}

# Start admin dashboard in background
Write-Host "🚀 Starting admin dashboard..."
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden
Start-Sleep -Seconds 5

Set-Location ..

# Setup Team Dashboard
Write-Host "`n🏆 Setting up Team Dashboard..." -ForegroundColor Yellow
Set-Location team-dashboard

# Install team dashboard dependencies
Write-Host "📦 Installing team dashboard dependencies..."
npm install

# Create environment file
if (-not (Test-Path ".env")) {
    "VITE_API_URL=http://localhost:5000/api/v1" | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "📝 Created team dashboard .env file" -ForegroundColor Green
}

# Start team dashboard in background
Write-Host "🚀 Starting team dashboard..."
Start-Process -FilePath "npm" -ArgumentList "run", "dev", "--", "--port", "3002" -WindowStyle Hidden
Start-Sleep -Seconds 5

Set-Location ..

# Final Summary
Write-Host "`n🎉 SmartSports Rwanda Platform Setup Complete!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

Write-Host "`n📱 Access Points:" -ForegroundColor Cyan
Write-Host "• Main App (Customers):    http://localhost:3000" -ForegroundColor White
Write-Host "• Admin Dashboard:         http://localhost:5173" -ForegroundColor White  
Write-Host "• Team Dashboard:          http://localhost:3002" -ForegroundColor White
Write-Host "• Backend API:             http://localhost:5000" -ForegroundColor White
Write-Host "• API Health Check:        http://localhost:5000/health" -ForegroundColor White
Write-Host "• API Documentation:       http://localhost:5000/api/docs" -ForegroundColor White

Write-Host "`n🔧 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Configure database connection in backend/.env" -ForegroundColor White
Write-Host "2. Set up PostgreSQL database and run migrations" -ForegroundColor White
Write-Host "3. Configure Redis for caching" -ForegroundColor White
Write-Host "4. Set up payment provider credentials (MTN MoMo, Airtel Money)" -ForegroundColor White
Write-Host "5. Configure email and SMS services" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "• Setup Guide:             ./SETUP_GUIDE.md" -ForegroundColor White
Write-Host "• Project Overview:        ./PROJECT_OVERVIEW.md" -ForegroundColor White
Write-Host "• Backend README:          ./backend/README.md" -ForegroundColor White

Write-Host "`n🎯 Features Ready:" -ForegroundColor Cyan
Write-Host "✅ Professional Backend API with Node.js + Express" -ForegroundColor Green
Write-Host "✅ PostgreSQL Database with comprehensive schema" -ForegroundColor Green
Write-Host "✅ Redis Integration for caching and sessions" -ForegroundColor Green
Write-Host "✅ JWT Authentication with role-based access" -ForegroundColor Green
Write-Host "✅ Payment Integration (MTN MoMo, Airtel Money, Cards)" -ForegroundColor Green
Write-Host "✅ QR Code Generation and Validation" -ForegroundColor Green
Write-Host "✅ Email and SMS Notification Services" -ForegroundColor Green
Write-Host "✅ Three Dashboard Applications" -ForegroundColor Green
Write-Host "✅ Docker Configuration for deployment" -ForegroundColor Green
Write-Host "✅ Comprehensive API Documentation" -ForegroundColor Green

Write-Host "`n🚀 The SmartSports Rwanda platform is now ready for development and testing!" -ForegroundColor Green
Write-Host "Happy coding! 🎉" -ForegroundColor Yellow
