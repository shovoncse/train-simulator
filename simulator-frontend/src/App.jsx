import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [clock, setClock] = useState('12:00');
  const [scenario, setScenario] = useState('');
  const [lightingLevels, setLightingLevels] = useState(null);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [ramp, setRamp] = useState(0);
  const [pwm, setPwm] = useState(0);
  const [editableCommon, setEditableCommon] = useState(false);
  const [editableTimetable, setEditableTimetable] = useState(false);
  const [activeTab, setActiveTab] = useState('commonForm'); // Tab toggle state

  const apiUrl = 'http://localhost:5000';

  useEffect(() => {
    if (scenario) {
      axios
        .get(`${apiUrl}/config`)
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
      const response = await axios.post(`${apiUrl}/simulate`, { clock, scenario });
      setLightingLevels(response.data.lightingLevels);
    } catch (error) {
      console.error('Error fetching simulation data:', error);
    }
  };

  return (
    <div className="container">
      <h1>Teknoware Project</h1>
      <div className="wrapper">
        {/* Left Section */}
        <form onSubmit={handleSubmit} className="form-section">
          <div className="form-header">
            <h3>Train PC</h3>
          </div>
          <div className="form-group">
            <label htmlFor="clock">Clock Input</label>
            <select
              id="scenario"
              className="form-select"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            >
              <option value="">Select Scenario</option>
              <option value="first_class">First Class</option>
              <option value="second_class">Second Class</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Apply
          </button>
        </form>

        {/* Right Section */}
        <div className="common-timetable-wrapper">
          <div className="tab-header">
            <button
              className={`tab-btn ${activeTab === 'commonForm' ? 'active' : ''}`}
              onClick={() => setActiveTab('commonForm')}
            >
              Common Form
            </button>
            <button
              className={`tab-btn ${activeTab === 'timetable' ? 'active' : ''}`}
              onClick={() => setActiveTab('timetable')}
            >
              Timetable
            </button>
          </div>

          {activeTab === 'commonForm' && (
            <div className="common-form">
              <h3>Common Form</h3>
              <div className="form-group">
                <label htmlFor="ramp">Ramp:</label>
                <input
                  id="ramp"
                  type="range"
                  min="0"
                  max="100"
                  value={ramp}
                  onChange={(e) => setRamp(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pwm">Pwm:</label>
                <input
                  id="pwm"
                  type="range"
                  min="0"
                  max="100"
                  value={pwm}
                  onChange={(e) => setPwm(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Editable Common:</label>
                <input
                  type="radio"
                  name="editableCommon"
                  checked={editableCommon}
                  onChange={() => setEditableCommon(true)}
                />{' '}
                Yes
                <input
                  type="radio"
                  name="editableCommon"
                  checked={!editableCommon}
                  onChange={() => setEditableCommon(false)}
                />{' '}
                No
              </div>
              <div className="form-group">
                <label>Editable Timetable:</label>
                <input
                  type="radio"
                  name="editableTimetable"
                  checked={editableTimetable}
                  onChange={() => setEditableTimetable(true)}
                />{' '}
                Yes
                <input
                  type="radio"
                  name="editableTimetable"
                  checked={!editableTimetable}
                  onChange={() => setEditableTimetable(false)}
                />{' '}
                No
              </div>
              <button className="btn btn-secondary">Apply</button>
            </div>
          )}

          {activeTab === 'timetable' && (
            <div className="timetable-form">
              <h3>Timetable</h3>
              <div className="form-group">
                <label htmlFor="time">Select Time:</label>
                <select id="time" className="form-select">
                  <option value="">-- Select --</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                </select>
              </div>
              {[...Array(4)].map((_, index) => (
                <div className="form-group" key={index}>
                  <label>{`Pwm${index + 1}:`}</label>
                  <input type="range" min="0" max="100" />
                </div>
              ))}
              <button className="btn btn-secondary">Apply</button>
            </div>
          )}
        </div>
      </div>

      {/* Train Simulation */}
      <div className="simulation">
        <h3>{scenario ? scenario.replace('_', ' ') : 'Train Simulation'}</h3>
        <div className="train-body">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="train-cell"
              style={{ backgroundColor: '#ccc', margin: '5px', width: '30px', height: '30px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;