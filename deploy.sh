#!/bin/bash

# SmartSports Rwanda - Professional Deployment Script
# Usage: ./deploy.sh [environment] [action]
# Example: ./deploy.sh production deploy
# Example: ./deploy.sh development start

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="smartsports-rw"
DOCKER_REGISTRY="your-registry.com"  # Change this to your Docker registry
VERSION=$(git rev-parse --short HEAD)
ENVIRONMENT=${1:-development}
ACTION=${2:-deploy}

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Git is installed
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    log_success "All requirements satisfied"
}

setup_environment() {
    log_info "Setting up environment: $ENVIRONMENT"
    
    # Copy environment file
    if [ "$ENVIRONMENT" = "production" ]; then
        if [ ! -f ".env.production" ]; then
            log_error ".env.production file not found. Please create it first."
            exit 1
        fi
        cp .env.production .env
        COMPOSE_FILE="docker-compose.prod.yml"
    else
        if [ ! -f ".env.development" ]; then
            log_warning ".env.development file not found. Using defaults."
        else
            cp .env.development .env
        fi
        COMPOSE_FILE="docker-compose.yml"
    fi
    
    log_success "Environment setup complete"
}

build_images() {
    log_info "Building Docker images..."
    
    # Build backend image
    log_info "Building backend image..."
    docker build -t ${PROJECT_NAME}-backend:${VERSION} -t ${PROJECT_NAME}-backend:latest ./backend
    
    # Build frontend image
    log_info "Building frontend image..."
    docker build -t ${PROJECT_NAME}-frontend:${VERSION} -t ${PROJECT_NAME}-frontend:latest .
    
    log_success "Docker images built successfully"
}

push_images() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "Pushing images to registry..."
        
        # Tag and push backend
        docker tag ${PROJECT_NAME}-backend:${VERSION} ${DOCKER_REGISTRY}/${PROJECT_NAME}-backend:${VERSION}
        docker tag ${PROJECT_NAME}-backend:latest ${DOCKER_REGISTRY}/${PROJECT_NAME}-backend:latest
        docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-backend:${VERSION}
        docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-backend:latest
        
        # Tag and push frontend
        docker tag ${PROJECT_NAME}-frontend:${VERSION} ${DOCKER_REGISTRY}/${PROJECT_NAME}-frontend:${VERSION}
        docker tag ${PROJECT_NAME}-frontend:latest ${DOCKER_REGISTRY}/${PROJECT_NAME}-frontend:latest
        docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-frontend:${VERSION}
        docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-frontend:latest
        
        log_success "Images pushed to registry"
    fi
}

deploy_application() {
    log_info "Deploying application..."
    
    # Stop existing containers
    docker-compose -f $COMPOSE_FILE down --remove-orphans
    
    # Pull latest images (for production)
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f $COMPOSE_FILE pull
    fi
    
    # Start services
    docker-compose -f $COMPOSE_FILE up -d
    
    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    check_health
    
    log_success "Application deployed successfully"
}

check_health() {
    log_info "Checking service health..."
    
    # Check backend health
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        log_success "Backend is healthy"
    else
        log_error "Backend health check failed"
        return 1
    fi
    
    # Check frontend health
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "Frontend is healthy"
    else
        log_error "Frontend health check failed"
        return 1
    fi
    
    log_success "All services are healthy"
}

run_migrations() {
    log_info "Running database migrations..."
    
    # Wait for database to be ready
    sleep 10
    
    # Run migrations
    docker-compose -f $COMPOSE_FILE exec backend npm run migrate
    
    log_success "Database migrations completed"
}

cleanup() {
    log_info "Cleaning up old images..."
    
    # Remove old images
    docker image prune -f
    
    log_success "Cleanup completed"
}

show_status() {
    log_info "Application Status:"
    docker-compose -f $COMPOSE_FILE ps
    
    log_info "Service URLs:"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:5000"
    echo "API Documentation: http://localhost:5000/api-docs"
    echo "Database: localhost:5432"
    echo "Redis: localhost:6379"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "Production URL: https://smartsports.rw"
        echo "API URL: https://api.smartsports.rw"
    fi
}

# Main execution
main() {
    log_info "Starting deployment for environment: $ENVIRONMENT"
    log_info "Action: $ACTION"
    log_info "Version: $VERSION"
    
    case $ACTION in
        "deploy")
            check_requirements
            setup_environment
            build_images
            push_images
            deploy_application
            run_migrations
            cleanup
            show_status
            ;;
        "start")
            setup_environment
            docker-compose -f $COMPOSE_FILE up -d
            show_status
            ;;
        "stop")
            setup_environment
            docker-compose -f $COMPOSE_FILE down
            ;;
        "restart")
            setup_environment
            docker-compose -f $COMPOSE_FILE restart
            show_status
            ;;
        "logs")
            setup_environment
            docker-compose -f $COMPOSE_FILE logs -f
            ;;
        "status")
            setup_environment
            show_status
            ;;
        "health")
            check_health
            ;;
        *)
            log_error "Unknown action: $ACTION"
            echo "Available actions: deploy, start, stop, restart, logs, status, health"
            exit 1
            ;;
    esac
    
    log_success "Operation completed successfully!"
}

# Run main function
main "$@"
