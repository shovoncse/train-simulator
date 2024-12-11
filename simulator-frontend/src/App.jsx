import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [clock, setClock] = useState('12:00');
  const [scenario, setScenario] = useState('');
  const [lightingLevels, setLightingLevels] = useState(null);

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
      <h1>Train Lighting Simulator</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
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

        <div className="mb-3">
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

      {lightingLevels && (
        <div className="simulation">
          <h3>Simulation Result</h3>
          <div className="train-body">
            {/* Row 1 */}
            <div className="train-row">
              <div className="train-cell ceil" style={{ backgroundColor: `rgba(255, 255, 0, ${lightingLevels.pwm1 / 255})` }}>
                Ceiling Left
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `rgba(255, 165, 0, ${lightingLevels.pwm2 / 255})` }}>
                Seat
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `rgba(255, 165, 0, ${lightingLevels.pwm3 / 255})` }}>
                Seat
              </div>
              <div className="train-cell seat target" style={{ backgroundColor: `rgba(255, 165, 0, ${lightingLevels.pwm4 / 255})` }}>
                Seat (Target)
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `rgba(255, 165, 0, ${lightingLevels.pwm2 / 255})` }}>
                Seat
              </div>
            </div>

            {/* Row 2 */}
            <div className="train-row">
              <div className="train-cell ceil" style={{ backgroundColor: `rgba(255, 255, 0, ${lightingLevels.pwm1 / 255})` }}>
                Ceiling Right
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `rgba(255, 165, 0, ${lightingLevels.pwm3 / 255})` }}>
                Seat
              </div>
              <div className="train-cell seat target" style={{ backgroundColor: `rgba(255, 165, 0, ${lightingLevels.pwm4 / 255})` }}>
                Seat (Target)
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `rgba(255, 165, 0, ${lightingLevels.pwm2 / 255})` }}>
                Seat
              </div>
              <div className="train-cell seat" style={{ backgroundColor: `rgba(255, 165, 0, ${lightingLevels.pwm3 / 255})` }}>
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