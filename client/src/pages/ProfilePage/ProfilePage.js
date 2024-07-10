import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProfilePage.scss";

const url = process.env.REACT_APP_SERVER_URL;

const ProfilePage = () => {
  const [nextSession, setNextSession] = useState("");
  const [currentRaceDetails, setCurrentRaceDetails] = useState({});
  const [favouriteTeam, setFavouriteTeam] = useState("");
  const [formattedFavouriteTeam, setFormattedFavouriteTeam] = useState("");
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamColours, setTeamColours] = useState({});
  const { username, id } = useParams();

  useEffect(() => {
    const getFavouriteTeam = async (id) => {
      try {
        const response = await axios.get(`${url}/users`, {
          params: { id },
        });
        setFavouriteTeam(response.data.content);
        setFormattedFavouriteTeam(formatTeamName(response.data.content));
      } catch (error) {
        console.error("Error retrieving favourite team: ", error);
      }
    };

    const getTeamColours = async (id) => {
      try {
        const response = await axios.get(`${url}/favourite-team/${id}`);
        setTeamColours(response.data.content);
      } catch (error) {
        console.error("Error retrieving favourite team: ", error);
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
        const response = await axios.get(`${url}/stats/constructor-standings`);
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

    const getTeams = async () => {
      try {
        const response = await axios.get(`${url}/teams-count`);
        setTeams(response.data.content);
      } catch (error) {
        console.error("Error retrieving teams: ", error);
      }
    };

    getTeams();
    getTeamColours(id);
    getCurrentRaceDetails();
    getNextSessionTime();
    getDriverStandings();
    getConstructorStandings();
    getFavouriteTeam(id);
  }, [id]);

  const formatTeamName = (teamName) => {
    return teamName.toLowerCase().replace(/\s+/g, "");
  };

  const handleTeamChange = async (event) => {
    const selectedTeamName = event.target.value;
    const selectedTeam = teams.find(
      (team) => team.team_name === selectedTeamName
    );

    if (selectedTeam) {
      try {
        await axios.put(`${url}/favourite-team`, {
          user_id: id,
          team_id: selectedTeam.id,
        });

        if (selectedTeam.team_name === "Alpine") {
          setTeamColours({
            primary_color: selectedTeam.secondary_color,
            secondary_color: selectedTeam.primary_color,
            alternative_color: selectedTeam.alternative_color,
            special_color: selectedTeam.special_color,
          });
        } else if (selectedTeam.team_name === "Mercedes") {
          setTeamColours({
            primary_color: selectedTeam.secondary_color,
            secondary_color: selectedTeam.primary_color,
            alternative_color: selectedTeam.alternative_color,
            special_color: selectedTeam.special_color,
          });
        } else if (selectedTeam.team_name === "McLaren") {
          setTeamColours({
            primary_color: selectedTeam.secondary_color,
            secondary_color: selectedTeam.primary_color,
            alternative_color: selectedTeam.alternative_color,
            special_color: selectedTeam.special_color,
          });
        } else if (selectedTeam.team_name === "Aston Martin") {
          setTeamColours({
            primary_color: selectedTeam.primary_color,
            secondary_color: selectedTeam.special_color,
            alternative_color: selectedTeam.alternative_color,
            special_color: selectedTeam.secondary_color,
          });
        } else if (selectedTeam.team_name === "Red Bull") {
          setTeamColours({
            primary_color: selectedTeam.primary_color,
            secondary_color: selectedTeam.special_color,
            alternative_color: selectedTeam.secondary_color,
            special_color: selectedTeam.alternative_color,
          });
        } else if (selectedTeam.team_name === "RB") {
          setTeamColours({
            primary_color: selectedTeam.primary_color,
            secondary_color: selectedTeam.special_color,
            alternative_color: selectedTeam.secondary_color,
            special_color: selectedTeam.alternative_color,
          });
        } else {
          setTeamColours({
            primary_color: selectedTeam.primary_color,
            secondary_color: selectedTeam.secondary_color,
            alternative_color: selectedTeam.alternative_color,
            special_color: selectedTeam.special_color,
          });
        }

        setFavouriteTeam(selectedTeam.team_name);
        setFormattedFavouriteTeam(formatTeamName(selectedTeam.team_name));
      } catch (error) {
        console.error("Error updating favourite team: ", error);
      }
    }
  };

  const sortedTeams = [
    ...teams.filter((team) => team.team_name !== favouriteTeam),
  ];

  return (
    <div
      className="profile-page"
      style={{ backgroundColor: teamColours.primary_color }}
    >
      <div className="profile-details">
        <div className={`profile-details__${formattedFavouriteTeam}`}></div>
        <div className="profile-details__info">
          <span className="profile-details__heading">Profile</span>
          <div className="profile-details__content">
            <h1 className="profile-details__content--user">{username}</h1>
            <select
              className="profile-details__content--team"
              style={{
                backgroundColor: teamColours.primary_color,
                color: teamColours.secondary_color,
                borderColor: teamColours.secondary_color,
              }}
              value={favouriteTeam}
              onChange={handleTeamChange}
            >
              <option key="favourite" value={favouriteTeam}>
                {favouriteTeam}
              </option>
              {sortedTeams.map((team) => (
                <option key={team.id} value={team.team_name}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>
        </div>
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
      </div>
      <div className="profile-page__content-one">
        <div className="profile-page__content--top">
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
        </div>
      </div>
      <div className="profile-page__content-two">
        <div className="profile-page__content--top">
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
      </div>
    </div>
  );
};

export default ProfilePage;
