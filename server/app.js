const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173' // Your frontend URL
}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ... other imports and middleware

// ... rest of your app configuration 