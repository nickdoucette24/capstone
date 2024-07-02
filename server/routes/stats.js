const router = require("express").Router();
const axios = require("axios");
const knex = require("knex")(require("../knexfile"));
require("dotenv").config();

const { API_F1_KEY } = process.env;

// API Url
const ergastUrl = "http://ergast.com/api/f1";

// Route for Current Driver Standings
router.get("/driver-standings", async (_req, res) => {
  try {
    const response = await axios.get(
      `${ergastUrl}/current/driverStandings.json`
    );
    const driverStandingsData = response.data;

    // Extract the necessary data
    const standingsList =
      driverStandingsData.MRData.StandingsTable.StandingsLists[0];

    // Format the response
    const formattedData = {
      season: standingsList.season,
      round: standingsList.round,
      DriverStandings: standingsList.DriverStandings.map((driverStanding) => ({
        position: driverStanding.position,
        points: driverStanding.points,
        wins: driverStanding.wins,
        Driver: {
          first_name: driverStanding.Driver.givenName,
          last_name: driverStanding.Driver.familyName,
          dob: driverStanding.Driver.dateOfBirth,
          nationality: driverStanding.Driver.nationality,
        },
        Constructors: driverStanding.Constructors.map((constructor) => ({
          name: constructor.name,
        })),
      })),
    };

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error getting Driver Standings: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route for Current Constructor Standings
router.get("/constructor-standings", async (_req, res) => {
  try {
    const response = await axios.get(
      `${ergastUrl}/current/constructorStandings.json`
    );
    const constructorStandingsData = response.data;

    // Extract the necessary data
    const standingsList =
      constructorStandingsData.MRData.StandingsTable.StandingsLists[0];

    // Format the response
    const formattedData = {
      season: standingsList.season,
      round: standingsList.round,
      ConstructorStandings: standingsList.ConstructorStandings.map(
        (constructorStanding) => ({
          position: constructorStanding.position,
          points: constructorStanding.points,
          wins: constructorStanding.wins,
          Constructor: {
            name: constructorStanding.Constructor.name,
            nationality: constructorStanding.Constructor.nationality,
          },
        })
      ),
    };

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error getting Driver Standings: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route to get Track Maps
router.get("/track-maps", async (req, res) => {
  const { track_id } = req.query;

  // API Request Bundle
  const requestBundle = {
    method: "GET",
    url: "https://api-formula-1.p.rapidapi.com/circuits",
    params: { id: track_id },
    headers: {
      "x-rapidapi-key": API_F1_KEY,
      "x-rapidapi-host": "api-formula-1.p.rapidapi.com",
    },
  };

  try {
    // Make get request to API-FORMULA-1 in order to get track maps and track details
    const response = await axios.request(requestBundle);
    const trackMaps = response.data.response;

    // Format the response
    const formattedTrackMaps = trackMaps.map((track) => ({
      id: track.id,
      name: track.name,
      image: track.image,
      competition: {
        id: track.competition.id,
        name: track.competition.name,
      },
    }));

    return res.status(200).json(formattedTrackMaps);
  } catch (error) {
    console.error("Error getting Driver Standings: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route to get Circuit Mappings
router.get("/circuit-mappings", async (_req, res) => {
  try {
    const circuitMappings = await knex("circuits").select("*");
    res.status(200).json(circuitMappings);
  } catch (error) {
    console.error("Error retrieving circuit mappings: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
