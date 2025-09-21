# Payment System Downtime Runbook

## Overview
This runbook covers procedures for handling payment provider outages and payment system failures in the SmartSports Rwanda ticketing system.

## Payment Providers
- **MTN MoMo**: Primary mobile money provider
- **Airtel Money**: Secondary mobile money provider  
- **RSwitch**: Bank card and transfer gateway
- **Internal Wallet**: User wallet system

## Detection and Monitoring

### Automated Detection
- Health check endpoints (`/health/mtn_momo`, `/health/airtel_money`, `/health/rswitch`)
- Payment failure rate alerts (>5% failure rate)
- Response time alerts (>10s response time)
- Webhook delivery failures

### Manual Detection Indicators
- User complaints about payment failures
- Increased support tickets
- Payment provider status page updates
- Partner notifications

## Severity Classification

### Critical (P0) - All Payment Methods Down
- All payment providers unavailable
- No payments can be processed
- Complete revenue impact

### High (P1) - Primary Provider Down
- MTN MoMo (primary provider) unavailable
- 60%+ of payment volume affected
- Significant revenue impact

### Medium (P2) - Secondary Provider Down
- Airtel Money or RSwitch unavailable
- <40% of payment volume affected
- Moderate revenue impact

### Low (P3) - Intermittent Issues
- Occasional payment failures
- <5% failure rate
- Minimal revenue impact

## Immediate Response (First 10 minutes)

### 1. Assess Impact
```bash
# Check payment provider health
curl http://localhost:3000/health/mtn_momo
curl http://localhost:3000/health/airtel_money
curl http://localhost:3000/health/rswitch

# Check recent payment metrics
curl http://localhost:3000/internal/metrics | grep payment

# Review payment failure logs
docker logs smartsports-app | grep "payment.*failed" | tail -50
```

### 2. Verify Provider Status
```bash
# Check MTN MoMo API status
curl -H "Ocp-Apim-Subscription-Key: $MTN_SUBSCRIPTION_KEY" \
  https://sandbox.momodeveloper.mtn.com/collection/v1_0/accountbalance

# Check Airtel Money API status  
curl -X POST https://openapiuat.airtel.africa/auth/oauth2/token \
  -H "Content-Type: application/json" \
  -d '{"client_id":"'$AIRTEL_CLIENT_ID'","client_secret":"'$AIRTEL_CLIENT_SECRET'","grant_type":"client_credentials"}'

# Check RSwitch status
curl -H "Authorization: Bearer $RSWITCH_API_KEY" \
  https://api.rswitch.rw/health
```

### 3. Enable Failover Mechanisms
```bash
# Update payment service configuration to use backup providers
docker exec smartsports-app node -e "
const config = require('./src/config/payment');
config.enableFailover = true;
config.preferredProviders = ['airtel_money', 'wallet'];
"

# Restart payment service
docker restart smartsports-app
```

## Provider-Specific Procedures

### MTN MoMo Outage

#### Immediate Actions
1. **Enable Airtel Money as Primary**
```bash
# Update payment routing configuration
curl -X POST http://localhost:3000/admin/payment-config \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "primary_provider": "airtel_money",
    "fallback_providers": ["wallet", "rswitch"],
    "mtn_momo_enabled": false
  }'
```

2. **Display User Notification**
```bash
# Enable maintenance banner
curl -X POST http://localhost:3000/admin/system-banner \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "MTN MoMo payments temporarily unavailable. Please use Airtel Money or other payment methods.",
    "type": "warning",
    "enabled": true
  }'
```

3. **Queue Failed Payments for Retry**
```bash
# Enable payment retry queue
docker exec smartsports-app node scripts/enable-payment-retry.js --provider=mtn_momo
```

#### Recovery Actions
1. **Test Provider Connectivity**
```bash
# Test MTN MoMo API
node scripts/test-payment-provider.js --provider=mtn_momo --test-mode
```

2. **Gradual Re-enablement**
```bash
# Enable MTN MoMo for 10% of traffic
curl -X POST http://localhost:3000/admin/payment-config \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mtn_momo_enabled": true,
    "mtn_momo_traffic_percentage": 10
  }'

# Monitor for 15 minutes, then increase to 50%
# Monitor for 30 minutes, then increase to 100%
```

### Airtel Money Outage

#### Immediate Actions
1. **Route Traffic to MTN MoMo and Wallet**
```bash
curl -X POST http://localhost:3000/admin/payment-config \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "airtel_money_enabled": false,
    "primary_provider": "mtn_momo",
    "fallback_providers": ["wallet", "rswitch"]
  }'
```

2. **Update User Interface**
```bash
# Hide Airtel Money option temporarily
curl -X POST http://localhost:3000/admin/payment-methods \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "airtel_money": {
      "enabled": false,
      "message": "Temporarily unavailable"
    }
  }'
```

### RSwitch Outage

#### Immediate Actions
1. **Disable Card Payments**
```bash
curl -X POST http://localhost:3000/admin/payment-config \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rswitch_enabled": false,
    "card_payments_enabled": false
  }'
```

2. **Promote Mobile Money Options**
```bash
# Update payment method ordering
curl -X POST http://localhost:3000/admin/payment-methods \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method_order": ["mtn_momo", "airtel_money", "wallet"],
    "promoted_methods": ["mtn_momo", "airtel_money"]
  }'
```

## Communication Procedures

### Internal Communication
1. **Slack Notification**
```bash
curl -X POST $SLACK_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "text": "🚨 Payment Provider Alert",
    "attachments": [{
      "color": "danger",
      "fields": [{
        "title": "Provider",
        "value": "MTN MoMo",
        "short": true
      }, {
        "title": "Status", 
        "value": "Down",
        "short": true
      }, {
        "title": "Impact",
        "value": "60% of payment volume affected",
        "short": false
      }]
    }]
  }'
```

