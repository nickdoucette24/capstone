import { useState } from "react";
import DataWidget from "../DataWidget/DataWidget";
import "./SessionOrderRow.scss";

const SessionOrderRow = ({ driver, sessionKey }) => {
  const {
    driver_number,
    full_name,
    headshot_url,
    team_name,
    country_code,
    position,
  } = driver;

  const formattedFirstName = full_name.split(" ")[0];
  const formattedLastName = full_name.split(" ")[1];

  const [activeSection, setActiveSection] = useState(null);

  const handleSectionToggle = (section) => {
    setActiveSection((prevSection) =>
      prevSection === section ? null : section
    );
  };

  return (
    <div className="driver-container">
      <div className="driver-container__section">
        <div className="driver-container__tile">
          <div className="driver-container__tile--position">{position}</div>
        </div>
        <div className="driver-container__tile-grow">
          <div className="driver-container__content">
            <div className="driver-container__data">
              <h4 className="driver-container__data--team">{team_name}</h4>
              <p className="driver-container__data--firstName">
                {formattedFirstName}
              </p>
              <h4 className="driver-container__data--lastName">
                {formattedLastName}
              </h4>
              <h4 className="driver-container__data--number">
                Car Number:{" "}
                <span className="driver-container__number--span">
                  {driver_number}
                </span>
              </h4>
            </div>
            <div className="driver-container__visuals">
              <h4 className="driver-container__visuals--nationality">
                {country_code}
              </h4>
              <img
                className="driver-container__visuals--headshot"
                src={headshot_url}
                alt="Headshot of the current driver"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="driver-container__section-data">
        <DataWidget
          driver={driver}
          sessionKey={sessionKey}
          activeSection={activeSection}
          handleSectionToggle={handleSectionToggle}
        />
      </div>
    </div>
  );
};

export default SessionOrderRow;
