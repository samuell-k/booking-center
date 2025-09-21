# Scaling Incidents Runbook

## Overview
This runbook covers procedures for handling high-traffic scenarios and scaling incidents in the SmartSports Rwanda ticketing system, designed to handle 10M+ concurrent users.

## Traffic Patterns and Triggers

### Expected High-Traffic Events
- **Major Match Announcements**: 2-5M concurrent users
- **Ticket Sales Opening**: 5-10M concurrent users  
- **Final Match Sales**: 10M+ concurrent users
- **Flash Sales/Promotions**: 3-8M concurrent users

### Scaling Triggers
- **CPU Usage**: >70% sustained for 5 minutes
- **Memory Usage**: >80% sustained for 3 minutes
- **Response Time**: >2s for 95th percentile
- **Error Rate**: >2% for 2 minutes
- **Database Connections**: >80% of pool size

## Severity Classification

### Critical (P0) - System Overload
- Response times >10s
- Error rates >10%
- Database connection pool exhausted
- Redis memory exhausted
- Complete service degradation

### High (P1) - Performance Degradation
- Response times >5s
- Error rates >5%
- High resource utilization (>90%)
- Some features unavailable

### Medium (P2) - Elevated Load
- Response times >2s
- Error rates >2%
- Resource utilization >70%
- Performance impact visible

## Immediate Response (First 5 minutes)

### 1. Assess Current Load
```bash
# Check system metrics
curl http://localhost:3000/internal/metrics | grep -E "(http_requests|db_connections|memory)"

# Check active connections
docker exec smartsports-postgres-primary psql -U $POSTGRES_USER -d $POSTGRES_DB \
  -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"

# Check Redis memory usage
docker exec smartsports-redis-primary redis-cli info memory | grep used_memory_human

# Check application response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/health
```

### 2. Enable Emergency Scaling
```bash
# Scale application containers immediately
docker-compose -f docker-compose.prod.yml up -d --scale app=5

# Enable Redis cluster mode if available
docker exec smartsports-redis-primary redis-cli cluster meet redis-node-2 6379

# Increase database connection limits temporarily
docker exec smartsports-postgres-primary psql -U postgres \
  -c "ALTER SYSTEM SET max_connections = 500; SELECT pg_reload_conf();"
```

### 3. Activate Load Shedding
```bash
# Enable rate limiting for non-critical endpoints
curl -X POST http://localhost:3000/admin/rate-limits \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "search_endpoints": {"requests_per_minute": 30},
    "analytics_endpoints": {"requests_per_minute": 10},
    "non_essential_endpoints": {"enabled": false}
  }'

# Enable queue for ticket purchases
curl -X POST http://localhost:3000/admin/queue-config \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"ticket_purchase_queue": {"enabled": true, "max_concurrent": 1000}}'
```

## Scaling Strategies

### Horizontal Scaling

#### Application Layer
```bash
# Scale to 10 application instances
docker-compose -f docker-compose.prod.yml up -d --scale app=10

# Update load balancer configuration
docker exec smartsports-nginx nginx -s reload

# Verify all instances are healthy
for i in {1..10}; do
  curl -f http://app-$i:3000/health || echo "Instance $i unhealthy"
done
```

#### Database Layer
```bash
# Add additional read replicas
docker run -d \
  --name smartsports-postgres-replica-2 \
  --network smartsports-network \
  -e POSTGRES_PRIMARY_HOST=postgres-primary \
  -e POSTGRES_REPLICATION_USER=$POSTGRES_REPLICATION_USER \
  -e POSTGRES_REPLICATION_PASSWORD=$POSTGRES_REPLICATION_PASSWORD \
  postgres:15-alpine

# Update application to use new replica
curl -X POST http://localhost:3000/admin/database-config \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "read_replicas": [
      "postgres-replica:5432",
      "postgres-replica-2:5432"
    ]
  }'
```

#### Redis Scaling
```bash
# Enable Redis Cluster mode
redis-cli --cluster create \
  redis-primary:6379 \
  redis-node-2:6379 \
  redis-node-3:6379 \
  --cluster-replicas 1

# Update application Redis configuration
curl -X POST http://localhost:3000/admin/redis-config \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "cluster_mode": true,
    "nodes": ["redis-primary:6379", "redis-node-2:6379", "redis-node-3:6379"]
  }'
```

