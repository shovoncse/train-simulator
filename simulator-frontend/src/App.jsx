import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [timetable, setTimetable] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [pwmValues, setPwmValues] = useState({});
  const [message, setMessage] = useState("");

  // New form state
  const [newTime, setNewTime] = useState("");
  const [newScenario, setNewScenario] = useState("");
  const [rampValue, setRampValue] = useState("");
  const [frequencyHz, setFrequencyHz] = useState("");
  const [newPwmValues, setNewPwmValues] = useState({
    pwm1: "",
    pwm2: "",
    pwm3: "",
    pwm4: "",
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Popup content
  const [popupContent, setPopupContent] = useState("");

  // Fetch timetable from the backend on component load
  useEffect(() => {
    axios
      .get("http://localhost:5000/config")
      .then((response) => {
        setTimetable(response.data.timetable);
      })
      .catch((error) => {
        console.error("Error fetching timetable:", error);
      });
  }, []);

  // Handle Apply Button Click
  const handleApply = () => {
    if (!selectedClass || !selectedTime) {
      setMessage("Please select a class and time.");
      return;
    }

    if (
      timetable &&
      timetable[selectedClass] &&
      timetable[selectedClass][selectedTime]
    ) {
      const pwm = timetable[selectedClass][selectedTime];
      setPwmValues(pwm);
      setMessage("PWM values successfully updated!");
    } else {
      setMessage("Invalid class or time selected.");
    }
  };

  // Handle Update Button Click
  const handleUpdate = () => {
    if (!newTime || !newScenario || !rampValue === "" || !frequencyHz === "") {
      setUpdateMessage("Please fill in all fields.");
      return;
    }
    
  if (
    rampValue < 0 ||
    rampValue > 290 ||
    frequencyHz < 0 ||
    frequencyHz > 290
  ) {
    setUpdateMessage("Ramp and Frequency values must be between 0 and 290.");
    return;
  }
    if (
      Object.values(newPwmValues).some(
        (val) => isNaN(val) || val < 1 || val > 255
      )
    ) {
      setUpdateMessage("PWM values must be between 1 and 255.");
      return;
    }

    const updatedConfig = {
      common: {
        ramp: parseFloat(rampValue),
        pwm_update_freq_Hz: parseFloat(frequencyHz),
        editable: true,
      },
      timetable: {
        ...timetable,
        [newScenario]: {
          ...(timetable ? timetable[newScenario] : {}),
          [newTime]: {
            pwm1: parseInt(newPwmValues.pwm1, 10),
            pwm2: parseInt(newPwmValues.pwm2, 10),
            pwm3: parseInt(newPwmValues.pwm3, 10),
            pwm4: parseInt(newPwmValues.pwm4, 10),
          },
        },
      },
    };

    axios
      .post("http://localhost:5000/config", { updatedConfig })
      .then((response) => {
        setUpdateMessage("Configuration updated successfully!");
        setTimetable(response.data.config.timetable); // Update local timetable
        setPwmValues({
          pwm1: parseInt(newPwmValues.pwm1, 10),
          pwm2: parseInt(newPwmValues.pwm2, 10),
          pwm3: parseInt(newPwmValues.pwm3, 10),
          pwm4: parseInt(newPwmValues.pwm4, 10),
        });

        // Set popup content and show it
        setPopupContent(
          `Configuration Updated:\nTime: ${newTime}\nScenario: ${newScenario}\nRamp: ${rampValue}\nFrequency (Hz): ${frequencyHz}\nPWM1: ${newPwmValues.pwm1}\nPWM2: ${newPwmValues.pwm2}\nPWM3: ${newPwmValues.pwm3}\nPWM4: ${newPwmValues.pwm4}`
        );
        setShowPopup(true);
      })
      .catch((error) => {
        console.error("Error updating configuration:", error);
        setUpdateMessage("Failed to update configuration.");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="form-group">
        <h1>Train PC</h1>

        {/* Select Class */}
        <div>
          <label>Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">--Choose Class--</option>
            {timetable &&
              Object.keys(timetable).map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
          </select>
        </div>

        {/* Select Time */}
        <div>
          <label>Select Time:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">--Choose Time--</option>
            {selectedClass &&
              timetable[selectedClass] &&
              Object.keys(timetable[selectedClass]).map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
          </select>
        </div>

        {/* Apply Button */}
        <div>
          <button onClick={handleApply} style={{ marginTop: "10px" }}>
            Apply
          </button>
        </div>

        {/* Display Message */}
        {message && <p style={{ color: "green" }}>{message}</p>}

        {/* Display PWM Values */}
        {pwmValues && Object.keys(pwmValues).length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2>PWM Values</h2>
            <p>PWM1: {pwmValues.pwm1}</p>
            <p>PWM2: {pwmValues.pwm2}</p>
            <p>PWM3: {pwmValues.pwm3}</p>
            <p>PWM4: {pwmValues.pwm4}</p>
          </div>
        )}
      </div>

      {/* New Update Form */}
      <div className="form-group" style={{ marginTop: "40px" }}>
        <h1>Update Configuration</h1>

        {/* Time Dropdown */}
        <div>
          <label>Time:</label>
          <select value={newTime} onChange={(e) => setNewTime(e.target.value)}>
            <option value="">--Choose Time--</option>
            <option value="12:00">12:00</option>
            <option value="18:00">18:00</option>
            <option value="22:00">06:00</option>
            <option value="02:00">00:00</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Scenario Dropdown */}
        <div>
          <label>Scenario:</label>
          <select
            value={newScenario}
            onChange={(e) => setNewScenario(e.target.value)}
          >
            <option value="">--Choose Scenario--</option>
            <option value="first_class">first class</option>
            <option value="second_class">Second Class</option>
            <option value="third_class">resturant</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Ramp Value */}
        <div>
          <label>Ramp:</label>
          <input
            type="number"
            min="0"
            max="290"
            value={rampValue}
            onChange={(e) => setRampValue(e.target.value)}
            placeholder="Enter Ramp Value"
          />
        </div>

        {/* Frequency */}
        <div>
          <label>Frequency (Hz):</label>
          <input
            type="number"
            min="0"
            max="290"
            value={frequencyHz}
            onChange={(e) => setFrequencyHz(e.target.value)}
            placeholder="Enter Frequency (Hz)"
          />
        </div>

        {/* PWM Values */}
        <div>
          <label>PWM1:</label>
          <input
            type="number"
            min="1"
            max="255"
            value={newPwmValues.pwm1}
            onChange={(e) =>
              setNewPwmValues({ ...newPwmValues, pwm1: e.target.value })
            }
          />
          <label>PWM2:</label>
          <input
            type="number"
            min="1"
            max="255"
            value={newPwmValues.pwm2}
            onChange={(e) =>
              setNewPwmValues({ ...newPwmValues, pwm2: e.target.value })
            }
          />
          <label>PWM3:</label>
          <input
            type="number"
            min="1"
            max="255"
            value={newPwmValues.pwm3}
            onChange={(e) =>
              setNewPwmValues({ ...newPwmValues, pwm3: e.target.value })
            }
          />
          <label>PWM4:</label>
          <input
            type="number"
            min="1"
            max="255"
            value={newPwmValues.pwm4}
            onChange={(e) =>
              setNewPwmValues({ ...newPwmValues, pwm4: e.target.value })
            }
          />
        </div>

        {/* Update Button */}
        <div>
          <button onClick={handleUpdate} style={{ marginTop: "10px" }}>
            Update
          </button>
        </div>

        {/* Update Message */}
        {updateMessage && <p style={{ color: "green" }}>{updateMessage}</p>}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Update Successful</h2>
            <pre>{popupContent}</pre>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
