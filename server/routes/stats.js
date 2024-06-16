const router = require("express").Router();
const axios = require("axios");

// API Urls
const ergastUrl = "http://ergast.com/api/f1";
const f1MotorsportUrl = "";
const apiF1Url = "";

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

    // Transform the response to the desired format
    const transformedData = {
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

    return res.status(200).json(transformedData);
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

    // Transform the response to the desired format
    const transformedData = {
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

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error getting Driver Standings: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;

// try {

// } catch (error) {
//     console.error("Error getting Driver Standings: ", error);
//     res.status(500).json(({
//         message: "Internal Server Error"
//     }));
// }
