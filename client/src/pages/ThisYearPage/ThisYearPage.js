import { useState, useEffect } from "react";
import axios from "axios";
import StandingsChart from "../../components/StandingsChart/StandingsChart";
import "./ThisYearPage.scss";

const url = process.env.REACT_APP_SERVER_URL;

const ThisYearPage = () => {
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [year, setYear] = useState("");
  const [view, setView] = useState("drivers");
  const [pastRaces, setPastRaces] = useState([]);

  useEffect(() => {
    const getDriverStandings = async () => {
      try {
        const response = await axios.get(`${url}/stats/driver-standings`);
        setYear(response.data.season);
        setDriverStandings(response.data.DriverStandings);
        getPastRaces(response.data.season);
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

    const getPastRaces = async (year) => {
      try {
        const response = await axios.get(`${url}/live/past-races`, {
          params: { year },
        });
        setPastRaces(response.data);
      } catch (error) {
        console.error("Error retrieving past races: ", error);
      }
    };

    getDriverStandings();
    getConstructorStandings();
  }, []);

  const formatDriverChartData = () => {
    const labels = driverStandings.map(
      (driver) => `${driver.Driver.first_name} ${driver.Driver.last_name}`
    );
    const data = driverStandings.map((driver) => parseInt(driver.points));

    return { labels, data };
  };

  const formatConstructorChartData = () => {
    const labels = constructorStandings.map(
      (constructor) => constructor.Constructor.name
    );
    const data = constructorStandings.map((constructor) =>
      parseInt(constructor.points)
    );

    return { labels, data };
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="this-year">
      <h1>{year} Formula 1 Season</h1>
      <div className="this-year__chart-container">
        <div className="standings-buttons">
          <button
            className="standings-buttons__driver"
            onClick={() => setView("drivers")}
          >
            Driver Standings
          </button>
          <button
            className="standings-buttons__constructor"
            onClick={() => setView("constructors")}
          >
            Constructor Standings
          </button>
        </div>
        {view === "drivers" && (
          <StandingsChart
            labels={formatDriverChartData().labels}
            data={formatDriverChartData().data}
            backgroundColor="rgba(75, 192, 192, 0.2)"
            borderColor="rgba(75, 192, 192, 1)"
            options={chartOptions}
          />
        )}
        {view === "constructors" && (
          <StandingsChart
            labels={formatConstructorChartData().labels}
            data={formatConstructorChartData().data}
            backgroundColor="rgba(153, 102, 255, 0.2)"
            borderColor="rgba(153, 102, 255, 1)"
            options={chartOptions}
          />
        )}
      </div>
      <div className="this-year__past-races">
        <h3 className="this-year__past-races--heading">Past Races</h3>
        <div className="this-year__past-races--container">
          {pastRaces.length > 0 ? (
            pastRaces.map((race) => (
              <div className="past-race" key={race.meeting_key}>
                <h4 className="past-race__heading">{race.meeting_name}</h4>
              </div>
            ))
          ) : (
            <p>No past races yet this season.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThisYearPage;
