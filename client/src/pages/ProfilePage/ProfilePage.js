import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProfilePage.scss";

const url = process.env.REACT_APP_SERVER_URL;

const ProfilePage = () => {
  const [nextSession, setNextSession] = useState("");
  const [currentRaceDetails, setCurrentRaceDetails] = useState({});
  const [favouriteTeam, setFavouriteTeam] = useState("");
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const { username, id } = useParams();

  useEffect(() => {
    const getFavouriteTeam = async (id) => {
      try {
        const response = await axios.get(`${url}/users`, {
          params: { id },
        });
        setFavouriteTeam(response.data.content);
      } catch (error) {
        console.error("Error retrieving favouite team: ", error);
      }
    };

    const getDriverStandings = async () => {
      try {
        const response = await axios.get(`${url}/stats/driver-standings`);
        setDriverStandings(response.data.DriverStandings);
      } catch (error) {
        console.error("Error retrieving driver standings: ", error);
      }
    };

    const getConstructorStandings = async () => {
      try {
        const response = await axios.get(`${url}/stats/Constructor-standings`);
        setConstructorStandings(response.data.ConstructorStandings);
      } catch (error) {
        console.error("Error retrieving constructor standings: ", error);
      }
    };

    const getCurrentRaceDetails = async () => {
      try {
        const response = await axios.get(`${url}/live/race-details`);
        const raceDetails = response.data[0];
        setCurrentRaceDetails(raceDetails);
      } catch (error) {
        console.error("Error retrieving current race details: ", error);
      }
    };

    const getNextSessionTime = async () => {
      try {
        const response = await axios.get(`${url}/live/next-session`);
        const dateStart = response.data.date_start;
        const formattedDate = new Date(dateStart).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setNextSession(formattedDate);
      } catch (error) {
        console.error("Error retrieving current race details: ", error);
      }
    };

    getCurrentRaceDetails();
    getNextSessionTime();
    getDriverStandings();
    getConstructorStandings();
    getFavouriteTeam(id);
  }, [id]);

  return (
    <div className="profile-page">
      <div className="profile-details">
        <h1 className="profile-details__user">{username}</h1>
        <h3 className="profile-details__team">{favouriteTeam}</h3>
      </div>
      <div className="profile-page__content">
        <div className="profile-page__content--top">
          <div className="profile-page__current">
            <h2 className="profile-page__current--gp">
              {currentRaceDetails.meeting_name}
            </h2>
            <h3 className="profile-page__current--circuit">
              Circuit Name: {currentRaceDetails.circuit_short_name}
            </h3>
            <h3 className="profile-page__current--location">
              {currentRaceDetails.location}, {currentRaceDetails.country_name}
            </h3>
            <h4 className="profile-page__current--time">
              Current Session Start: {nextSession}
            </h4>
          </div>
          <div className="tracker-container__standings">
            <h3 className="tracker-container__standings--profile-heading">
              Driver Standings
            </h3>
            {driverStandings.map((standing, index) => (
              <div key={index} className="standings-item">
                <p className="standings-item__position">{standing.position}</p>
                <p className="standings-item__driver">{`${standing.Driver.first_name} ${standing.Driver.last_name}`}</p>
                <p className="standings-item__points">
                  <strong>{standing.points}</strong>pts
                </p>
                <p className="standings-item__team">
                  {standing.Constructors.map(
                    (constructor) => constructor.name
                  ).join(", ")}
                </p>
              </div>
            ))}
          </div>
          <div className="tracker-container__standings">
            <h3 className="tracker-container__standings--profile-heading">
              Constructor Standings
            </h3>
            {constructorStandings.map((constructor, index) => (
              <div key={index} className="standings-item">
                <p className="standings-item__position">
                  {constructor.position}
                </p>
                <p className="standings-item__constructor">
                  {constructor.Constructor.name}
                </p>
                <p className="standings-item__total-points">
                  <strong>{constructor.points}</strong>pts
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="profile-page__content--bottom">
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
