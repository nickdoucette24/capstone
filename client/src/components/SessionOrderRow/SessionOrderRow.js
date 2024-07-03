import "./SessionOrderRow.scss";

const SessionOrderRow = ({ driver }) => {
  const {
    driver_number,
    full_name,
    headshot_url,
    name_acronym,
    team_name,
    country_code,
    session_key,
    meeting_key,
  } = driver;

  const formattedFirstName = full_name.split(" ")[0];
  const formattedLastName = full_name.split(" ")[1];

  return (
    <div className="driver-container">
      <div className="driver-container__tile"></div>
      <div className="driver-container__tile">
        <div className="driver-container__content">
          <div className="driver-container__data">
            <h4 className="driver-container__data--team">{team_name}</h4>
            <p className="driver-container__data--firstName">
              {formattedFirstName}
            </p>
            <h4 className="driver-container__data--lastName">
              {formattedLastName}
            </h4>
            <h4 className="driver-container__data--number">{driver_number}</h4>
          </div>
          <div className="driver-container__visuals">
            <img
              className="driver-container__visuals--flag"
              src=""
              alt="The national flag of the current driver"
            />
            <img
              className="driver-container__visuals--headshot"
              src={headshot_url}
              alt="Headshot of the current driver"
            />
          </div>
        </div>
      </div>
      <div className="driver-container__tile"></div>
      <div className="driver-container__tile"></div>
      <div className="driver-container__tile"></div>
      <div className="driver-container__tile"></div>
    </div>
  );
};

export default SessionOrderRow;
