import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./RaceWeekendPage.scss";

const url = process.env.REACT_APP_SERVER_URL;

const RaceWeekendPage = () => {
  const [raceWeekend, setRaceWeekend] = useState([]);
  const [currentRaceDetails, setCurrentRaceDetails] = useState({});
  const [hasSprint, setHasSprint] = useState(false);
  // const [hasMainRace, setHasMainRace] = useState(false);

  useEffect(() => {
    const getRaceWeekend = async () => {
      try {
        const response = await axios.get(`${url}/live/current-weekend`);
        setRaceWeekend(response.data);
        sessionStorage.setItem("currentWeekend", JSON.stringify(response.data));
        checkForSprint(response.data);
      } catch (error) {
        console.error("Error fetching race weekend data: ", error);
      }
    };

    const getCurrentRaceDetails = async () => {
      try {
        const response = await axios.get(`${url}/live/race-details`);
        setCurrentRaceDetails(response.data[0]);
        sessionStorage.setItem(
          "currentRaceDetails",
          JSON.stringify(response.data[0])
        );
      } catch (error) {
        console.error("Error fetching current race details: ", error);
      }
    };

    const storedRaceWeekend = sessionStorage.getItem("currentWeekend");
    const storedRaceDetails = sessionStorage.getItem("currentRaceDetails");

    if (storedRaceWeekend) {
      const parsedWeekend = JSON.parse(storedRaceWeekend);
      setRaceWeekend(parsedWeekend);
      checkForSprint(parsedWeekend);
    } else {
      getRaceWeekend();
    }

    if (storedRaceDetails) {
      setCurrentRaceDetails(JSON.parse(storedRaceDetails));
    } else {
      getCurrentRaceDetails();
    }
  }, []);

  const checkForSprint = (sessions) => {
    for (const session of sessions) {
      if (session.session_name.includes("Sprint")) {
        setHasSprint(true);
      }
      // if (session.session_name === "Race") {
      //   setHasMainRace(true);
      // }
    }
  };

  // Set the mapping functions variables
  const practiceSessions = raceWeekend.filter(
    (session) => session.session_type === "Practice"
  );
  const qualifyingSessions = raceWeekend.filter(
    (session) => session.session_type === "Qualifying"
  );
  const raceSessions = raceWeekend.filter(
    (session) => session.session_type === "Race"
  );

  // Adjust the mapping functions to account for predetermined weekend schedules based on if a session_name has Sprint in it or not
  const adjustedPracticeSessions = hasSprint
    ? practiceSessions.slice(0, 1)
    : practiceSessions.slice(0, 3);

  const adjustedQualifyingSessions = hasSprint
    ? qualifyingSessions.slice(0, 2)
    : qualifyingSessions.slice(0, 1);

  const adjustedRaceSessions = hasSprint
    ? raceSessions.slice(0, 2)
    : raceSessions.slice(0, 1);

  return (
    <div className="race-weekend">
      <div className="race-weekend__title">
        <h1 className="race-weekend__title--grandprix">
          {currentRaceDetails.meeting_name}
        </h1>
        <h3 className="race-weekend__title--name">
          {currentRaceDetails.location}
        </h3>
      </div>
      <div className="race-weekend__wrapper">
        <div className="race-weekend__container">
          {adjustedPracticeSessions.map((session, index) => (
            <Link
              key={session.session_key}
              to={`/race-weekend/${currentRaceDetails.meeting_key}/${session.session_key}`}
              className={`race-weekend__container--p${index + 1}`}
            >
              <div className="race-weeking__link--text">
                {session.session_name}
              </div>
            </Link>
          ))}
        </div>
        <div className="race-weekend__container">
          {adjustedQualifyingSessions.map((session, index) => (
            <Link
              key={session.session_key}
              to={`/race-weekend/${currentRaceDetails.meeting_key}/${session.session_key}`}
              className={`race-weekend__container--qualifying${index + 1}`}
            >
              <div className="race-weeking__link--text">
                {session.session_name}
              </div>
            </Link>
          ))}
        </div>
        <div className="race-weekend__container">
          {adjustedRaceSessions.map((session, index) => (
            <Link
              key={session.session_key}
              to={`/race-weekend/${currentRaceDetails.meeting_key}/${session.session_key}`}
              className={`race-weekend__container--race${index + 1}`}
            >
              <div className="race-weeking__link--text">
                {session.session_name}
              </div>
            </Link>
          ))}
          {hasSprint && (
            <Link
              to={`/race-weekend/${currentRaceDetails.meeting_key}/main-race`}
              className="race-weekend__container--main-race"
            >
              Race
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaceWeekendPage;
