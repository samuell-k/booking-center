const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SmartSports Rwanda Backend is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic API info
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'SmartSports Rwanda API v1',
    endpoints: {
      health: '/health',
      docs: '/api/docs',
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      events: '/api/v1/events',
      tickets: '/api/v1/tickets'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartSports Rwanda Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API info: http://localhost:${PORT}/api/v1`);
});

module.exports = app;
