// Import necessary modules
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

// Helper function to validate the new configuration structure
function validateNewConfig(config) {
  const isValidPWMValue = (value) =>
    typeof value === 'number' && value >= 0 && value <= 255;

  const validateTimetable = (timetable) => {
    if (typeof timetable !== 'object' || !timetable) return false;
    return Object.values(timetable).every((scenario) =>
      Object.values(scenario).every((timeConfig) => {
        const keys = ['pwm1', 'pwm2', 'pwm3', 'pwm4'];
        return (
          typeof timeConfig === 'object' &&
          keys.every((key) => key in timeConfig && isValidPWMValue(timeConfig[key]))
        );
      })
    );
  };

  if (typeof config !== 'object' || !config) return false;
  const { common, timetable } = config;
  const validCommon =
    typeof common === 'object' &&
    common.ramp >= 0 &&
    common.pwm_update_freq_Hz > 0 &&
    typeof common.editable === 'boolean';
  const validTimetable = validateTimetable(timetable);

  return validCommon && validTimetable;
}

// Get the current configuration
app.get('/config', (req, res) => {
  res.json(config);
});

// Update the configuration
app.post('/config', (req, res) => {
  const { updatedConfig } = req.body;

  // Validate the updated configuration
  if (!updatedConfig || typeof updatedConfig !== 'object') {
    return res.status(400).json({ error: 'Configuration must be an object' });
  }

  if (!validateNewConfig(updatedConfig)) {
    return res.status(400).json({
      error:
        'Invalid configuration format. Ensure all PWM values are numbers between 0 and 255, and common and timetable structures are correctly defined.',
    });
  }

  try {
    // Update and save the configuration
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
