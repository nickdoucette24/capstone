const express = require("express");
const app = express();
const knex = require("knex")(require("./knexfile"));
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
app.get("/teams", async (_req, res) => {
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

// Basic GET request to get favourite team from MySQL users table
app.get("/users", async (req, res) => {
  const { id } = req.query;
  try {
    const favouriteTeam = await knex("users")
      .join("teams", "users.team_id", "teams.id")
      .select("teams.team_name as favourite_team")
      .where("users.id", id)
      .first();

    // Check if the user was found and has a favourite team
    if (favouriteTeam) {
      res.status(200).json({
        message: "Favourite Team retrieved successfully.",
        success: true,
        content: favouriteTeam.favourite_team,
      });
    } else {
      res.status(404).json({
        message: "User not found or no favourite team assigned.",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error Getting Favourite Team.",
      success: false,
      error: error.message,
    });
  }
});

// Route to Get Favourite Team
app.get("/favourite-team/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json("Bad Request: User ID is required");
  }

  try {
    // Join the users and teams tables to get the favourite team details
    const teamColours = await knex("users")
      .join("teams", "users.team_id", "teams.id")
      .where("users.id", user_id)
      .select(
        "teams.id as team_id",
        "teams.team_name",
        "teams.primary_color",
        "teams.secondary_color",
        "teams.alternative_color",
        "teams.special_color"
      )
      .first();

    if (!teamColours) {
      return res.status(404).json("Favourite team not found for the user");
    }

    return res.status(200).json({
      message: "Favourite team retrieved successfully",
      content: teamColours,
    });
  } catch (error) {
    console.error("Error retrieving favourite team: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route to Edit Favourite Team
app.put("/favourite-team", async (req, res) => {
  const { user_id, team_id } = req.body;

  if (!user_id || !team_id) {
    return res
      .status(400)
      .json("Bad Request: User ID and Team ID are required");
  }

  try {
    await knex("users").where({ id: user_id }).update({ team_id: team_id });

    const updatedTeam = await knex("teams")
      .where({ id: team_id })
      .select(
        "team_name",
        "primary_color",
        "secondary_color",
        "alternative_color",
        "special_color"
      )
      .first();

    return res.status(200).json({
      message: "Favorite team updated successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Error updating favorite team: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Basic GET request to get teams count from MySQL users table
app.get("/teams-count", async (_req, res) => {
  try {
    const teamCounts = await knex("users")
      .join("teams", "users.team_id", "teams.id")
      .select(
        "teams.id",
        "teams.team_name",
        "teams.primary_color",
        "teams.secondary_color",
        "teams.special_color",
        "teams.alternative_color"
      )
      .count("users.id as user_count")
      .groupBy(
        "teams.id",
        "teams.team_name",
        "teams.primary_color",
        "teams.secondary_color",
        "teams.special_color",
        "teams.alternative_color"
      );

    res.status(200).json({
      message: "Teams count retrieved successfully.",
      success: true,
      content: teamCounts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Getting Teams Count",
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
