import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');
const ticketPurchases = new Counter('ticket_purchases');
const paymentFailures = new Counter('payment_failures');

// Test configuration for different scenarios
export const options = {
  scenarios: {
    // Scenario 1: Normal load - 1000 concurrent users
    normal_load: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '10m',
      tags: { scenario: 'normal' },
    },
    
    // Scenario 2: Peak load - 5000 concurrent users
    peak_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 1000 },
        { duration: '5m', target: 5000 },
        { duration: '10m', target: 5000 },
        { duration: '2m', target: 0 },
      ],
      tags: { scenario: 'peak' },
    },
    
    // Scenario 3: Stress test - 10M+ users simulation
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 2000 },
        { duration: '10m', target: 5000 },
        { duration: '15m', target: 10000 },
        { duration: '20m', target: 15000 },
        { duration: '10m', target: 0 },
      ],
      tags: { scenario: 'stress' },
    },
    
    // Scenario 4: Spike test - sudden traffic spikes
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 100,
      stages: [
        { duration: '1m', target: 100 },
        { duration: '30s', target: 5000 }, // Sudden spike
        { duration: '2m', target: 5000 },
        { duration: '30s', target: 100 }, // Drop back
        { duration: '1m', target: 100 },
      ],
      tags: { scenario: 'spike' },
    }
  },
  
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.05'], // Error rate under 5%
    errors: ['rate<0.05'],
    ticket_purchases: ['count>1000'], // At least 1000 successful purchases
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_VERSION = __ENV.API_VERSION || 'v1';

// Test data
const events = [
  'event-1-uuid',
  'event-2-uuid', 
  'event-3-uuid'
];

const ticketTypes = ['regular', 'vip', 'student'];
const paymentMethods = ['mtn_momo', 'airtel_money', 'wallet'];

// User authentication tokens (pre-generated for load testing)
const authTokens = [
  'token1', 'token2', 'token3', // Add more tokens for realistic testing
];

export function setup() {
  // Setup phase - create test data if needed
  console.log('Setting up load test...');
  
  // Health check before starting
  const healthCheck = http.get(`${BASE_URL}/health`);
  check(healthCheck, {
    'health check passed': (r) => r.status === 200,
  });
  
  return {
    baseUrl: BASE_URL,
    apiVersion: API_VERSION
  };
}

export default function(data) {
  const scenario = __ENV.K6_SCENARIO || 'normal_load';
  
  // Simulate different user behaviors based on scenario
  switch(scenario) {
    case 'ticket_purchase_flow':
      ticketPurchaseFlow(data);
      break;
    case 'browse_events':
      browseEventsFlow(data);
      break;
    case 'payment_stress':
      paymentStressFlow(data);
      break;
    default:
      mixedUserFlow(data);
  }
  
  // Random sleep between 1-5 seconds to simulate real user behavior
  sleep(Math.random() * 4 + 1);
}

function mixedUserFlow(data) {
  const userBehavior = Math.random();
  
  if (userBehavior < 0.4) {
    browseEventsFlow(data);
  } else if (userBehavior < 0.8) {
    ticketPurchaseFlow(data);
  } else {
    paymentStressFlow(data);
  }
}

function browseEventsFlow(data) {
  const group = 'Browse Events Flow';
  
  // 1. Get events list
  let response = http.get(`${data.baseUrl}/api/${data.apiVersion}/events`);
  check(response, {
    [`${group} - events list loaded`]: (r) => r.status === 200,
  }) || errorRate.add(1);
  
  responseTime.add(response.timings.duration);
  
  // 2. Get event details
  const eventId = events[Math.floor(Math.random() * events.length)];
  response = http.get(`${data.baseUrl}/api/${data.apiVersion}/events/${eventId}`);
  check(response, {
    [`${group} - event details loaded`]: (r) => r.status === 200,
  }) || errorRate.add(1);
  
  // 3. Check ticket availability
  response = http.get(`${data.baseUrl}/api/${data.apiVersion}/reservations/availability/${eventId}`);
  check(response, {
    [`${group} - availability checked`]: (r) => r.status === 200,
  }) || errorRate.add(1);
  
  sleep(1);
}

