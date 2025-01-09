import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [timetable, setTimetable] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [pwmValues, setPwmValues] = useState({});
  const [message, setMessage] = useState("");

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

  return (
    <div className="main_container" style={{ padding: "20px" }}>
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
  );
};

export default App;
