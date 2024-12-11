import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [clock, setClock] = useState('12:00');
  const [scenario, setScenario] = useState('');
  const [lightingLevels, setLightingLevels] = useState(null);
  const [currentConfig, setCurrentConfig] = useState(null);

  // Fetch config when a scenario is selected
  useEffect(() => {
    if (scenario) {
      axios.get('http://localhost:5000/config')
        .then((response) => {
          setCurrentConfig(response.data[scenario] || null);
        })
        .catch((error) => {
          console.error('Error fetching config:', error);
          setCurrentConfig(null);
        });
    }
  }, [scenario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/simulate', { clock, scenario });
      setLightingLevels(response.data.lightingLevels);
    } catch (error) {
      console.error('Error fetching simulation data:', error);
    }
  };

  return (
    <div className="container">
      <h1>Teknoware Project</h1>
      <div className="wrapper">
        <form onSubmit={handleSubmit} className="form-section">
          <div className="form-header">
            <h3>CIP</h3>
          </div>
          <div className="form-group">
            <label htmlFor="clock">Clock</label>
            <input
              id="clock"
              type="text"
              className="form-control"
              value={clock}
              onChange={(e) => setClock(e.target.value)}
              placeholder="Enter clock time (e.g., 12:00)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="scenario">Select Scenario</label>
            <select
              id="scenario"
              className="form-select"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            >
              <option value="">-- Select Scenario --</option>
              <option value="first_class">First Class</option>
              <option value="second_class">Second Class</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Simulate</button>
        </form>

        <div className="config-section">
          <div className="config-header">
            <h3>Current Config.json</h3>
          </div>
          <div className="config-display">
            {currentConfig ? (
              <pre>{JSON.stringify(currentConfig, null, 2)}</pre>
            ) : (
              <p>No configuration available for the selected scenario.</p>
            )}
          </div>
          <div className="config-footer">
            <button
              className="btn btn-secondary"
              onClick={() => alert('Navigate to Edit Config Page')}
            >
              Edit Config
            </button>
          </div>
        </div>
      </div>

      {lightingLevels && (
        <div className="simulation">
          <h3>Train Simulation</h3>
          <div className="train-body">
            {/* Row 1 */}
            <div className="train-row">
              <div className="train-cell ceil" style={{ backgroundColor: `rgba(255, 255, 0, ${lightingLevels.pwm1 / 255})` }}>
                PWM1
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `#ededed` }}>
                Seat
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `#ededed` }}>
                Seat
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `rgba(255, 165, 0, ${lightingLevels.pwm3 / 255})` }}>
                PWM3
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `#ededed` }}>
                Seat
              </div>
            </div>

            {/* Row 2 */}
            <div className="train-row">
              <div className="train-cell ceil" style={{ backgroundColor: `rgba(255, 255, 0, ${lightingLevels.pwm2 / 255})` }}>
                PWM2
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `#ededed` }}>
                Seat
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `rgba(255, 165, 0, ${lightingLevels.pwm3 / 255})` }}>
                PWM4
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `#ededed` }}>
                Seat
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `#ededed` }}>
                Seat
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;