function ticketPurchaseFlow(data) {
  const group = 'Ticket Purchase Flow';
  const eventId = events[Math.floor(Math.random() * events.length)];
  const ticketType = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
  const quantity = Math.floor(Math.random() * 4) + 1; // 1-4 tickets
  const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
  
  // 1. Reserve seats
  let response = http.post(
    `${data.baseUrl}/api/${data.apiVersion}/reservations/reserve`,
    JSON.stringify({
      event_id: eventId,
      ticket_type: ticketType,
      quantity: quantity,
      session_id: `session_${__VU}_${__ITER}`
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `load_test_${__VU}_${__ITER}`
      }
    }
  );
  
  const reservationSuccess = check(response, {
    [`${group} - seats reserved`]: (r) => r.status === 201,
  });
  
  if (!reservationSuccess) {
    errorRate.add(1);
    return;
  }
  
  const reservation = JSON.parse(response.body);
  const reservationToken = reservation.data.reservationToken;
  
  sleep(2); // User thinks about purchase
  
  // 2. Initiate payment
  response = http.post(
    `${data.baseUrl}/api/${data.apiVersion}/payments/initiate`,
    JSON.stringify({
      event_id: eventId,
      ticket_type: ticketType,
      quantity: quantity,
      payment_method: paymentMethod,
      customer_name: `Test User ${__VU}`,
      customer_phone: `+25078${String(__VU).padStart(7, '0')}`,
      customer_email: `testuser${__VU}@example.com`,
      reservation_token: reservationToken
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': `payment_${__VU}_${__ITER}_${Date.now()}`,
        'X-Correlation-ID': `load_test_${__VU}_${__ITER}`
      }
    }
  );
  
  const paymentSuccess = check(response, {
    [`${group} - payment initiated`]: (r) => r.status === 201,
  });
  
  if (paymentSuccess) {
    ticketPurchases.add(1);
    
    const payment = JSON.parse(response.body);
    const paymentId = payment.data.payment_id;
    
    // 3. Check payment status (simulate webhook delay)
    sleep(3);
    
    response = http.get(`${data.baseUrl}/api/${data.apiVersion}/payments/${paymentId}/status`);
    check(response, {
      [`${group} - payment status checked`]: (r) => r.status === 200,
    }) || errorRate.add(1);
    
  } else {
    errorRate.add(1);
    paymentFailures.add(1);
    
    // Cancel reservation if payment failed
    http.post(
      `${data.baseUrl}/api/${data.apiVersion}/reservations/${reservationToken}/cancel`,
      JSON.stringify({ reason: 'payment_failed' }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

function paymentStressFlow(data) {
  const group = 'Payment Stress Flow';
  const eventId = events[0]; // Use same event to create contention
  const ticketType = 'regular';
  const quantity = 1;
  
  // Rapid fire payment attempts to test race conditions
  for (let i = 0; i < 3; i++) {
    let response = http.post(
      `${data.baseUrl}/api/${data.apiVersion}/payments/initiate`,
      JSON.stringify({
        event_id: eventId,
        ticket_type: ticketType,
        quantity: quantity,
        payment_method: 'mtn_momo',
        customer_name: `Stress User ${__VU}`,
        customer_phone: `+25078${String(__VU).padStart(7, '0')}`,
        customer_email: `stressuser${__VU}@example.com`
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `stress_${__VU}_${__ITER}_${i}_${Date.now()}`,
          'X-Correlation-ID': `stress_test_${__VU}_${__ITER}_${i}`
        }
      }
    );
    
    check(response, {
      [`${group} - payment attempt ${i + 1}`]: (r) => r.status === 201 || r.status === 400,
    }) || errorRate.add(1);
    
    sleep(0.5); // Short delay between attempts
  }
}

export function teardown(data) {
  console.log('Load test completed');
  
  // Final health check
  const healthCheck = http.get(`${data.baseUrl}/health`);
  check(healthCheck, {
    'final health check passed': (r) => r.status === 200,
  });
  
  // Get final metrics
  const metrics = http.get(`${data.baseUrl}/internal/metrics`);
  if (metrics.status === 200) {
    console.log('Final system metrics retrieved');
  }
}
