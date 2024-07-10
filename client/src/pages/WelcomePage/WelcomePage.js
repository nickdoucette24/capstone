import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import heroImage from "../../assets/images/photos/example-tracker.png";
import "./WelcomePage.scss";

const url = process.env.REACT_APP_SERVER_URL;

const WelcomePage = ({ setUser }) => {
  const [teamsCount, setTeamsCount] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);

    // Scroll to the create an account section
    if (location.state && location.state.scrollToRegister) {
      const registerContainer = document.querySelector(".register-container");
      if (registerContainer) {
        const offset =
          registerContainer.getBoundingClientRect().top + window.scrollY - 96; // 5rem = 80px
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }

    const getTeams = async () => {
      try {
        const response = await axios.get(`${url}/teams-count`);
        const countData = response.data.content;
        const sortedCountData = countData.sort(
          (a, b) => b.user_count - a.user_count
        );
        setTeamsCount(sortedCountData);
      } catch (error) {
        console.error("Error retrieving teams: ", error);
      }
    };

    getTeams();
  }, [location]);

  return (
    <section className="landing-page">
      <div className="heading-container">
        <h1 className="heading-container__title--top">
          enhance your race experience
        </h1>
        <div className="heading-container__image--mobile"></div>
        <div className="heading-container__image--tablet1"></div>
        <div className="heading-container__image--tablet2"></div>
      </div>
      <div className="landing-page__container">
        <div className="hero-wrapper">
          <div className="hero-container">
            <div className="image-container">
              <div className="image-container__wrapper">
                <h3 className="image-container__heading">
                  Live Session Tracker
                </h3>
                <img
                  className="hero-container__image"
                  src={heroImage}
                  alt="example of the live race tracker"
                />
              </div>
            </div>
            <div className="hero-container__description">
              <div className="heading-container">
                <h1 className="heading-container__title--middle">
                  enhance your race experience
                </h1>
              </div>
              <div className="content-container">
                <h3 className="hero-list__heading">What to do</h3>
                <ul className="hero-list">
                  <li className="hero-list__item">
                    use the{" "}
                    <Link
                      to={"/race-weekend"}
                      className="hero-list__item--link"
                    >
                      Race Weekend
                    </Link>{" "}
                    page to follow every session{" "}
                    <strong className="hero-list__item--bold">LIVE</strong> as
                    it progresses
                  </li>
                  <li className="hero-list__item">
                    view detailed data on the drivers and cars which is
                    unavailable through streaming
                  </li>
                  <li className="hero-list__item">
                    use the{" "}
                    <Link to={"/this-year"} className="hero-list__item--link">
                      This Year
                    </Link>{" "}
                    page to check up on the current season and championship
                    battles
                  </li>
                  <li className="hero-list__item">
                    customize your{" "}
                    <Link
                      to={"/profile-page/:id"}
                      className="hero-list__item--link"
                    >
                      Profile Page
                    </Link>{" "}
                    to show you specific standings and stats
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="heading-container__image--desktop"></div>
        </div>
        <div className="register-container">
          <h4 className="register-container__heading">Create an account</h4>
          <div className="register-form__section">
            <RegisterForm setUser={setUser} />
          </div>
        </div>
        <div className="team-counter">
          <div className="team-counter__card">
            <h3 className="team-counter__heading">Total Support</h3>
            <div className="team-counter__wrapper">
              {teamsCount.length > 0 ? (
                teamsCount.map((team) => (
                  <div
                    className="team-counter__container"
                    key={team.id}
                    style={{
                      backgroundColor: team.primary_color,
                      borderColor: team.secondary_color,
                    }}
                  >
                    <div
                      className="team-counter__container--count"
                      style={{
                        color: team.alternative_color,
                        backgroundColor: team.primary_color,
                      }}
                    >
                      {team.user_count}
                    </div>
                    <div
                      className="team-counter__container--team"
                      style={{
                        color: team.primary_color,
                        backgroundColor: team.special_color,
                      }}
                    >
                      {team.team_name}
                    </div>
                  </div>
                ))
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomePage;
