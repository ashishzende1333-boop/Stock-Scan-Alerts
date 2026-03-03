// api/index.cjs
let serverModule;
try {
  // Try to load the compiled server
  serverModule = require('../dist/index.cjs');
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
}

if (serverModule) {
  const app = serverModule.default || serverModule;
  const setupPromise = serverModule.setupPromise;

  module.exports = async (req, res) => {
    if (setupPromise) {
      await setupPromise;
    }
    return app(req, res);
  };
}