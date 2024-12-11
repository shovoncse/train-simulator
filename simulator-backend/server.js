const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());

// Load configuration
const configPath = path.join(__dirname, 'config.json');
let config = {};
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error('Error loading config:', error);
}

// Handle POST request for simulation
app.post('/simulate', (req, res) => {
  const { clock, scenario } = req.body;

  // Validate input
  if (!scenario || !config[scenario]) {
    return res.status(400).json({ error: 'Invalid scenario selected' });
  }

  // Retrieve scenario lighting levels
  const scenarioConfig = config[scenario];

  // Response with lighting simulation data
  res.json({
    clock,
    scenario,
    lightingLevels: scenarioConfig
  });
});

// Start server
app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
