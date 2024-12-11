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

// Helper function to validate the configuration
function validateConfig(config) {
  const isValidPWMValue = (value) =>
    typeof value === 'number' && value >= 0 && value <= 255;

  const validateScenario = (scenario) => {
    if (typeof scenario !== 'object' || !scenario) return false;
    const keys = ['pwm1', 'pwm2', 'pwm3', 'pwm4'];
    return keys.every((key) => key in scenario && isValidPWMValue(scenario[key]));
  };

  if (typeof config !== 'object' || !config) return false;
  return Object.values(config).every(validateScenario);
}

// Add a route to get the current configuration
app.get('/config', (req, res) => {
  res.json(config);
});

// Add a route to update the configuration
app.post('/config', (req, res) => {
  const { updatedConfig } = req.body;

  // Validate updatedConfig structure
  if (!updatedConfig || typeof updatedConfig !== 'object') {
    return res.status(400).json({ error: 'Configuration must be an object' });
  }

  // Validate the content of updatedConfig
  if (!validateConfig(updatedConfig)) {
    return res.status(400).json({
      error:
        'Invalid configuration format. Ensure all PWM values are numbers between 0 and 255, and scenarios have pwm1, pwm2, pwm3, and pwm4 keys.',
    });
  }

  try {
    // Update the configuration and save to file
    config = updatedConfig;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    res.json({ success: true, config });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});


// Start server
app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
