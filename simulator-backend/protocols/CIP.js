module.exports.handle = (formData) => {
    const { clock, lightLevel1, lightLevel2 } = formData;
  
    // Simulate processing CIP protocol
    if (!clock || !lightLevel1 || !lightLevel2) {
      return { error: 'Missing required fields for CIP protocol' };
    }
  
    // Simulated response
    return {
      status: 'Success',
      protocol: 'CIP',
      receivedData: {
        clock,
        lightLevel1,
        lightLevel2
      },
      message: `Lighting levels updated: 1st Class (${lightLevel1}), 2nd Class (${lightLevel2})`
    };
  };
  