2. **Email Stakeholders**
```bash
# Send email to stakeholders
node scripts/send-incident-email.js \
  --type="payment_outage" \
  --provider="mtn_momo" \
  --severity="high" \
  --recipients="cto@smartsports.rw,ops@smartsports.rw"
```

### External Communication
1. **Social Media Update**
```text
Template:
"We're experiencing temporary issues with [Provider] payments. 
Other payment methods are working normally. 
We're working to resolve this quickly. 
Updates: smartsports.rw/status"
```

2. **Website Banner**
```bash
# Update status page
curl -X POST https://status.smartsports.rw/api/incidents \
  -H "Authorization: Bearer $STATUS_PAGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MTN MoMo Payment Issues",
    "status": "investigating",
    "message": "We are investigating issues with MTN MoMo payments. Other payment methods are working normally.",
    "component_ids": ["payment_system"]
  }'
```

## Monitoring During Outage

### Key Metrics to Track
```bash
# Payment success rate by provider
curl http://localhost:9090/api/v1/query?query=rate(smartsports_payments_processed_total[5m])

# Payment response times
curl http://localhost:9090/api/v1/query?query=smartsports_payment_response_time_seconds

# Failed payment count
curl http://localhost:9090/api/v1/query?query=increase(smartsports_payment_failures_total[1h])

# User conversion rate
curl http://localhost:9090/api/v1/query?query=rate(smartsports_tickets_sold_total[5m])
```

### Dashboard Monitoring
- Payment provider health dashboard
- Revenue impact dashboard  
- User experience metrics
- Support ticket volume

## Recovery Procedures

### 1. Provider Recovery Verification
```bash
# Test all payment flows
node scripts/test-payment-flows.js --comprehensive

# Verify webhook delivery
node scripts/test-webhooks.js --all-providers

# Check payment reconciliation
node scripts/reconcile-payments.js --date=today
```

### 2. Gradual Traffic Restoration
```bash
# Phase 1: 10% traffic for 15 minutes
curl -X POST http://localhost:3000/admin/payment-config \
  -d '{"provider_traffic_percentage": {"mtn_momo": 10}}'

# Phase 2: 50% traffic for 30 minutes  
curl -X POST http://localhost:3000/admin/payment-config \
  -d '{"provider_traffic_percentage": {"mtn_momo": 50}}'

# Phase 3: 100% traffic
curl -X POST http://localhost:3000/admin/payment-config \
  -d '{"provider_traffic_percentage": {"mtn_momo": 100}}'
```

### 3. Process Queued Payments
```bash
# Retry failed payments from outage period
node scripts/retry-failed-payments.js \
  --start-time="2024-01-01T10:00:00Z" \
  --end-time="2024-01-01T12:00:00Z" \
  --provider="mtn_momo"

# Monitor retry success rate
watch -n 30 'curl -s http://localhost:3000/internal/metrics | grep payment_retry'
```

## Post-Incident Actions

### 1. Data Analysis
```bash
# Generate outage impact report
node scripts/generate-outage-report.js \
  --start-time="2024-01-01T10:00:00Z" \
  --end-time="2024-01-01T12:00:00Z" \
  --output="/reports/payment-outage-$(date +%Y%m%d).json"

# Calculate revenue impact
node scripts/calculate-revenue-impact.js \
  --outage-period="2024-01-01T10:00:00Z/2024-01-01T12:00:00Z"
```

### 2. Update Monitoring
```bash
# Add new alerts based on lessons learned
# Update alert thresholds
# Improve detection time
```

### 3. Provider Communication
- Schedule post-mortem with payment provider
- Request SLA credits if applicable
- Discuss prevention measures

## Emergency Contacts

### Payment Providers
- **MTN MoMo Support**: +250-XXX-XXXX
- **Airtel Money Support**: +250-XXX-XXXX  
- **RSwitch Support**: +250-XXX-XXXX

### Internal Team
- **Payments Team Lead**: +250-XXX-XXXX
- **On-call Engineer**: +250-XXX-XXXX
- **CTO**: +250-XXX-XXXX

## Automation Scripts

### Payment Health Monitor
```bash
#!/bin/bash
# /scripts/payment_health_monitor.sh

PROVIDERS=("mtn_momo" "airtel_money" "rswitch")
ALERT_THRESHOLD=5  # 5% failure rate

for provider in "${PROVIDERS[@]}"; do
    failure_rate=$(curl -s "http://localhost:9090/api/v1/query?query=rate(smartsports_payment_failures_total{provider=\"$provider\"}[5m])" | jq -r '.data.result[0].value[1]')
    
    if (( $(echo "$failure_rate > $ALERT_THRESHOLD" | bc -l) )); then
        echo "ALERT: $provider failure rate is $failure_rate%"
        # Trigger alert
        curl -X POST $SLACK_WEBHOOK_URL -d "{\"text\":\"Payment provider $provider failure rate: $failure_rate%\"}"
    fi
done
```

### Automatic Failover
```bash
#!/bin/bash
# /scripts/auto_payment_failover.sh

# Monitor primary provider health
if ! curl -f http://localhost:3000/health/mtn_momo; then
    echo "MTN MoMo is down, enabling failover"
    
    # Switch to Airtel Money as primary
    curl -X POST http://localhost:3000/admin/payment-config \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d '{"primary_provider": "airtel_money", "mtn_momo_enabled": false}'
    
    # Send notification
    curl -X POST $SLACK_WEBHOOK_URL \
      -d '{"text":"🔄 Automatic failover: MTN MoMo → Airtel Money"}'
fi
```
