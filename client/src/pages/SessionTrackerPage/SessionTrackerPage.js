import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

const SessionTrackerPage = () => {
  const [raceWeekend, setRaceWeekend] = useState([]);
  const [currentRaceDetails, setCurrentRaceDetails] = useState({});
  const [trackMap, setTrackMap] = useState(""); // Add this line
  const { meeting, session } = useParams();

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);

    const getCircuitMappings = async () => {
      try {
        const response = await axios.get(`${url}/stats/circuit-mappings`);
        sessionStorage.setItem(
          "circuitMappings",
          JSON.stringify(response.data)
        );
        return response.data;
      } catch (error) {
        console.error("Error retrieving circuits data: ", error);
        return [];
      }
    };

    const getRaceWeekend = async () => {
      try {
        const response = await axios.get(`${url}/live/current-weekend`);
        setRaceWeekend(response.data);
        sessionStorage.setItem("currentWeekend", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching race weekend data: ", error);
      }
    };

    const getCurrentRaceDetails = async () => {
      try {
        const response = await axios.get(`${url}/live/race-details`);
        const raceDetails = response.data[0];
        setCurrentRaceDetails(raceDetails);
        sessionStorage.setItem(
          "currentRaceDetails",
          JSON.stringify(raceDetails)
        );

        // Get the circuit mappings from sessionStorage or fetch if not available
        let circuitMappings = sessionStorage.getItem("circuitMappings");
        if (!circuitMappings) {
          circuitMappings = await getCircuitMappings();
        } else {
          circuitMappings = JSON.parse(circuitMappings);
        }

        if (circuitMappings) {
          // Find the corresponding track map URL
          const circuit = circuitMappings.find(
            (c) => c.circuit_key === raceDetails.circuit_key
          );
          if (circuit) {
            setTrackMap(trackImages[circuit.circuit_short_name]);
          } else {
            console.error("No matching circuit found for the circuit key");
          }
        }
      } catch (error) {
        console.error("Error fetching current race details: ", error);
      }
    };

    const storedRaceWeekend = sessionStorage.getItem("currentWeekend");
    const storedRaceDetails = sessionStorage.getItem("currentRaceDetails");

    if (storedRaceWeekend) {
      const parsedWeekend = JSON.parse(storedRaceWeekend);
      setRaceWeekend(parsedWeekend);
    } else {
      getRaceWeekend();
    }

    if (storedRaceDetails) {
      const parsedDetails = JSON.parse(storedRaceDetails);
      setCurrentRaceDetails(parsedDetails);
      const circuitMappings = JSON.parse(
        sessionStorage.getItem("circuitMappings")
      );
      if (circuitMappings) {
        const circuit = circuitMappings.find(
          (c) => c.circuit_key === parsedDetails.circuit_key
        );
        if (circuit) {
          setTrackMap(trackImages[circuit.circuit_short_name]);
        } else {
          console.error("No matching circuit found for the circuit key");
        }
      }
    } else {
      getCurrentRaceDetails();
    }
  }, []);

  return (
    <div className="session-tracker">
      <div className="tracker-container">
        <div className="tracker-container__group">
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
            {trackMap && (
              <img
                className="tracker-container__map--image"
                src={trackMap}
                alt={`${currentRaceDetails.circuit_short_name} Track Map`}
              />
            )}
          </div>
          <div className="tracker-container__track"></div>
        </div>
        <div className="tracker-container__group">
          <div className="tracker-container__order"></div>
        </div>
        <div className="tracker-container__group">
          <div className="tracker-container__weather"></div>
          <div className="tracker-container__standings"></div>
        </div>
      </div>
    </div>
  );
};

export default SessionTrackerPage;
