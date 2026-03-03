// api/index.js
let app;
try {
  // Try to load the compiled server
  app = require('../server/index.js');
  console.log("✅ Server loaded successfully");
} catch (error) {
  console.error("❌ Failed to load server:", error);
  // Export a fallback function that shows the error
  module.exports = (req, res) => {
    res.status(500).json({
      error: "Server failed to start",
      message: error.message,
      stack: error.stack
    });
  };
  return;
}

// Export the loaded app
module.exports = app;