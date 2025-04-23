const express = require('express');
const router = express.Router();
const packageInfo = require('../package.json');

router.get('/', (req, res) => {
  // Add explicit CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  res.json({
    status: 'ok',
    version: packageInfo.version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 