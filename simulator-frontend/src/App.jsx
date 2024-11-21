import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtocolSimulator from './components/ProtocolSimulator';
import CIPConfig from './protocol-configs/CIP.json';
import TRDPConfig from './protocol-configs/TRDP.json';
import './index.css';

function App() {
  const [protocol, setProtocol] = useState('');
  const [config, setConfig] = useState(null);

  const configMap = {
    CIP: CIPConfig,
    TRDP: TRDPConfig,
  };

  // Load JSON configuration based on selected protocol
  useEffect(() => {
    if (protocol) {
      setConfig(configMap[protocol]);
    }
  }, [protocol]);
  
  return (
    <div className="container mt-4">
      <h1 className="text-center">Train Lighting Simulator</h1>
      <div className="mb-4">
        <label htmlFor="protocolSelect">Select Protocol:</label>
        <select
          id="protocolSelect"
          className="form-select"
          value={protocol}
          onChange={(e) => setProtocol(e.target.value)}
        >
          <option value="">-- Select Protocol --</option>
          <option value="CIP">CIP</option>
          <option value="TRDP">TRDP</option>
        </select>
      </div>

      {/* Render simulator if protocol is selected */}
      {config ? (
        <ProtocolSimulator protocol={protocol} config={config} />
      ) : (
        <p className="text-muted">Select a protocol to load its simulator.</p>
      )}
    </div>
  );
}

export default App;
