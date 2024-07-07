const router = require("express").Router();
const axios = require("axios");

const liveUrl = "https://api.openf1.org/v1";

// Function to emit events to clients
const emitUpdate = (io, event, data) => {
  io.emit(event, data);
};

module.exports = (io) => {
  // Route to get Driver Data
  router.get("/drivers", async (_req, res) => {
    try {
      const response = await axios.get(`${liveUrl}/drivers?session_key=latest`);
      const driversData = response.data;

      const driversMap = driversData.reduce((acc, driver) => {
        if (
          !acc[driver.full_name] ||
          driver.session_key > acc[driver.full_name].session_key
        ) {
          acc[driver.full_name] = driver;
        }
        return acc;
      }, {});

      const drivers = Object.values(driversMap).map((driver) => ({
        driver_number: driver.driver_number,
        full_name: driver.full_name,
        name_acronym: driver.name_acronym,
        session_key: driver.session_key,
        meeting_key: driver.meeting_key,
        headshot_url: driver.headshot_url,
        team_colour: driver.team_colour,
        country_code: driver.country_code,
        team_name: driver.team_name,
      }));

      const highestSessionKey = Math.max(
        ...drivers.map((driver) => driver.session_key)
      );
      const filteredDrivers = drivers.filter(
        (driver) => driver.session_key === highestSessionKey
      );

      res.status(200).json(filteredDrivers);

      // Emit real-time update to clients
      emitUpdate(io, "driversUpdate", filteredDrivers);
    } catch (error) {
      console.error("Unable to get driver data: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route to get Car Data
  router.get("/car-data", async (req, res) => {
    const { driver_number, session_key } = req.query;

    if (!driver_number || !session_key) {
      return res
        .status(400)
        .json("Bad Request: Driver Number and Session Key Required");
    }

    try {
      const response = await axios.get(
        `${liveUrl}/car_data?driver_number=${driver_number}&session_key=${session_key}`
      );
      const carData = response.data;

      const formattedData = carData.map((update) => ({
        driver_number: update.driver_number,
        brake: update.brake,
        date: update.date,
        drs: update.drs,
        meeting_key: update.meeting_key,
        n_gear: update.n_gear,
        session_key: update.session_key,
        speed: update.speed,
        throttle: update.throttle,
      }));

      res.status(200).json(formattedData);

      // Emit real-time update to clients
      emitUpdate(io, "carDataUpdate", formattedData);
    } catch (error) {
      console.error("Unable to get car data: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route to get live car intervals
  router.get("/intervals", async (req, res) => {
    const { driver_number, session_key } = req.query;

    if (!driver_number || !session_key) {
      return res
        .status(400)
        .json("Bad Request: Driver Number and Session Key Required");
    }

    try {
      const response = await axios.get(
        `${liveUrl}/intervals?driver_number=${driver_number}&session_key=${session_key}`
      );
      const intervalData = response.data;

      const sortedIntervals = intervalData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const mostRecentInterval = sortedIntervals[0];

      res.status(200).json(mostRecentInterval);

      // Emit real-time update to clients
      emitUpdate(io, "intervalsUpdate", mostRecentInterval);
    } catch (error) {
      console.error("Unable to get interval data: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route to get Race Details
  router.get("/race-details", async (_req, res) => {
    try {
      const response = await axios.get(
        `${liveUrl}/meetings?meeting_key=latest`
      );
      const raceDetails = response.data;

      const formattedRace = raceDetails.map((race) => ({
        circuit_key: race.circuit_key,
        circuit_short_name: race.circuit_short_name,
        country_name: race.country_name,
        date_start: race.date_start,
        location: race.location,
        meeting_key: race.meeting_key,
        meeting_name: race.meeting_name,
        meeting_official_name: race.meeting_official_name,
        year: race.year,
      }));

      res.status(200).json(formattedRace);

      // Emit real-time update to clients
      emitUpdate(io, "raceDetailsUpdate", formattedRace);
    } catch (error) {
      console.error("Unable to get race details: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route to get All Weekend Sessions
  router.get("/current-weekend", async (_req, res) => {
    try {
      const response = await axios.get(
        `${liveUrl}/sessions?meeting_key=latest`
      );
      const sessions = response.data;

      res.status(200).json(sessions);

      // Emit real-time update to clients
      emitUpdate(io, "currentWeekendUpdate", sessions);
    } catch (error) {
      console.error("Unable to get current race weekend data: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route to get Session Details
  router.get("/session-details", async (req, res) => {
    const { session_key } = req.query;

    if (!session_key) {
      return res.status(400).json("Bad Request: Session Key Required");
    }

    try {
      const response = await axios.get(
        `${liveUrl}/sessions?session_key=${session_key}`
      );
      const raceDetails = response.data;

      res.status(200).json(raceDetails);

      // Emit real-time update to clients
      emitUpdate(io, "sessionDetailsUpdate", raceDetails);
    } catch (error) {
      console.error("Unable to get session details: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route to get Next Session Time
  router.get("/next-session", async (_req, res) => {
    try {
      const response = await axios.get(
        `${liveUrl}/sessions?session_key=latest`
      );
      const sessionDetails = response.data[0];
      const dateStart = sessionDetails.date_start;

      res.status(200).json({ date_start: dateStart });

      // Emit real-time update to clients
      emitUpdate(io, "nextSessionUpdate", { date_start: dateStart });
    } catch (error) {
      console.error("Unable to get session details: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route to get Pitstop Data
  router.get("/pitstops", async (req, res) => {
    const { session_key, driver_number } = req.query;

    if (!session_key || !driver_number) {
      return res
        .status(400)
        .json("Bad Request: Session Key and Driver Number Required");
    }

    try {
      const response = await axios.get(
        `${liveUrl}/pit?session_key=${session_key}&driver_number=${driver_number}`
      );
      const pitDetails = response.data;

      res.status(200).json(pitDetails);

      // Emit real-time update to clients
      emitUpdate(io, "pitstopsUpdate", pitDetails);
    } catch (error) {
      console.error("Unable to get pitstop details: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route to get Position Data
  router.get("/positions", async (req, res) => {
    const { session_key, driver_number } = req.query;

    if (!session_key || !driver_number) {
      return res
        .status(400)
        .json("Bad Request: Session Key and Driver Number Required");
    }

    try {
      const response = await axios.get(`${liveUrl}/position`, {
        params: { session_key, driver_number },
      });
      const positionData = response.data;

      const sortedPositions = positionData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const mostRecentPosition = sortedPositions[0];

      res.status(200).json(mostRecentPosition);

      // Emit real-time update to clients
      emitUpdate(io, "positionsUpdate", mostRecentPosition);
    } catch (error) {
      console.error("Unable to get position data: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route to get live Weather Updates
  router.get("/weather", async (req, res) => {
    const { session_key } = req.query;

    if (!session_key) {
      return res.status(400).json("Bad Request: Session Key Required");
    }

    try {
      const response = await axios.get(
        `${liveUrl}/weather?session_key=${session_key}`
      );
      const weatherData = response.data;

      const sortedWeatherUpdates = weatherData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const mostRecentWeatherUpdate = sortedWeatherUpdates[0];

      res.status(200).json(mostRecentWeatherUpdate);

      // Emit real-time update to clients
      emitUpdate(io, "weatherUpdate", mostRecentWeatherUpdate);
    } catch (error) {
      console.error("Unable to get weather data: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route to get live Tyre Data
  router.get("/stints", async (req, res) => {
    const { session_key, driver_number } = req.query;

    if (!session_key || !driver_number) {
      return res
        .status(400)
        .json("Bad Request: Session Key and Driver Number Required");
    }

    try {
      const response = await axios.get(
        `${liveUrl}/stints?session_key=${session_key}&driver_number=${driver_number}`
      );
      const stintsData = response.data;

      const sortedStints = stintsData.sort(
        (a, b) => a.stint_number - b.stint_number
      );

      res.status(200).json(sortedStints);

      // Emit real-time update to clients
      emitUpdate(io, "stintsUpdate", sortedStints);
    } catch (error) {
      console.error("Unable to get tyre data: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  // Route for retrieving all prior races this season
  router.get("/past-races", async (req, res) => {
    const { year } = req.query;

    try {
      const response = await axios.get(`${liveUrl}/meetings?year=${year}`);
      const pastRaces = response.data;

      res.status(200).json(pastRaces);

      // Emit real-time update to clients
      emitUpdate(io, "pastRacesUpdate", pastRaces);
    } catch (error) {
      console.error("Unable to get past races: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

  return router;
};
