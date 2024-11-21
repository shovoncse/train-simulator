const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import protocol handlers
const CIP = require('./protocols/CIP');
const TRDP = require('./protocols/TRDP');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Simulator API is running');
});

// Simulate endpoint
app.post('/simulate', (req, res) => {
  const { protocol, formData } = req.body;

  if (!protocol || !formData) {
    return res.status(400).json({ error: 'Protocol and formData are required' });
  }

  let response;

  // Handle protocols dynamically
  switch (protocol) {
    case 'CIP':
      response = CIP.handle(formData);
      break;
    case 'TRDP':
      response = TRDP.handle(formData);
      break;
    default:
      return res.status(400).json({ error: 'Unknown protocol' });
  }

  res.json(response);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
