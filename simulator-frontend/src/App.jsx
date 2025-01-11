import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [timetable, setTimetable] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [pwmValues, setPwmValues] = useState({});
  const [message, setMessage] = useState("");

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
  const [editable, setEditable] = useState(true);
  const [updateMessage, setUpdateMessage] = useState("");

  const [colorSimulation, setColorSimulation] = useState({
    red: 0,
    green: 0,
    blue: 0,
  });

 useEffect(() => {
   axios
     .get("http://localhost:5000/config")
     .then((response) => {
       const data = response.data;

       if (data && data.common) {
         setRampValue(data.common.ramp || ""); // Set ramp value
         setFrequencyHz(data.common.pwm_update_freq_Hz || ""); // Set frequency value
       }

       setTimetable(data.timetable); // Set timetable
     })
     .catch((error) => {
       console.error("Error fetching configuration:", error);
     });
 }, []);


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
      setNewPwmValues({
        pwm1: pwm.pwm1 || "",
        pwm2: pwm.pwm2 || "",
        pwm3: pwm.pwm3 || "",
        pwm4: pwm.pwm4 || "",
      });
      setMessage("");
    } else {
      setMessage("Invalid class or time selected.");
    }
  };
const handleUpdate = () => {
  // Validate ramp and frequency values
  const rampNum = parseFloat(rampValue);
  const frequencyNum = parseFloat(frequencyHz);

  if (isNaN(rampNum) || rampNum < 1 || rampNum > 100) {
    alert("Please fill the Ramp value between 1 and 100.");
    return;
  }

  if (isNaN(frequencyNum) || frequencyNum < 1 || frequencyNum > 100) {
    alert("Please fill the Frequency value between 1 and 100.");
    return;
  }

  // Validate new PWM values, ensuring they're a number between 1 and 100 for non-empty fields
  const pwmValuesPercent = {
    pwm1: parseFloat(newPwmValues.pwm1) || null,
    pwm2: parseFloat(newPwmValues.pwm2) || null,
    pwm3: parseFloat(newPwmValues.pwm3) || null,
    pwm4: parseFloat(newPwmValues.pwm4) || null,
  };

  // Validate PWM values to ensure they're between 1 and 100
  for (const key in pwmValuesPercent) {
    const value = pwmValuesPercent[key];
    if (value !== null && (value < 1 || value > 100)) {
      alert(
        `Invalid PWM value for ${key}. Please enter a value between 1 and 100.`
      );
      return;
    }
  }

  const updatedConfig = {
    common: {
      ramp: rampNum, // Use the validated ramp value
      pwm_update_freq_Hz: frequencyNum, // Use the validated frequency value
      editable,
    },
    timetable: {
      ...timetable,
      [newScenario]: {
        ...(timetable ? timetable[newScenario] : {}),
        [newTime]: pwmValuesPercent, // PWM values object
      },
    },
  };

  axios
    .post("http://localhost:5000/config", { updatedConfig })
    .then((response) => {
      setUpdateMessage("Configuration updated successfully!");
      setTimetable(response.data.config.timetable);
      setPwmValues(pwmValuesPercent); // Update PWM values state
    })
    .catch((error) => {
      console.error("Error updating configuration:", error);
      setUpdateMessage("Failed to update configuration.");
    });
};

  const handleColorSimulation = () => {
    console.log("Simulated Color:", colorSimulation);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="form-group">
        <h1>Train PC</h1>

        <div>
          <label>Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">--Choose Class--</option>
            {timetable &&
              Object.keys(timetable)
                .filter((className) => className !== "editable")
                .map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
          </select>
        </div>

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

        <div>
          <button onClick={handleApply} style={{ marginTop: "10px" }}>
            Apply
          </button>
        </div>

        {message && <p style={{ color: "green" }}>{message}</p>}

        {pwmValues && Object.keys(pwmValues).length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2>PWM Values</h2>
            <p>PWM1: {pwmValues.pwm1}%</p>
            <p>PWM2: {pwmValues.pwm2}%</p>
            <p>PWM3: {pwmValues.pwm3}%</p>
            <p>PWM4: {pwmValues.pwm4}%</p>
          </div>
        )}
      </div>

      <div className="form-group" style={{ marginTop: "40px" }}>
        <h1>Update Configuration</h1>

        <div>
          <label>Time:</label>
          <select value={newTime} onChange={(e) => setNewTime(e.target.value)}>
            <option value="">--Choose Time--</option>
            <option value="12:00">12:00</option>
            <option value="18:00">18:00</option>
            <option value="22:00">22:00</option>
            <option value="02:00">02:00</option>
          </select>
        </div>

        <div>
          <label>Scenario:</label>
          <select
            value={newScenario}
            onChange={(e) => setNewScenario(e.target.value)}
          >
            <option value="">--Choose Scenario--</option>
            <option value="first_class">First Class</option>
            <option value="second_class">Second Class</option>
            <option value="third_class">Restaurant</option>
          </select>
        </div>

        <div>
          <label>Ramp:</label>
          <input
            type="number"
            min="0"
            max="100"
            value={rampValue}
            onChange={(e) => setRampValue(e.target.value)}
            placeholder="Enter Ramp Value"
          />
        </div>

        <div>
          <label>Frequency (Hz):</label>
          <input
            type="number"
            min="0"
            max="100"
            value={frequencyHz}
            onChange={(e) => setFrequencyHz(e.target.value)}
            placeholder="Enter Frequency (Hz)"
          />
        </div>

        <div>
          <label>PWM1:</label>
          <input
            type="number"
            min="0"
            max="100"
            value={newPwmValues.pwm1}
            onChange={(e) =>
              setNewPwmValues({ ...newPwmValues, pwm1: e.target.value })
            }
          />
          <label>PWM2:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={newPwmValues.pwm2}
            onChange={(e) =>
              setNewPwmValues({ ...newPwmValues, pwm2: e.target.value })
            }
          />
          <label>PWM3:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={newPwmValues.pwm3}
            onChange={(e) =>
              setNewPwmValues({ ...newPwmValues, pwm3: e.target.value })
            }
          />
          <label>PWM4:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={newPwmValues.pwm4}
            onChange={(e) =>
              setNewPwmValues({ ...newPwmValues, pwm4: e.target.value })
            }
          />
        </div>

        <div>
          <label>Editable:</label>
          <label>
            <input
              type="radio"
              name="editable"
              value={true}
              checked={editable === true}
              onChange={() => setEditable(true)}
            />
            True
          </label>
          <label>
            <input
              type="radio"
              name="editable"
              value={false}
              checked={editable === false}
              onChange={() => setEditable(false)}
            />
            False
          </label>
        </div>

        <div>
          <button onClick={handleUpdate} style={{ marginTop: "10px" }}>
            Update
          </button>
        </div>

        {updateMessage && <p style={{ color: "green" }}>{updateMessage}</p>}
      </div>

      <div className="form-group" style={{ marginTop: "40px" }}>
        <h1>Color Simulation</h1>

        <div>
          <label>Red:</label>
          <input
            type="number"
            min="0"
            max="255"
            value={colorSimulation.red}
            onChange={(e) =>
              setColorSimulation({ ...colorSimulation, red: e.target.value })
            }
          />
        </div>

        <div>
          <label>Green:</label>
          <input
            type="number"
            min="0"
            max="255"
            value={colorSimulation.green}
            onChange={(e) =>
              setColorSimulation({ ...colorSimulation, green: e.target.value })
            }
          />
        </div>

        <div>
          <label>Blue:</label>
          <input
            type="number"
            min="0"
            max="255"
            value={colorSimulation.blue}
            onChange={(e) =>
              setColorSimulation({ ...colorSimulation, blue: e.target.value })
            }
          />
        </div>

        <div>
          <button
            onClick={handleColorSimulation}
            style={{ marginTop: "10px", background: "lightgray" }}
          >
            Simulate Color
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
