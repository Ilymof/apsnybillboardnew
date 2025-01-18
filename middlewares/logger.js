const logger = (req, res) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
  };
  
  module.exports = logger;