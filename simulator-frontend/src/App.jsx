import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  // -----------------------------
  // TRAIN PC area
  // -----------------------------
  const [timetable, setTimetable] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [pwmValues, setPwmValues] = useState({});
  const [message, setMessage] = useState("");
  const [selectedClassForColorSinulation, setSelectedClassForColorSinulation] = useState("");
  const [selectedTimeForColorSimulation, setSelectedTimeForColorSimulation] = useState("");

  // -----------------------------
  // UPDATE CONFIG form area
  // -----------------------------
  const [newScenario, setNewScenario] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rampValue, setRampValue] = useState("");
  const [frequencyHz, setFrequencyHz] = useState("");
  const [newPwmValues, setNewPwmValues] = useState({
    pwm1: "",
    pwm2: "",
    pwm3: "",
    pwm4: "",
  });
  const [editable, setEditable] = useState(true);
  const [editStatus, setEditStatus] = useState(true);
  const [updateMessage, setUpdateMessage] = useState("");

  // -----------------------------
  // COLOR SIMULATION
  // -----------------------------
  const [colorSimulation, setColorSimulation] = useState({
    red: 0,
    green: 0,
    blue: 0,
  });

  // -----------------------------
  // 1) Fetch config & auto-select
  //    default for Train PC area
  // -----------------------------
  useEffect(() => {
    axios
      .get("http://localhost:5000/config")
      .then((response) => {
        const data = response.data;

        // 1) Common data
        if (data?.common) {
          setRampValue(data.common.ramp?.toString() ?? "");
          setFrequencyHz(data.common.pwm_update_freq_Hz?.toString() ?? "");
          setEditable(data.common.editable ?? true);
        }

        // 2) Timetable
        const fetchedTimetable = data?.timetable || {};
        setTimetable(fetchedTimetable);

        // 3) Train PC default: pick first class/time automatically
        const classes = Object.keys(fetchedTimetable).filter(
          (key) => key !== "editable"
        );
        if (classes.length > 0) {
          const defaultClass = classes[0];
          setSelectedClass(defaultClass);
          setSelectedClassForColorSinulation(defaultClass);

          const times = Object.keys(fetchedTimetable[defaultClass] || {});
          if (times.length > 0) {
            const defaultTime = times[0];
            setSelectedTime(defaultTime);
            setSelectedTimeForColorSimulation(defaultTime);
            // Set PWM values from that default
            const pwm = fetchedTimetable[defaultClass][defaultTime];
            setPwmValues(pwm || {});
          }
        }

        // 4) Update form default (Optional):
        // You could do the same approach for newScenario/newTime if you want them auto-selected.
        // Here, we simply leave them blank or default. 
        // But if you'd like to pick the first scenario/time, you could do it here similarly.
      })
      .catch((error) => {
        console.error("Error fetching configuration:", error);
      });
  }, []);

  // -----------------------------
  // 2) When scenario/time changes
  //    in Update form, set PWM defaults
  // -----------------------------
  useEffect(() => {
    if (newScenario && newTime && timetable[newScenario]?.[newTime]) {
      const defaultPwm = timetable[newScenario][newTime];
      setNewPwmValues({
        pwm1: defaultPwm?.pwm1?.toString() ?? "",
        pwm2: defaultPwm?.pwm2?.toString() ?? "",
        pwm3: defaultPwm?.pwm3?.toString() ?? "",
        pwm4: defaultPwm?.pwm4?.toString() ?? "",
      });
    } else {
      // No data found -> reset fields
      setNewPwmValues({
        pwm1: "",
        pwm2: "",
        pwm3: "",
        pwm4: "",
      });
    }
  }, [newScenario, newTime, timetable]);

  // -----------------------------
  // Train PC area: Apply button
  // -----------------------------
  const handleApply = () => {
    if (!selectedClass || !selectedTime) {
      setMessage("Please select a class and time.");
      return;
    }

    if (
      timetable[selectedClass] &&
      timetable[selectedClass][selectedTime]
    ) {
      const pwm = timetable[selectedClass][selectedTime];
      setPwmValues(pwm || {});
      setMessage("");
      setSelectedClassForColorSinulation(selectedClass);
      setSelectedTimeForColorSimulation(selectedTime);

      if (editable === false) {
        setEditStatus(false);
      }else{
        setEditStatus(true);
      }
    } else {
      setMessage("Invalid class or time selected.");
    }
  };

  // -----------------------------
  // Update config on the server
  // -----------------------------
  const handleUpdate = () => {
    const rampNum = parseFloat(rampValue);
    if (isNaN(rampNum) || rampNum < 1 || rampNum > 100) {
      alert("Please fill the Ramp value between 1 and 100.");
      return;
    }

    const freqNum = parseFloat(frequencyHz);
    if (isNaN(freqNum) || freqNum < 1 || freqNum > 100) {
      alert("Please fill the Frequency value between 1 and 100.");
      return;
    }

    const pwmValuesPercent = {
      pwm1: parseFloat(newPwmValues.pwm1) || null,
      pwm2: parseFloat(newPwmValues.pwm2) || null,
      pwm3: parseFloat(newPwmValues.pwm3) || null,
      pwm4: parseFloat(newPwmValues.pwm4) || null,
    };

    // Check 1..100 range
    for (const key in pwmValuesPercent) {
      const val = pwmValuesPercent[key];
      if (val !== null && (val < 1 || val > 100)) {
        alert(
          `Invalid PWM value for ${key}. Please enter a value between 1 and 100.`
        );
        return;
      }
    }

    const updatedConfig = {
      common: {
        ramp: rampNum,
        pwm_update_freq_Hz: freqNum,
      },
      timetable: {
        ...timetable,
        [newScenario]: {
          ...(timetable[newScenario] || {}),
          [newTime]: pwmValuesPercent,
        },
      },
    };

    axios
      .post("http://localhost:5000/config", { updatedConfig })
      .then((response) => {
        setUpdateMessage("Configuration updated successfully!");
        setTimetable(response.data.config.timetable);
      })
      .catch((error) => {
        console.error("Error updating configuration:", error);
        setUpdateMessage("Failed to update configuration.");
      });
  };

  // -----------------------------
  // Color Simulation
  // -----------------------------
  const handleColorSimulation = () => {
    console.log("Simulated Color:", colorSimulation);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div style={{ padding: "20px" }}>
      {/* ----------------------------------
          1) TRAIN PC AREA
          ---------------------------------- */}
      <div className="form-group">
        <h1>Train PC</h1>

        <div>
          <label>Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {/*
              If we had no classes, you might want a placeholder option.
              But since we auto-select, typically we may already have a default.
            */}
            <option value="">--Choose Class--</option>
            {Object.keys(timetable)
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
        {/* EDITABLE */}
        <div>
          <label>Editable:</label>
          <label>
            <input
              type="radio"
              name="editable"
              value="true"
              checked={editable === true}
              onChange={() => setEditable(true)}
            />
            True
          </label>
          <label>
            <input
              type="radio"
              name="editable"
              value="false"
              checked={editable === false}
              onChange={() => setEditable(false)}
            />
            False
          </label>
        </div>
        <div>
          <button onClick={handleApply} style={{ marginTop: "10px" }}>
            Apply
          </button>
        </div>

        {message && <p style={{ color: "green" }}>{message}</p>}

      </div>

      {/* ----------------------------------
          2) UPDATE CONFIGURATION
          ---------------------------------- */}
      <div className="form-group" style={{ marginTop: "40px" }}>
        <h1>Update Configuration</h1>

        {/* SCENARIO first */}
        <div>
          <label>Scenario:</label>
          <select
            value={newScenario}
            onChange={(e) => setNewScenario(e.target.value)}
          >
            <option value="">--Choose Scenario--</option>
            <option value="first_class">First Class</option>
            <option value="second_class">Second Class</option>
            <option value="restaurant">Restaurant</option>
            <option value="third_class">Third Class</option>
          </select>
        </div>

        {/* TIME second */}
        <div>
          <label>Time:</label>
          <select value={newTime} onChange={(e) => setNewTime(e.target.value)}>
            <option value="">--Choose Time--</option>
            <option value="06:00">06:00</option>
            <option value="12:00">12:00</option>
            <option value="18:00">18:00</option>
            <option value="22:00">22:00</option>
            <option value="00:00">00:00</option>
          </select>
        </div>

        {/* RAMP & FREQUENCY */}
        <div>
          <label>Ramp (1-100):</label>
          <input
            type="number"
            min="1"
            max="100"
            value={rampValue}
            onChange={(e) => setRampValue(e.target.value)}
          />
        </div>
        <div>
          <label>Frequency (Hz, 1-100):</label>
          <input
            type="number"
            min="1"
            max="100"
            value={frequencyHz}
            onChange={(e) => setFrequencyHz(e.target.value)}
          />
        </div>

        {/* PWM fields */}
        <div>
          <label>PWM1:</label>
          <input
            type="number"
            min="1"
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

        {/* UPDATE BUTTON */}
        <div>
          <button onClick={handleUpdate} style={{ marginTop: "10px" }} disabled={!editStatus}>
            Update
          </button>
        </div>

        {updateMessage && <p style={{ color: "green" }}>{updateMessage}</p>}
      </div>

      {/* ----------------------------------
          3) COLOR SIMULATION
          ---------------------------------- */}
      <div className="form-group" style={{ marginTop: "40px" }}>
        <h1>
          {selectedClassForColorSinulation} - {selectedTimeForColorSimulation}
        </h1>
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
    </div>
  );
};

export default App;