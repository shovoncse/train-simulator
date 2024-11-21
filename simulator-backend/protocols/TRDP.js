module.exports.handle = (formData) => {
    const { timeSync, lightScenario } = formData;
  
    // Simulate processing TRDP protocol
    if (!timeSync || !lightScenario) {
      return { error: 'Missing required fields for TRDP protocol' };
    }
  
    // Simulated response
    return {
      status: 'Success',
      protocol: 'TRDP',
      receivedData: {
        timeSync,
        lightScenario
      },
      message: `Scenario "${lightScenario}" applied at ${timeSync}`
    };
  };
  