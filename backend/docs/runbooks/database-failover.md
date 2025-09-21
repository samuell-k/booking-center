# Database Failover Runbook

## Overview
This runbook covers procedures for handling PostgreSQL database failures and performing failover operations in the SmartSports Rwanda ticketing system.

## Prerequisites
- Access to production servers
- Database administrator privileges
- Monitoring dashboard access
- Emergency contact list

## Detection
Database issues can be detected through:
- Health check endpoint failures (`/health/database`)
- Prometheus alerts
- Application error logs
- User reports of service unavailability

## Severity Levels

### Critical (P0) - Complete Database Outage
- Primary database is completely unavailable
- All write operations failing
- Read operations failing on all replicas

### High (P1) - Primary Database Issues
- Primary database experiencing high latency (>5s)
- Some write operations failing
- Read replicas still functional

### Medium (P2) - Replica Issues
- One or more read replicas unavailable
- Primary database functioning normally
- Increased load on remaining replicas

## Immediate Response (First 5 minutes)

### 1. Assess the Situation
```bash
# Check database health
curl -f http://localhost:3000/health/database

# Check container status
docker ps | grep postgres

# Check logs
docker logs smartsports-postgres-primary --tail=100
docker logs smartsports-postgres-replica --tail=100
```

### 2. Verify Monitoring
```bash
# Check Prometheus metrics
curl http://localhost:9090/api/v1/query?query=smartsports_db_connections_active

# Check Grafana dashboard
# Navigate to Database Performance dashboard
```

### 3. Initial Triage
- Determine if issue is hardware, software, or network related
- Check if issue affects primary, replicas, or both
- Estimate impact on user traffic

## Failover Procedures

### Scenario 1: Primary Database Failure

#### Step 1: Promote Read Replica
```bash
# Stop the failed primary (if still running)
docker stop smartsports-postgres-primary

# Promote replica to primary
docker exec -it smartsports-postgres-replica bash

# Inside the replica container
su - postgres
pg_ctl promote -D /var/lib/postgresql/data
```

#### Step 2: Update Application Configuration
```bash
# Update environment variables
export DATABASE_URL="postgresql://user:pass@postgres-replica:5432/smartsports"

# Restart application containers
docker restart smartsports-app

# Update PgBouncer configuration
docker exec -it smartsports-pgbouncer bash
# Edit /etc/pgbouncer/pgbouncer.ini to point to new primary
# Reload configuration: kill -HUP 1
```

#### Step 3: Verify Failover
```bash
# Test write operations
curl -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"title":"Test Event","sport":"football"}'

# Check health endpoint
curl http://localhost:3000/health/database
```

### Scenario 2: Read Replica Failure

#### Step 1: Remove Failed Replica from Load Balancer
```bash
# Update application configuration to remove failed replica
# Edit database configuration to exclude failed replica endpoint

# Restart application
docker restart smartsports-app
```

#### Step 2: Monitor Primary Database Load
```bash
# Check connection count
docker exec smartsports-postgres-primary psql -U $POSTGRES_USER -d $POSTGRES_DB \
  -c "SELECT count(*) FROM pg_stat_activity;"

# Monitor query performance
docker exec smartsports-postgres-primary psql -U $POSTGRES_USER -d $POSTGRES_DB \
  -c "SELECT query, state, query_start FROM pg_stat_activity WHERE state = 'active';"
```

## Recovery Procedures

### Rebuilding Failed Primary as Replica

#### Step 1: Prepare New Replica
```bash
# Stop the failed primary container
docker stop smartsports-postgres-primary
docker rm smartsports-postgres-primary

# Remove old data
docker volume rm smartsports_postgres_primary_data
```

#### Step 2: Create New Replica
```bash
# Start new replica container
docker run -d \
  --name smartsports-postgres-replica-new \
  --network smartsports-network \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_PRIMARY_HOST=postgres-replica \
  -e POSTGRES_REPLICATION_USER=$POSTGRES_REPLICATION_USER \
  -e POSTGRES_REPLICATION_PASSWORD=$POSTGRES_REPLICATION_PASSWORD \
  -v postgres_replica_new_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

#### Step 3: Setup Replication
```bash
# Inside the new replica container
docker exec -it smartsports-postgres-replica-new bash

