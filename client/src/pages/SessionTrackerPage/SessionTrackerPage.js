import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SessionOrderRow from "../../components/SessionOrderRow/SessionOrderRow";
import australia from "../../assets/images/photos/australia.png";
import bahrain from "../../assets/images/photos/bahrain.png";
import jeddah from "../../assets/images/photos/jeddah.png";
import imola from "../../assets/images/photos/imola.png";
import monza from "../../assets/images/photos/monza.png";
import abu_dhabi from "../../assets/images/photos/abu_dhabi.png";
import austria from "../../assets/images/photos/austria.png";
import baku from "../../assets/images/photos/baku.png";
import brazil from "../../assets/images/photos/brazil.png";
import canada from "../../assets/images/photos/canada.png";
import cota from "../../assets/images/photos/cota.png";
import las_vegas from "../../assets/images/photos/las_vegas.png";
import qatar from "../../assets/images/photos/qatar.png";
import hungary from "../../assets/images/photos/hungary.png";
import mexico from "../../assets/images/photos/mexico.png";
import miami from "../../assets/images/photos/miami.png";
import silverstone from "../../assets/images/photos/silverstone.png";
import singapore from "../../assets/images/photos/singapore.png";
import spa from "../../assets/images/photos/spa.png";
import spain from "../../assets/images/photos/spain.png";
import zandvoort from "../../assets/images/photos/zandvoort.png";
import china from "../../assets/images/photos/china.png";
import monaco from "../../assets/images/photos/monaco.png";
import suzuka from "../../assets/images/photos/suzuka.png";
import axios from "axios";
import "./SessionTrackerPage.scss";

const url = process.env.REACT_APP_SERVER_URL;

const trackImages = {
  Melbourne: australia,
  Sakhir: bahrain,
  Jeddah: jeddah,
  Imola: imola,
  Monza: monza,
  "Yas Marina Circuit": abu_dhabi,
  Spielberg: austria,
  Baku: baku,
  Interlagos: brazil,
  Montreal: canada,
  Austin: cota,
  "Las Vegas": las_vegas,
  Lusail: qatar,
  Hungaroring: hungary,
  "Mexico City": mexico,
  Miami: miami,
  Silverstone: silverstone,
  Singapore: singapore,
  "Spa-Francorchamps": spa,
  Catalunya: spain,
  Zandvoort: zandvoort,
  Shanghai: china,
  "Monte Carlo": monaco,
  Suzuka: suzuka,
};

