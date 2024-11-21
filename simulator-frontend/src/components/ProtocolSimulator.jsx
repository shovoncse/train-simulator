import React, { useState } from 'react';
import axios from 'axios';

function ProtocolSimulator({ protocol, config }) {
  const [formData, setFormData] = useState({});
  const [response, setResponse] = useState('');

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Send data to backend
  const handleSend = () => {
    axios.post('http://localhost:5000/simulate', { protocol, formData })
      .then((res) => setResponse(res.data))
      .catch((err) => console.error('Error sending data:', err));
  };

  return (
    <div>
      <h2>{protocol} Protocol Simulator</h2>
      <form className="mb-4">
        {config.fields.map((field) => (
          <div className="mb-3" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              type={field.type || 'text'}
              className="form-control"
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder || ''}
            />
          </div>
        ))}
      </form>
      <button className="btn btn-primary" onClick={handleSend}>
        Send
      </button>

      {response && (
        <div className="mt-4">
          <h4>Response:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ProtocolSimulator;
