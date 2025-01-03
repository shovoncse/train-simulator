import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [clock, setClock] = useState('Set time');
  const [selectedClock, setSelectedClock] = useState('12:00');
  const [scenario, setScenario] = useState('Choose Scenario');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [pwm, setPwm] = useState(0);

  // Main state for applied values
  const [pwmValues, setPwmValues] = useState({
    common: 0, // Single PWM value for Common Form
    timetable: {
      scenario: '',
      time: '',
      pwm1: 0,
      pwm2: 0,
      pwm3: 0,
      pwm4: 0,
    },
  });

  // Temporary state for real-time slider updates
  const [tempPwmValues, setTempPwmValues] = useState({
    common: 0, // Temporary PWM value for Common Form
    timetable: {
      scenario: '',
      time: '',
      pwm1: 0,
      pwm2: 0,
      pwm3: 0,
      pwm4: 0,
    },
  });

  const [ramp, setRamp] = useState(0);
  const [tempRamp, setTempRamp] = useState(0);
  const [editableCommon, setEditableCommon] = useState(false);
  const [editableTimetable, setEditableTimetable] = useState(false);

  const [lastAppliedSource, setLastAppliedSource] = useState('train-pc'); 

  const apiUrl = 'http://localhost:5000';

  useEffect(() => {
    const fetchPwm = async () => {
      try {
        const response = await axios.get(`${apiUrl}/pwm`);
        setPwm(response.data.pwm);
      } catch (error) {
        console.error('Error fetching PWM data:', error);
      }
    };

    const interval = setInterval(fetchPwm, 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to convert HSV to RGB
  const hsvToRgb = (h, s, v) => {
    let f = (n, k = (n + h / 60) % 6) =>
      v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    const r = Math.round(f(5) * 255);
    const g = Math.round(f(3) * 255);
    const b = Math.round(f(1) * 255);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Get color based on PWM percentage
  const getColorBasedOnPwm = () => {
    const pwmPercentage = (pwm / 100) * 360; // Scale 0-100 to 0-360 degrees (hue)
    return hsvToRgb(pwmPercentage, 1, 1); // Full saturation and brightness
  };

 
  const handleApplyTrainPc = () => {
    setScenario(selectedScenario || 'Choose Scenario');
    setClock(selectedClock);
    setRamp(tempRamp);


    setPwmValues((prev) => ({
      ...prev,
      common: tempPwmValues.common,
    }));


    setLastAppliedSource('train-pc');

    
    const averagePwm = parseInt(tempPwmValues.common);
    setPwm(averagePwm);

    console.log('Applied Train Pc Settings:', {
      scenario: selectedScenario || 'Choose Scenario',
      clock: selectedClock,
      ramp: tempRamp,
      pwmValues: tempPwmValues,
      editableCommon,
      editableTimetable,
    });
  };

  // Handle Apply Button Click for Timetable
  const handleApplyTimetable = () => {
    // Apply the temporary values to the main state
    setPwmValues((prev) => ({
      ...prev,
      timetable: {
        scenario: tempPwmValues.timetable.scenario,
        time: tempPwmValues.timetable.time,
        pwm1: tempPwmValues.timetable.pwm1,
        pwm2: tempPwmValues.timetable.pwm2,
        pwm3: tempPwmValues.timetable.pwm3,
        pwm4: tempPwmValues.timetable.pwm4,
      },
    }));

    // Update the last applied source to Timetable
    setLastAppliedSource('timetable');

    // Calculate the average PWM for simulator color
    const averagePwm =
      (parseInt(tempPwmValues.timetable.pwm1) +
        parseInt(tempPwmValues.timetable.pwm2) +
        parseInt(tempPwmValues.timetable.pwm3) +
        parseInt(tempPwmValues.timetable.pwm4)) /
      4;
    setPwm(averagePwm);

    console.log('Applied Timetable Settings:', {
      pwmValues: tempPwmValues,
    });
  };

  // Handle Temporary PWM changes (real-time slider updates)
  const handleTempPwmChange = (name, value) => {
    setTempPwmValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTempTimetableChange = (name, value) => {
    setTempPwmValues((prev) => ({
      ...prev,
      timetable: { ...prev.timetable, [name]: value },
    }));
  };

  return (
    

    <div className="top-title-wrapper">

      <div className="logo-container"> 

          <svg xmlns="http://www.w3.org/2000/svg" width="142" height="20" viewBox="0 0 142 20" fill="none"><g clip-path="url(#clip0_1402_1945)"><path d="M31.7969 19.5106H29.9161V5.68801H26.3896V3.91431H35.3234V5.68801H31.7969V19.5106Z" fill="black"/><path d="M36.3232 3.91431H44.3166V5.68801H38.1453V10.581H43.3762V12.3547H38.1453V17.7369H44.3166V19.5106H36.3232V3.91431Z" fill="black"/><path d="M53.955 3.91431H56.3648L49.6645 10.9479L56.4824 19.5106H53.955L48.3714 12.2324L47.6074 12.9663V19.5106H45.7266V3.91431H47.6074V10.6421L53.955 3.91431Z" fill="black"/><path d="M85.3412 11.6819C85.3412 8.25684 82.8727 5.38223 79.3462 5.38223C75.8197 5.38223 73.3511 8.25684 73.3511 11.6819C73.3511 15.2293 76.1136 17.9816 79.3462 17.9816C82.6376 17.9816 85.3412 15.2293 85.3412 11.6819ZM87.222 11.6819C87.222 16.3302 83.6955 19.8165 79.4049 19.8165C75.0556 19.8165 71.5879 16.3302 71.5879 11.6819C71.5879 7.21709 75.1144 3.54736 79.4049 3.54736C83.6955 3.60853 87.222 7.21709 87.222 11.6819Z" fill="black"/><path d="M119.666 11.3149H120.254C122.135 11.3149 124.192 10.9479 124.192 8.4403C124.192 5.99382 121.958 5.62685 120.136 5.62685H119.666V11.3149ZM127.072 19.5106H124.838L120.43 12.9051H119.666V19.5106H117.785V3.91431H120.019C121.37 3.91431 122.781 3.91431 123.957 4.64825C125.191 5.3822 125.896 6.85009 125.896 8.37914C125.896 10.581 124.486 12.477 122.311 12.7216L127.072 19.5106Z" fill="black"/><path d="M127.776 3.91431H135.77V5.68801H129.598V10.581H134.829V12.3547H129.598V17.7369H135.77V19.5106H127.776V3.91431Z" fill="black"/><path d="M4.34905 11.682C2.17438 11.682 0.411133 9.84718 0.411133 7.58419C0.411133 5.32119 2.17438 3.48633 4.34905 3.48633C6.52372 3.48633 8.28696 5.32119 8.28696 7.58419C8.28696 9.90835 6.52372 11.682 4.34905 11.682Z" fill="#EF3340"/><path d="M12.1664 11.682C9.99176 11.682 8.22852 9.84718 8.22852 7.58419C8.22852 5.32119 9.99176 3.48633 12.1664 3.48633C14.3411 3.48633 16.1043 5.32119 16.1043 7.58419C16.0456 9.90835 14.2823 11.682 12.1664 11.682Z" fill="#EF3340"/><path d="M19.9242 11.682C17.7496 11.682 15.9863 9.84718 15.9863 7.58419C15.9863 5.32119 17.7496 3.48633 19.9242 3.48633C22.0989 3.48633 23.8622 5.32119 23.8622 7.58419C23.8622 9.90835 22.0989 11.682 19.9242 11.682Z" fill="#EF3340"/><path d="M8.22852 15.7187C8.22852 13.4557 9.99176 11.6208 12.1664 11.6208C14.3411 11.6208 16.1043 13.4557 16.1043 15.7187C16.1043 17.9817 14.3411 19.8166 12.1664 19.8166C9.99176 19.8166 8.22852 17.9817 8.22852 15.7187Z" fill="#EF3340"/><path d="M100.857 19.8166L106.911 3.91445H104.913L100.74 15.046L96.5078 3.60864L92.276 15.046L88.103 3.91445H86.0459L92.1585 19.8166H92.3936L96.5078 8.68509L100.622 19.8166H100.857Z" fill="black"/><path d="M107.323 13.8226L109.968 7.5229L112.613 13.8226H107.323ZM110.145 3.54736H109.909L102.856 19.5107H104.855L106.559 15.5963H113.436L115.14 19.5107H117.139L110.145 3.54736Z" fill="black"/><path d="M70.4711 19.8165V3.91434H68.5903V15.4128L57.7169 3.54736H57.3643V19.5107H59.2451V7.88987L70.1772 19.8165H70.4711Z" fill="black"/><path d="M139.649 2.38544C140.06 2.38544 140.472 2.38544 140.472 1.89614C140.472 1.52917 140.178 1.40685 139.825 1.40685H139.237V2.38544H139.649ZM139.178 3.91449H138.826V1.10103H139.884C140.472 1.10103 140.765 1.40685 140.765 1.89614C140.765 2.38544 140.472 2.63009 140.06 2.69125L140.883 3.91449H140.472L139.707 2.69125H139.12V3.91449H139.178ZM137.709 2.50776C137.709 3.66984 138.532 4.58727 139.707 4.58727C140.824 4.58727 141.706 3.66984 141.706 2.50776C141.706 1.34568 140.883 0.428252 139.707 0.428252C138.591 0.428252 137.709 1.34568 137.709 2.50776ZM142.058 2.50776C142.058 3.85333 141.059 4.95425 139.707 4.95425C138.356 4.95425 137.356 3.91449 137.356 2.50776C137.356 1.1622 138.356 0.0612793 139.707 0.0612793C141 0.0612793 142.058 1.1622 142.058 2.50776Z" fill="black"/></g><defs><clipPath id="clip0_1402_1945"><rect width="142" height="20" fill="white"/></clipPath></defs></svg>  

          <div className='title-container'>
            <h1 className='main-title'>Train Light Simulator</h1>
          </div>

      </div>

      <div className="form-holder">

            <div className="train-pc">
              <h4>Train Pc</h4>
              <div className="controls">
                <label htmlFor="clock">Select Clock:</label>
                <select
                  id="clock"
                  value={selectedClock}
                  onChange={(e) => setSelectedClock(e.target.value)}
                >
                  <option value="06:00">06:00</option>
                  <option value="12:00">12:00</option>
                  <option value="18:00">18:00</option>
                </select>

                <label htmlFor="scenario">Select Scenario:</label>
                <select
                  id="scenario"
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                >
                  <option value="Choose Scenario">--Choose Scenario--</option>
                  <option value="1st Class">1st Class</option>
                  <option value="2nd Class">2nd Class</option>
                  <option value="Restaurant">Restaurant</option>
                </select>
              </div>
              <button className='apply-btn' onClick={handleApplyTrainPc}>Apply</button>
            </div>

            <div className="right-form-container">
              <div className="common-form">
                <h4>Common Form</h4>

                {/* Ramp Slider */}
                <label htmlFor="ramp">Ramp:</label>
                <input
                  type="range"
                  id="ramp"
                  min="0"
                  max="100"
                  value={tempRamp}
                  onChange={(e) => setTempRamp(e.target.value)}
                />

                {/* PWM Slider */}
                <label htmlFor="commonPwm">Common PWM:</label>
                <input
                  type="range"
                  id="commonPwm"
                  min="0"
                  max="100"
                  value={tempPwmValues.common}
                  onChange={(e) => handleTempPwmChange('common', e.target.value)}
                />

                {/* Radio Buttons */}
                  <div>
                    <label>Edit Common:</label>
                    <label>
                      <input
                        type="radio"
                        name="editableCommon"
                        checked={editableCommon}
                        onChange={() => setEditableCommon(true)} 
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="editableCommon"
                        checked={!editableCommon} 
                        onChange={() => setEditableCommon(false)}
                      />
                      No
                    </label>
                  </div>

                  <div>
                    <label>Edit Timetable:</label>
                    <label>
                      <input
                        type="radio"
                        name="editableTimetable"
                        checked={editableTimetable}
                        onChange={() => setEditableTimetable(true)} 
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="editableTimetable"
                        checked={!editableTimetable} 
                        onChange={() => setEditableTimetable(false)} 
                      />
                      No
                    </label>
                  </div>

                <button className='apply-btn' onClick={handleApplyTrainPc}>Apply</button>
              </div>

          <div className="time-table-form">
            <h4>Timetable</h4>

            {/* Select Scenario Dropdown */}
            <label htmlFor="timetableScenario">Select Scenario:</label>
            <select
              id="timetableScenario"
              value={tempPwmValues.timetable.scenario}
              onChange={(e) => handleTempTimetableChange('scenario', e.target.value)}
            >
              <option value="Choose Scenario">--Choose Scenario--</option>
              <option value="1st Class">1st Class</option>
              <option value="2nd Class">2nd Class</option>
              <option value="Restaurant">Restaurant</option>
            </select>

            {/* Select Time Dropdown */}
            <label htmlFor="timetableTime">Select Time:</label>
            <select
              id="timetableTime"
              value={tempPwmValues.timetable.time}
              onChange={(e) => handleTempTimetableChange('time', e.target.value)}
            >
              <option value="06:00">06:00</option>
              <option value="12:00">12:00</option>
              <option value="18:00">18:00</option>
            </select>

            {/* PWM Sliders Timetable */}
            {['pwm1', 'pwm2', 'pwm3', 'pwm4'].map((pwm, index) => (
              <div key={index}>
                <label htmlFor={`timetable-${pwm}`}>Timetable {pwm.toUpperCase()}:</label>
                <input
                  type="range"
                  id={`timetable-${pwm}`}
                  min="0"
                  max="100"
                  value={tempPwmValues.timetable[pwm]}
                  onChange={(e) => handleTempTimetableChange(pwm, e.target.value)}
                />
              </div>
            ))}
            <button className='apply-btn' onClick={handleApplyTimetable}>Apply</button>
          </div>
        </div>

        <div className="simulator">
          <div
            className="led"
            style={{
              borderTopColor: getColorBasedOnPwm(),
              borderBottomColor: getColorBasedOnPwm(),
              boxShadow: `inset 0px 100px 100px -100px ${getColorBasedOnPwm()}, inset 0px -30px 30px -30px ${getColorBasedOnPwm()}`,
            }}
          >
            <h3 className="scenario">
              {lastAppliedSource === 'train-pc' ? scenario : pwmValues.timetable.scenario} -{' '}
              {lastAppliedSource === 'train-pc' ? clock : pwmValues.timetable.time}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;