const router = require("express").Router();
const axios = require("axios");

const liveUrl = "https://api.openf1.org/v1";

// Route to get Driver Data
router.get("/drivers", async (_req, res) => {
  try {
    // Make a GET request to the OpenF1 API
    const response = await axios.get(`${liveUrl}/drivers?session_key=latest`);
    const driversData = response.data;

    // Reduce driversData to get the most recent session for each driver
    const driversMap = driversData.reduce((acc, driver) => {
      // Check if the driver's name is already in the accumulator
      if (
        !acc[driver.full_name] ||
        driver.session_key > acc[driver.full_name].session_key
      ) {
        // Add or update the driver in the accumulator
        acc[driver.full_name] = driver;
      }
      return acc; // Return the updated accumulator
    }, {});

    // Format the reduced data
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

    // Get the highest session key
    const highestSessionKey = Math.max(
      ...drivers.map((driver) => driver.session_key)
    );

    // Filter drivers to include only those with the highest session key
    const filteredDrivers = drivers.filter(
      (driver) => driver.session_key === highestSessionKey
    );

    // Send the transformed data to the client
    res.status(200).json(filteredDrivers);
  } catch (error) {
    console.error("Unable to get driver data: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route to get Car Data
router.get("/car-data", async (req, res) => {
  // Pull params from request body
  const { driver_number, session_key } = req.query;

  // Validate that the Driver Number and Session Key are in the Request Body
  if (!driver_number || !session_key) {
    return res
      .status(400)
      .json("Bad Request: Driver Number and Session Key Required");
  }

  try {
    // Make a GET request to the OpenF1 API
    const response = await axios.get(
      `${liveUrl}/car_data?driver_number=${driver_number}&session_key=${session_key}`
    );
    const carData = response.data;

    // Format the response data
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

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Unable to get car data: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route to get live car intervals
router.get("/intervals", async (req, res) => {
  // Pull params from request body
  const { driver_number, session_key } = req.query;

  // Validate that the Driver Number and Session Key are in the Request Body
  if (!driver_number || !session_key) {
    return res
      .status(400)
      .json("Bad Request: Driver Number and Session Key Required");
  }

  try {
    // Make a GET request to the OpenF1 API
    const response = await axios.get(
      `${liveUrl}/intervals?driver_number=${driver_number}&session_key=${session_key}`
    );
    const intervalData = response.data;

    // Sort the array by date in descending order and return the most recent interval
    const sortedIntervals = intervalData.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const mostRecentInterval = sortedIntervals[0];

    return res.status(200).json(mostRecentInterval);
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
    // Make a GET request to the OpenF1 API
    const response = await axios.get(`${liveUrl}/meetings?meeting_key=latest`);
    const raceDetails = response.data;
    console.log(response.data);

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

    return res.status(200).json(formattedRace);
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
    // Get the latest sessions via latest meeting_key
    const response = await axios.get(`${liveUrl}/sessions?meeting_key=latest`);
    const sessions = response.data;

    return res.status(200).json(sessions);
  } catch (error) {
    console.error("Unable to get current race weekend data: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route to get Session Details
router.get("/session-details", async (req, res) => {
  // Pull params from request body
  const { session_key } = req.query;

  // Validate that the Session Key in the Request Body
  if (!session_key) {
    return res.status(400).json("Bad Request: Session Key Required");
  }

  try {
    // Make a GET request to the OpenF1 API
    const response = await axios.get(
      `${liveUrl}/sessions?session_key=${session_key}`
    );
    const raceDetails = response.data;

    return res.status(200).json(raceDetails);
  } catch (error) {
    console.error("Unable to get session details: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route to get Pitstop Data
router.get("/pitstops", async (req, res) => {
  // Pull params from request body
  const { session_key, driver_number } = req.query;

  // Validate that the Driver Number and Session Key are in the Request Body
  if (!session_key || !driver_number) {
    return res
      .status(400)
      .json("Bad Request: Session Key and Driver Number Required");
  }

  try {
    // Make a GET request to the OpenF1 API
    const response = await axios.get(
      `${liveUrl}/pit?session_key=${session_key}&driver_number=${driver_number}`
    );
    const pitDetails = response.data;

    return res.status(200).json(pitDetails);
  } catch (error) {
    console.error("Unable to get pitstop details: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route to get Position Data
router.get("/positions", async (req, res) => {
  // Pull params from request body
  const { session_key, driver_number } = req.query;

  // Validate that the Driver Number and Session Key are in the Request Body
  if (!session_key || !driver_number) {
    return res
      .status(400)
      .json("Bad Request: Session Key and Driver Number Required");
  }

  try {
    // Make a GET request to the OpenF1 API
    const response = await axios.get(`${liveUrl}/position`, {
      params: { session_key, driver_number },
    });
    const positionData = response.data;

    // Sort the array by date in descending order and return the most recent driver position
    const sortedPositions = positionData.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const mostRecentPosition = sortedPositions[0];

    return res.status(200).json(mostRecentPosition);
  } catch (error) {
    console.error("Unable to get position data: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route to get live Weather Updates
router.get("/weather", async (req, res) => {
  // Pull params from request body
  const { session_key } = req.query;

  // Validate that the Session Key is in the Request Body
  if (!session_key) {
    return res.status(400).json("Bad Request: Session Key Required");
  }

  try {
    // GET request to the OpenF1 API
    const response = await axios.get(
      `${liveUrl}/weather?session_key=${session_key}`
    );
    const weatherData = response.data;

    // Sort the array by date in descending order and return the most recent weather update
    const sortedWeatherUpdates = weatherData.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const mostRecentWeatherUpdate = sortedWeatherUpdates[0];

    return res.status(200).json(mostRecentWeatherUpdate);
  } catch (error) {
    console.error("Unable to get weather data: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Route to get live Tyre Data
router.get("/stints", async (req, res) => {
  // Pull params from request body
  const { session_key, driver_number } = req.query;

  // Validate that the Session Key and Driver Number are in the Request Body
  if (!session_key || !driver_number) {
    return res
      .status(400)
      .json("Bad Request: Session Key and Driver Number Required");
  }

  try {
    // GET request to the OpenF1 API
    const response = await axios.get(
      `${liveUrl}/stints?session_key=${session_key}&driver_number=${driver_number}`
    );
    const stintsData = response.data;

    // Sort the array by date in ascending order and return all the stints
    const sortedStints = stintsData.sort(
      (a, b) => a.stint_number - b.stint_number
    );

    return res.status(200).json(sortedStints);
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
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Unable to get past races: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