# Create base backup from current primary
pg_basebackup -h postgres-replica -D /var/lib/postgresql/data \
  -U $POSTGRES_REPLICATION_USER -v -P -W

# Configure recovery
echo "standby_mode = 'on'" >> /var/lib/postgresql/data/recovery.conf
echo "primary_conninfo = 'host=postgres-replica port=5432 user=$POSTGRES_REPLICATION_USER'" >> /var/lib/postgresql/data/recovery.conf

# Start PostgreSQL
pg_ctl start -D /var/lib/postgresql/data
```

## Monitoring and Alerting

### Key Metrics to Monitor
- Database connection count
- Query response time (p95, p99)
- Replication lag
- Disk space usage
- CPU and memory utilization

### Prometheus Alerts
```yaml
# Database connection alert
- alert: DatabaseHighConnections
  expr: smartsports_db_connections_active > 80
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "High database connection count"

# Replication lag alert
- alert: DatabaseReplicationLag
  expr: pg_replication_lag_seconds > 30
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Database replication lag is high"
```

## Post-Incident Actions

### 1. Document the Incident
- Root cause analysis
- Timeline of events
- Actions taken
- Lessons learned

### 2. Update Monitoring
- Add new alerts if gaps were identified
- Adjust thresholds based on incident learnings
- Update runbooks with new procedures

### 3. Capacity Planning
- Review database performance metrics
- Plan for additional replicas if needed
- Consider hardware upgrades

## Emergency Contacts

### On-Call Rotation
- Primary DBA: +250-XXX-XXXX
- Secondary DBA: +250-XXX-XXXX
- Infrastructure Team: +250-XXX-XXXX

### Escalation Matrix
1. **Level 1**: On-call DBA (0-15 minutes)
2. **Level 2**: Senior DBA + Infrastructure Lead (15-30 minutes)
3. **Level 3**: CTO + Engineering Manager (30+ minutes)

## Testing and Validation

### Monthly Failover Drill
```bash
# Schedule: First Saturday of each month at 2 AM
# Duration: 30 minutes
# Participants: On-call DBA, Infrastructure Engineer

# Test procedure:
1. Simulate primary database failure
2. Execute failover procedure
3. Verify application functionality
4. Restore original configuration
5. Document results and improvements
```

### Backup Validation
```bash
# Weekly backup restore test
# Schedule: Every Sunday at 3 AM

# Restore latest backup to test environment
pg_restore -h test-db -U postgres -d test_smartsports /backups/latest.dump

# Run data integrity checks
psql -h test-db -U postgres -d test_smartsports -f /scripts/data_validation.sql
```

## Automation Scripts

### Health Check Script
```bash
#!/bin/bash
# /scripts/db_health_check.sh

PRIMARY_HOST="postgres-primary"
REPLICA_HOST="postgres-replica"

# Check primary
if ! pg_isready -h $PRIMARY_HOST -p 5432; then
    echo "CRITICAL: Primary database is down"
    exit 2
fi

# Check replica
if ! pg_isready -h $REPLICA_HOST -p 5432; then
    echo "WARNING: Replica database is down"
    exit 1
fi

echo "OK: All databases are healthy"
exit 0
```

### Automatic Failover Script
```bash
#!/bin/bash
# /scripts/auto_failover.sh

# This script should only be used in extreme emergencies
# Manual intervention is preferred for production systems

if [ "$1" != "--confirm" ]; then
    echo "This script will perform automatic database failover"
    echo "Use --confirm flag to proceed"
    exit 1
fi

# Promote replica
docker exec smartsports-postgres-replica pg_ctl promote -D /var/lib/postgresql/data

# Update application configuration
# (Implementation depends on configuration management system)

# Send notifications
curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"Database failover completed automatically"}'
```
