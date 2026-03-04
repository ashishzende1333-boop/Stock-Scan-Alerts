// Absolute minimal serverless function
try {
    const app = require("./server/index.js");
    console.log("✅ Server loaded successfully");
    module.exports = app;
} catch (error) {
    console.error("❌ Failed to load server:", error);
    module.exports = (req, res) => {
        res.status(500).json({
            error: "Server failed to start",
            message: error.message,
            stack: error.stack
        });
    };
}
