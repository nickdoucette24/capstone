import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import "./RaceWeekendPage.scss";

const url = process.env.REACT_APP_SERVER_URL;

const RaceWeekendPage = () => {
  const [raceWeekend, setRaceWeekend] = useState([]);
  const [currentRaceDetails, setCurrentRaceDetails] = useState({});
  const loggedIn = useAuth();

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);

    const getRaceWeekend = async () => {
      try {
        const response = await axios.get(`${url}/live/current-weekend`);
        setRaceWeekend(response.data);
      } catch (error) {
        console.error("Error fetching race weekend data: ", error);
      }
    };

    const getCurrentRaceDetails = async () => {
      try {
        const response = await axios.get(`${url}/live/race-details`);
        setCurrentRaceDetails(response.data[0]);
      } catch (error) {
        console.error("Error fetching current race details: ", error);
      }
    };

    getRaceWeekend();
    getCurrentRaceDetails();
  }, []);

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

  return (
    <div className="race-weekend">
      <div className="race-weekend__title">
        <h1 className="race-weekend__title--grandprix">
          {currentRaceDetails.meeting_name}
        </h1>
        <h4 className="race-weekend__title--fullname">
          ({currentRaceDetails.meeting_official_name})
        </h4>
        <h3 className="race-weekend__title--name">
          {currentRaceDetails.location},{" "}
          <span className="race-weekend__title--country">
            {currentRaceDetails.country_name}
          </span>
        </h3>
      </div>
      <div className="race-weekend__wrapper">
        <div className="race-weekend__container">
          <h2 className="race-weekend__session">Practice Sessions</h2>
          {practiceSessions.map((session, index) => (
            <Link
              key={session.session_key}
              to={
                loggedIn
                  ? `/race-weekend/${currentRaceDetails.meeting_key}/${session.session_key}`
                  : "/"
              }
              className={`race-weekend__container--p${index + 1}`}
            >
              <div className="race-weekend__link--practice">
                {session.session_name}
              </div>
            </Link>
          ))}
        </div>
        <div className="race-weekend__container">
          <h2 className="race-weekend__session">Qualifying Sessions</h2>
          {qualifyingSessions.map((session, index) => (
            <Link
              key={session.session_key}
              to={
                loggedIn
                  ? `/race-weekend/${currentRaceDetails.meeting_key}/${session.session_key}`
                  : "/"
              }
              className={`race-weekend__container--qualifying${index + 1}`}
            >
              <div className="race-weekend__link--qualifying">
                {session.session_name}
              </div>
            </Link>
          ))}
        </div>
        <div className="race-weekend__container">
          <h2 className="race-weekend__session">Race Sessions</h2>
          {raceSessions.map((session, index) => (
            <Link
              key={session.session_key}
              to={
                loggedIn
                  ? `/race-weekend/${currentRaceDetails.meeting_key}/${session.session_key}`
                  : "/"
              }
              className={`race-weekend__container--race${index + 1}`}
            >
              <div className="race-weekend__link--race">
                {session.session_name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaceWeekendPage;
