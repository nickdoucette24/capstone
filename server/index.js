const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const { PORT, CORS_ORIGIN } = process.env;

// Middleware
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

// Basic Route to verify server configuration
app.get("/", (_req, res) => {
  res.send("Server is live on PORT: " + PORT);
});

// API Routes
// Route to '/auth' path to get authentication/authorization data
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Route to '/live' path to get live data
const liveRoutes = require("./routes/live");
app.use("/live", liveRoutes);

// Route to '/stats' path to get current and historical stats
const statsRoutes = require("./routes/stats");
app.use("/stats", statsRoutes);

// Server Initialization
app.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
});
