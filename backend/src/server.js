/**
 * ANNA - Anna He Purna Brahma
 * Backend Server
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const demandRoutes = require("./routes/demandRoutes");
const rescueRoutes = require("./routes/rescueRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        project: "ANNA",
        message: "ANNA backend is running successfully!",
        timestamp: new Date().toISOString()
    });
});

// AI Demand Prediction API
app.use("/api/demand", demandRoutes);

// Surplus Food and NGO API
app.use("/api/rescue", rescueRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("[SERVER ERROR]", err);

    res.status(500).json({
        success: false,
        error: "Internal server error occurred."
    });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log("============================================");
        console.log(" ANNA Backend Running");
        console.log(` Server: http://localhost:${PORT}`);
        console.log(` Health: http://localhost:${PORT}/api/health`);
        console.log(` Demand: http://localhost:${PORT}/api/demand`);
        console.log(` Rescue: http://localhost:${PORT}/api/rescue`);
        console.log("============================================");
    });
}

module.exports = app;