### Vertical Scaling

#### Increase Container Resources
```bash
# Update docker-compose with higher resource limits
# app service:
#   deploy:
#     resources:
#       limits:
#         cpus: '4.0'
#         memory: 8G

# Restart with new limits
docker-compose -f docker-compose.prod.yml up -d app
```

#### Database Optimization
```bash
# Increase shared_buffers and work_mem temporarily
docker exec smartsports-postgres-primary psql -U postgres \
  -c "ALTER SYSTEM SET shared_buffers = '2GB';" \
  -c "ALTER SYSTEM SET work_mem = '256MB';" \
  -c "SELECT pg_reload_conf();"

# Increase connection pool sizes
docker exec smartsports-pgbouncer \
  sed -i 's/default_pool_size = 50/default_pool_size = 100/' /etc/pgbouncer/pgbouncer.ini
docker exec smartsports-pgbouncer kill -HUP 1
```

## Load Shedding Strategies

### 1. Feature Degradation
```bash
# Disable non-essential features
curl -X POST http://localhost:3000/admin/feature-flags \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "analytics_tracking": false,
    "recommendation_engine": false,
    "social_features": false,
    "email_notifications": false
  }'
```

### 2. Cache Optimization
```bash
# Increase cache TTL for static content
curl -X POST http://localhost:3000/admin/cache-config \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "event_list_ttl": 300,
    "venue_info_ttl": 3600,
    "team_info_ttl": 3600,
    "static_content_ttl": 7200
  }'

# Pre-warm critical caches
node scripts/cache-warmup.js --events --venues --teams
```

### 3. Database Query Optimization
```bash
# Enable query result caching
docker exec smartsports-postgres-primary psql -U postgres \
  -c "ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';" \
  -c "SELECT pg_reload_conf();"

# Analyze slow queries
docker exec smartsports-postgres-primary psql -U $POSTGRES_USER -d $POSTGRES_DB \
  -c "SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## Queue Management

### Ticket Purchase Queue
```bash
# Enable virtual queue for ticket purchases
curl -X POST http://localhost:3000/admin/queue-config \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "virtual_queue": {
      "enabled": true,
      "max_concurrent_users": 5000,
      "queue_timeout": 1800,
      "estimated_wait_time": true
    }
  }'

# Monitor queue status
watch -n 10 'curl -s http://localhost:3000/admin/queue-status | jq'
```

### Payment Processing Queue
```bash
# Enable payment processing queue
curl -X POST http://localhost:3000/admin/payment-queue \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "enabled": true,
    "max_concurrent_payments": 1000,
    "retry_failed_payments": true,
    "queue_timeout": 600
  }'
```

## Monitoring During High Load

### Real-time Metrics
```bash
# Monitor key metrics every 30 seconds
watch -n 30 '
echo "=== System Status ==="
curl -s http://localhost:3000/internal/metrics | grep -E "(http_requests_total|db_connections_active|redis_connections)"
echo ""
echo "=== Response Times ==="
curl -w "Total: %{time_total}s\n" -o /dev/null -s http://localhost:3000/api/v1/events
echo ""
echo "=== Error Rate ==="
curl -s http://localhost:9090/api/v1/query?query=rate(smartsports_errors_total[1m]) | jq -r ".data.result[0].value[1]"
'
```

### Automated Scaling Triggers
```bash
#!/bin/bash
# /scripts/auto_scale.sh

