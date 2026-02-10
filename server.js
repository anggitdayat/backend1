// ======================
// 1. LOAD PACKAGES
// ======================
console.log("🔄 Loading packages...");
const express = require('express');
const cors = require('cors');
console.log("✅ Packages loaded");

// ======================
// 2. INITIALIZE APP
// ======================
const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// 3. MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());
console.log("✅ Middleware setup done");

// ======================
// 4. SIMPLE IN-MEMORY STORAGE
// ======================
let deviceState = {
    led: "OFF",
    lastUpdated: new Date().toISOString()
};
console.log("✅ Memory storage initialized");

// ======================
// 5. ROUTES
// ======================

// Route 1: Homepage (for testing)
app.get('/', (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] GET /`);
    res.json({
        message: "ESP32 Backend API is running!",
        endpoints: {
            getState: "GET /api/state",
            sendCommand: "POST /api/control",
            deviceCommands: "GET /api/device"
        }
    });
});

// Route 2: Get current state
app.get('/api/state', (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] GET /api/state`);
    res.json({
        success: true,
        deviceState: deviceState,
        serverTime: new Date().toISOString()
    });
});

// Route 3: Send command
app.post('/api/control', (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] POST /api/control`);
    console.log("Request body:", req.body);
    
    const { command, value } = req.body;
    
    if (!command || !value) {
        return res.status(400).json({
            success: false,
            error: "Missing command or value"
        });
    }
    
    // Update device state
    deviceState[command] = value;
    deviceState.lastUpdated = new Date().toISOString();
    
    res.json({
        success: true,
        message: `Command ${command}=${value} received`,
        deviceState: deviceState
    });
});

// Route 4: For ESP32 to poll
app.get('/api/device', (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] GET /api/device - ESP32 polling`);
    res.json(deviceState);
});

// ======================
// 6. START SERVER
// ======================
app.listen(PORT, () => {
    console.log(`\n`);
    console.log(`╔══════════════════════════════════════╗`);
    console.log(`║         ESP32 BACKEND API            ║`);
    console.log(`╠══════════════════════════════════════╣`);
    console.log(`║  Status: ONLINE                      ║`);
    console.log(`║  URL: http://localhost:${PORT}       ║`);
    console.log(`║                                      ║`);
    console.log(`║  Test Endpoints:                     ║`);
    console.log(`║  • GET  /                            ║`);
    console.log(`║  • GET  /api/state                   ║`);
    console.log(`║  • POST /api/control                 ║`);
    console.log(`║  • GET  /api/device                  ║`);
    console.log(`╚══════════════════════════════════════╝`);
    console.log(`\n📢 Server ready! Open http://localhost:${PORT} in browser`);
});