const formatDistance = (distance) => {
  if (!distance) return "";
  return distance.replace(/kms?$/i, "km");
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const SessionTrackerPage = () => {
  const [currentRaceDetails, setCurrentRaceDetails] = useState({});
  const [trackMap, setTrackMap] = useState("");
  const [trackDetails, setTrackDetails] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [showStandings, setShowStandings] = useState("driver");
  const [loading, setLoading] = useState(true);
  const { session: sessionKey } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);

    const getCircuitMappings = async () => {
      try {
        const response = await axios.get(`${url}/stats/circuit-mappings`);
        return response.data;
      } catch (error) {
        console.error("Error retrieving circuits data: ", error);
        return [];
      }
    };

    const getWeatherData = async (session_key) => {
      try {
        const response = await axios.get(`${url}/live/weather`, {
          params: { session_key },
        });
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error retrieving weather data: ", error);
      }
    };

    const getTrackMapAndDetails = async (track_id) => {
      try {
        const response = await axios.get(`${url}/stats/track-maps`, {
          params: { track_id },
        });
        setTrackDetails(response.data[0]);
      } catch (error) {
        console.error("Error retrieving track map: ", error);
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

        const circuitMappings = await getCircuitMappings();
        if (circuitMappings) {
          const circuit = circuitMappings.find(
            (c) => c.circuit_key === raceDetails.circuit_key
          );
          if (circuit) {
            setTrackMap(trackImages[circuit.circuit_short_name]);
            getTrackMapAndDetails(circuit.id);
            getWeatherData(sessionKey);
            // const interval = setInterval(() => {
            //   getWeatherData(sessionKey);
            // }, 65000);

            // return () => clearInterval(interval);
          } else {
            console.error("No matching circuit found for the circuit key");
          }
        }
      } catch (error) {
        console.error("Error retrieving current race details: ", error);
      }
    };

    const getDriverDetails = async () => {
      try {
        const response = await axios.get(`${url}/live/drivers`);
        const driverDetails = response.data;

        const driverPositions = [];
        for (const driver of driverDetails) {
          const driver_number = driver.driver_number;
          const [positionResponse] = await Promise.all([
            axios.get(`${url}/live/positions`, {
              params: { session_key: sessionKey, driver_number },
            }),
          ]);

          driverPositions.push({
            ...driver,
            position: positionResponse.data.position,
          });

          // Throttle requests
          // await new Promise((resolve) => setTimeout(resolve, 200));
        }

        setDrivers(driverPositions);
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving driver details: ", error);
        setLoading(false);
      }
    };

    getDriverDetails();
    getCurrentRaceDetails();
    getDriverStandings();
    getConstructorStandings();
  }, [sessionKey]);

  const renderStandings = () => {
    if (showStandings === "driver") {
      return (
        <div className="standings-list">
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
      );
    } else {
      return (
        <div className="standings-list">
          {constructorStandings.map((constructor, index) => (
            <div key={index} className="standings-item">
              <p className="standings-item__position">{constructor.position}</p>
              <p className="standings-item__constructor">
                {constructor.Constructor.name}
              </p>
              <p className="standings-item__total-points">
                <strong>{constructor.points}</strong>pts
              </p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="session-tracker">
      <div className="tracker-container">
        <div className="tracker-container__group-one">
          <div className="tracker-container__race">
            <h2 className="tracker-container__race--name">
              {currentRaceDetails.meeting_name}
            </h2>
            <h5 className="tracker-container__race--fullname">
              {currentRaceDetails.meeting_official_name}
            </h5>{" "}
            <h5 className="tracker-container__race--location">
              {currentRaceDetails.location}, {currentRaceDetails.country_name}
            </h5>
          </div>
          <div className="tracker-container__map">
            <h2 className="tracker-container__map--heading">
              {currentRaceDetails.circuit_short_name}
            </h2>
            <img
              className="tracker-container__map--image"
              src={trackMap}
              alt={`${currentRaceDetails.circuit_short_name} Track Map`}
            />
          </div>
          <div className="tracker-container__track">
            <h3 className="tracker-container__track--title">Track Details</h3>
            <div>
              <p className="tracker-container__track--stat">
                Track Name:{" "}
                <strong className="tracker-container__track--data">
                  {trackDetails.name}
                </strong>
              </p>
              <p className="tracker-container__track--stat">
                Laps:{" "}
                <strong className="tracker-container__track--data">
                  {trackDetails.laps}
                </strong>
              </p>
              <p className="tracker-container__track--stat">
                Track Length:{" "}
                <strong className="tracker-container__track--data">
                  {formatDistance(trackDetails.length)}
                </strong>
              </p>
              <p className="tracker-container__track--stat">
                Race Distance:{" "}
                <strong className="tracker-container__track--data">
                  {formatDistance(trackDetails.race_distance)}
                </strong>
              </p>
              <p className="tracker-container__track--stat">
                First Grand Prix:{" "}
                <strong className="tracker-container__track--data">
                  {trackDetails.first_grand_prix}
                </strong>
              </p>
              <p className="tracker-container__track--stat">
                <strong className="tracker-container__track--live">LIVE</strong>{" "}
                Track Temperature:{" "}
                <strong className="tracker-container__track--data">
                  {weatherData.track_temperature}°C
                </strong>{" "}
                (as of {formatDate(weatherData.date)})
              </p>
            </div>
          </div>
        </div>
        <div className="tracker-container__group-two">
          <div className="tracker-container__order">
            <h3 className="tracker-container__order--heading">
              Order on Track
            </h3>
            {loading ? (
              <div>Loading...</div>
            ) : (
              drivers.length > 0 &&
              drivers
                .sort((a, b) => a.position - b.position)
                .map((driver) => (
                  <div className="driver-tile" key={driver.driver_number}>
                    <SessionOrderRow driver={driver} sessionKey={sessionKey} />
                  </div>
                ))
            )}
          </div>
        </div>
        <div className="tracker-container__group-three">
          <div className="tracker-container__weather">
            <h3 className="tracker-container__weather--heading">Weather</h3>
            <div className="tracker-container__weather--content">
              <div className="tracker-container__weather--group">
                <p className="tracker-container__weather--stat">
                  Air Temp:{" "}
                  <strong>{`${weatherData.air_temperature}°C`}</strong>
                </p>
                <p className="tracker-container__weather--stat">
                  Wind Direction:{" "}
                  <strong>{`${weatherData.wind_direction}`}</strong>
                </p>
                <p className="tracker-container__weather--stat">
                  Wind Speed: <strong>{`${weatherData.wind_speed}m/s`}</strong>
                </p>
              </div>
              <div className="tracker-container__weather--group">
                <p className="tracker-container__weather--stat">
                  Humidity: <strong>{`${weatherData.humidity}%`}</strong>
                </p>
                <p className="tracker-container__weather--stat">
                  Rainfall: <strong>{`${weatherData.rainfall}`}</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="tracker-container__standings">
            <h3 className="tracker-container__standings--heading">Standings</h3>
            <div className="tracker-standings__buttons">
              <button
                className={`tracker-standings__buttons--driver ${
                  showStandings === "driver" ? "active" : ""
                }`}
                onClick={() => setShowStandings("driver")}
              >
                Driver
              </button>
              <button
                className={`tracker-standings__buttons--constructor ${
                  showStandings === "constructor" ? "active" : ""
                }`}
                onClick={() => setShowStandings("constructor")}
              >
                Constructor
              </button>
            </div>
            {renderStandings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTrackerPage;
