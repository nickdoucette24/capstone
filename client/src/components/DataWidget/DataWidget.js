import { useState } from "react";
import axios from "axios";
import "./DataWidget.scss";

const DataWidget = ({
  driver,
  sessionKey,
  activeSection,
  handleSectionToggle,
}) => {
  const { driver_number } = driver;
  const [pitData, setPitData] = useState([]);
  const [intervalData, setIntervalData] = useState({});
  const [carData, setCarData] = useState({});
  const [stintData, setStintData] = useState([]);

  const toggleIntervals = async () => {
    if (activeSection !== "intervals") {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/live/intervals`,
          {
            params: { session_key: sessionKey, driver_number },
          }
        );
        setIntervalData(response.data);
        handleSectionToggle("intervals");
      } catch (error) {
        console.error("Error fetching interval data:", error);
      }
    } else {
      handleSectionToggle(null);
    }
  };

  const togglePitstops = async () => {
    if (activeSection !== "pitstops") {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/live/pitstops`,
          {
            params: { session_key: sessionKey, driver_number },
          }
        );
        setPitData(response.data);
        handleSectionToggle("pitstops");
      } catch (error) {
        console.error("Error fetching pitstops data:", error);
      }
    } else {
      handleSectionToggle(null);
    }
  };

  const toggleCarData = async () => {
    if (activeSection !== "carData") {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/live/car-data`,
          {
            params: { session_key: sessionKey, driver_number },
          }
        );
        setCarData(response.data);
        handleSectionToggle("carData");
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    } else {
      handleSectionToggle(null);
    }
  };

  const toggleStintData = async () => {
    if (activeSection !== "stints") {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/live/stints`,
          {
            params: { session_key: sessionKey, driver_number },
          }
        );
        setStintData(response.data);
        handleSectionToggle("stints");
      } catch (error) {
        console.error("Error fetching stint data:", error);
      }
    } else {
      handleSectionToggle(null);
    }
  };

  const calculateTotalPitTime = (pitData) => {
    const total = pitData.reduce(
      (total, pitstop) => total + pitstop.pit_duration,
      0
    );
    return Math.ceil(total * 10) / 10;
  };

  const formatDrs = (drsValue) => {
    const drsOpenValues = [10, 12, 14];
    return drsOpenValues.includes(drsValue) ? "Open" : "Closed";
  };

  const calculateTotalTyreAge = (stint) => {
    return stint.tyre_age_at_start + (stint.lap_end - stint.lap_start);
  };

  const formatCompound = (compound) => {
    return compound === "INTERMEDIATE" ? "INTER" : compound;
  };

  return (
    <div className="data-widget">
      <div className="driver-container__tile">
        {activeSection !== "intervals" && (
          <div className="data-widget__button-container">
            <button className="data-widget__button" onClick={toggleIntervals}>
              Intervals
            </button>
          </div>
        )}
        {activeSection === "intervals" && (
          <div className="data-widget__intervals">
            <div className="data-widget__intervals--group">
              <p className="data-widget__intervals--section">
                Gap: <strong>{intervalData.interval}</strong>s
              </p>
            </div>
            <div className="data-widget__intervals--group">
              <p className="data-widget__intervals--section">
                to 1st: <strong>{intervalData.gap_to_leader}</strong>s
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="driver-container__tile">
        {activeSection !== "pitstops" && (
          <div className="data-widget__button-container">
            <button className="data-widget__button" onClick={togglePitstops}>
              Pits
            </button>
          </div>
        )}
        {activeSection === "pitstops" && pitData.length > 0 && (
          <div className="data-widget__pitstops">
            <p className="data-widget__pitstops--section">
              Laps:{" "}
              <strong>
                {pitData.map((pitstop) => pitstop.lap_number).join(", ")}
              </strong>
            </p>
            <p className="data-widget__pitstops--section">
              Pit Times:{" "}
              <strong>
                {pitData.map((pitstop) => pitstop.pit_duration).join(", ")}
              </strong>
            </p>
            <p className="data-widget__pitstops--section">
              Total Time: <strong>{calculateTotalPitTime(pitData)}</strong>s
            </p>
          </div>
        )}
      </div>
      <div className="driver-container__tile">
        {activeSection !== "carData" && (
          <div className="data-widget__button-container">
            <button className="data-widget__button" onClick={toggleCarData}>
              Cars
            </button>
          </div>
        )}
        {activeSection === "carData" && carData && (
          <div className="data-widget__carData">
            <p className="data-widget__carData--section">
              Speed: <strong>{carData.speed}</strong>
            </p>
            <p className="data-widget__carData--section">
              Gear: <strong>{carData.n_gear}</strong>
            </p>
            <p className="data-widget__carData--section">
              Throttle: <strong>{carData.throttle}</strong>
            </p>
            <p className="data-widget__carData--section">
              Brake: <strong>{carData.brake}</strong>
            </p>
            <p className="data-widget__carData--section">
              DRS: <strong>{formatDrs(carData.drs)}</strong>
            </p>
          </div>
        )}
      </div>
      <div className="driver-container__tile">
        {activeSection !== "stints" && (
          <div className="data-widget__button-container">
            <button className="data-widget__button" onClick={toggleStintData}>
              Stints
            </button>
          </div>
        )}
        {activeSection === "stints" && stintData.length > 0 && (
          <div className="data-widget__stints">
            <p className="data-widget__stints--section">
              Stints:{" "}
              <strong>
                {stintData.map((stint) => stint.stint_number).join(", ")}
              </strong>
            </p>
            <p className="data-widget__stints--section">
              Compounds:{" "}
              <strong>
                {stintData
                  .map((stint) => formatCompound(stint.compound))
                  .join(", ")}
              </strong>
            </p>
            <p className="data-widget__stints--section">
              Lap On:{" "}
              <strong>
                {stintData.map((stint) => stint.lap_start).join(", ")}
              </strong>
            </p>
            <p className="data-widget__stints--section">
              Lap Off:{" "}
              <strong>
                {stintData.map((stint) => stint.lap_end).join(", ")}
              </strong>
            </p>
            <p className="data-widget__stints--section">
              Age On:{" "}
              <strong>
                {stintData.map((stint) => stint.tyre_age_at_start).join(", ")}
              </strong>
            </p>
            <p className="data-widget__stints--section">
              Age Off:{" "}
              <strong>
                {stintData
                  .map((stint) => calculateTotalTyreAge(stint))
                  .join(", ")}
              </strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataWidget;
