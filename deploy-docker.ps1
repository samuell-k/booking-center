# SmartSports Rwanda - Professional Docker Deployment Script (PowerShell)
# Usage: .\deploy-docker.ps1 -Environment production -Action deploy
# Example: .\deploy-docker.ps1 -Environment development -Action start

param(
    [string]$Environment = "development",
    [string]$Action = "deploy"
)

# Configuration
$ProjectName = "smartsports-rw"
$DockerRegistry = "your-registry.com"  # Change this to your Docker registry
$Version = (git rev-parse --short HEAD)

# Functions
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Test-Requirements {
    Write-Info "Checking requirements..."
    
    # Check Docker
    try {
        docker version | Out-Null
        Write-Success "Docker is available"
    } catch {
        Write-Error "Docker is not running. Please start Docker Desktop."
        exit 1
    }
    
    # Check Docker Compose
    try {
        docker-compose version | Out-Null
        Write-Success "Docker Compose is available"
    } catch {
        Write-Error "Docker Compose is not available."
        exit 1
    }
    
    # Check Git
    try {
        git --version | Out-Null
        Write-Success "Git is available"
    } catch {
        Write-Error "Git is not available."
        exit 1
    }
    
    Write-Success "All requirements satisfied"
}

function Set-Environment {
    Write-Info "Setting up environment: $Environment"
    
    if ($Environment -eq "production") {
        if (Test-Path ".env.production") {
            Copy-Item ".env.production" ".env" -Force
            $script:ComposeFile = "docker-compose.prod.yml"
        } else {
            Write-Error ".env.production file not found. Please create it first."
            exit 1
        }
    } else {
        if (Test-Path ".env.development") {
            Copy-Item ".env.development" ".env" -Force
        } else {
            Write-Warning ".env.development file not found. Using defaults."
        }
        $script:ComposeFile = "docker-compose.yml"
    }
    
    Write-Success "Environment setup complete"
}

function Build-Images {
    Write-Info "Building Docker images..."
    
    # Build backend image
    Write-Info "Building backend image..."
    docker build -t "${ProjectName}-backend:${Version}" -t "${ProjectName}-backend:latest" ./backend
    
    # Build frontend image
    Write-Info "Building frontend image..."
    docker build -t "${ProjectName}-frontend:${Version}" -t "${ProjectName}-frontend:latest" .
    
    Write-Success "Docker images built successfully"
}

function Deploy-Application {
    Write-Info "Deploying application..."
    
    # Stop existing containers
    docker-compose -f $ComposeFile down --remove-orphans
    
    # Pull latest images (for production)
    if ($Environment -eq "production") {
        docker-compose -f $ComposeFile pull
    }
    
    # Start services
    docker-compose -f $ComposeFile up -d
    
    # Wait for services to be healthy
    Write-Info "Waiting for services to be healthy..."
    Start-Sleep -Seconds 30
    
    # Check service health
    Test-Health
    
    Write-Success "Application deployed successfully"
}

function Test-Health {
    Write-Info "Checking service health..."
    
    # Check backend health
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "Backend is healthy"
        } else {
            Write-Error "Backend health check failed"
            return $false
        }
    } catch {
        Write-Error "Backend health check failed: $($_.Exception.Message)"
        return $false
    }
    
    # Check frontend health
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend is healthy"
        } else {
            Write-Error "Frontend health check failed"
            return $false
        }
    } catch {
        Write-Error "Frontend health check failed: $($_.Exception.Message)"
        return $false
    }
    
    Write-Success "All services are healthy"
    return $true
}

function Show-Status {
    Write-Info "Application Status:"
    docker-compose -f $ComposeFile ps
    
    Write-Info "Service URLs:"
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "API Documentation: http://localhost:5000/api-docs" -ForegroundColor Cyan
    Write-Host "Database: localhost:5432" -ForegroundColor Cyan
    Write-Host "Redis: localhost:6379" -ForegroundColor Cyan
    
    if ($Environment -eq "production") {
        Write-Host "Production URL: https://smartsports.rw" -ForegroundColor Magenta
        Write-Host "API URL: https://api.smartsports.rw" -ForegroundColor Magenta
    }
}

# Main execution
Write-Info "Starting deployment for environment: $Environment"
Write-Info "Action: $Action"
Write-Info "Version: $Version"

switch ($Action) {
    "deploy" {
        Test-Requirements
        Set-Environment
        Build-Images
        Deploy-Application
        Show-Status
    }
    "start" {
        Set-Environment
        docker-compose -f $ComposeFile up -d
        Show-Status
    }
    "stop" {
        Set-Environment
        docker-compose -f $ComposeFile down
    }
    "restart" {
        Set-Environment
        docker-compose -f $ComposeFile restart
        Show-Status
    }
    "logs" {
        Set-Environment
        docker-compose -f $ComposeFile logs -f
    }
    "status" {
        Set-Environment
        Show-Status
    }
    "health" {
        Test-Health
    }
    "build" {
        Test-Requirements
        Set-Environment
        Build-Images
    }
    default {
        Write-Error "Unknown action: $Action"
        Write-Host "Available actions: deploy, start, stop, restart, logs, status, health, build" -ForegroundColor Yellow
        exit 1
    }
}

Write-Success "Operation completed successfully!"