# Get current metrics
CPU_USAGE=$(docker stats --no-stream --format "table {{.CPUPerc}}" smartsports-app | tail -n +2 | sed 's/%//' | head -1)
MEMORY_USAGE=$(docker stats --no-stream --format "table {{.MemPerc}}" smartsports-app | tail -n +2 | sed 's/%//' | head -1)
RESPONSE_TIME=$(curl -w "%{time_total}" -o /dev/null -s http://localhost:3000/health)

# Scale up if thresholds exceeded
if (( $(echo "$CPU_USAGE > 70" | bc -l) )) || (( $(echo "$MEMORY_USAGE > 80" | bc -l) )) || (( $(echo "$RESPONSE_TIME > 2" | bc -l) )); then
    echo "Scaling up due to high load"
    docker-compose -f docker-compose.prod.yml up -d --scale app=8
    
    # Notify team
    curl -X POST $SLACK_WEBHOOK_URL \
      -d "{\"text\":\"🔺 Auto-scaling triggered: CPU: ${CPU_USAGE}%, Memory: ${MEMORY_USAGE}%, Response: ${RESPONSE_TIME}s\"}"
fi
```

## Recovery Procedures

### 1. Gradual Scale Down
```bash
# After load decreases, gradually scale down
# Wait for 15 minutes of stable low load before scaling down

# Scale down to 6 instances
docker-compose -f docker-compose.prod.yml up -d --scale app=6
sleep 300  # Wait 5 minutes

# Scale down to 4 instances
docker-compose -f docker-compose.prod.yml up -d --scale app=4
sleep 300

# Scale down to normal 2 instances
docker-compose -f docker-compose.prod.yml up -d --scale app=2
```

### 2. Re-enable Features
```bash
# Re-enable disabled features gradually
curl -X POST http://localhost:3000/admin/feature-flags \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "analytics_tracking": true,
    "email_notifications": true
  }'

# Wait 10 minutes, then enable remaining features
sleep 600

curl -X POST http://localhost:3000/admin/feature-flags \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "recommendation_engine": true,
    "social_features": true
  }'
```

### 3. Reset Configuration
```bash
# Reset database settings to normal
docker exec smartsports-postgres-primary psql -U postgres \
  -c "ALTER SYSTEM RESET shared_buffers;" \
  -c "ALTER SYSTEM RESET work_mem;" \
  -c "ALTER SYSTEM RESET max_connections;" \
  -c "SELECT pg_reload_conf();"

# Reset cache TTL to normal values
curl -X POST http://localhost:3000/admin/cache-config \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "event_list_ttl": 60,
    "venue_info_ttl": 300,
    "team_info_ttl": 300,
    "static_content_ttl": 1800
  }'
```

## Capacity Planning

### Pre-event Scaling
```bash
# 2 hours before major event
# Scale up proactively
docker-compose -f docker-compose.prod.yml up -d --scale app=6

# 1 hour before event
# Full scale up
docker-compose -f docker-compose.prod.yml up -d --scale app=10

# Enable all optimizations
curl -X POST http://localhost:3000/admin/performance-mode \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"high_performance_mode": true}'
```

### Resource Monitoring
```bash
# Monitor resource usage trends
node scripts/generate-capacity-report.js \
  --period="last_30_days" \
  --output="/reports/capacity-$(date +%Y%m).json"

# Predict scaling needs
node scripts/predict-scaling-needs.js \
  --event-date="2024-02-15" \
  --expected-users=8000000
```

## Emergency Contacts

### Escalation Path
1. **On-call Engineer** (0-5 minutes): +250-XXX-XXXX
2. **Infrastructure Lead** (5-15 minutes): +250-XXX-XXXX  
3. **CTO** (15-30 minutes): +250-XXX-XXXX
4. **CEO** (30+ minutes): +250-XXX-XXXX

### External Contacts
- **Cloud Provider Support**: Priority support line
- **CDN Provider**: Emergency contact
- **Payment Providers**: Technical support

## Post-Incident Analysis

### Performance Report
```bash
# Generate detailed performance report
node scripts/generate-scaling-report.js \
  --incident-start="2024-01-01T14:00:00Z" \
  --incident-end="2024-01-01T18:00:00Z" \
  --output="/reports/scaling-incident-$(date +%Y%m%d).json"

# Analyze scaling effectiveness
node scripts/analyze-scaling-effectiveness.js \
  --report="/reports/scaling-incident-$(date +%Y%m%d).json"
```

### Lessons Learned
- Document what worked well
- Identify areas for improvement
- Update scaling thresholds
- Plan infrastructure upgrades
- Update runbooks with new procedures

### Capacity Planning Updates
- Review auto-scaling policies
- Update resource allocation
- Plan for next major event
- Consider infrastructure investments
