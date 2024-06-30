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

// Basic GET request to get teams from MySQL teams table
app.get("/teams", async (req, res) => {
  try {
    const teams = await knex("teams").select("id", "name");
    res.status(200).json({
      message: "Teams list retrieved successfully.",
      success: true,
      content: teams,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Getting Current Teams: ",
      success: false,
    });
  }
});

// API Routes
const authRoutes = require("./routes/auth");
const liveRoutes = require("./routes/live");
const statsRoutes = require("./routes/stats");

app.use("/auth", authRoutes);
app.use("/live", liveRoutes);
app.use("/stats", statsRoutes);

// Server Initialization
app.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
});
