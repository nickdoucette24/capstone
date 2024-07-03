import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import heroImage from "../../assets/images/photos/hero-img.png";
import alonso_1 from "../../assets/images/photos/alonso_1.png";
import "./WelcomePage.scss";

const WelcomePage = ({ setUser }) => {
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
  }, [location]);

  return (
    <section className="landing-page">
      <div className="heading-container">
        <h1 className="hero-container__heading--top">
          enhance your race experience
        </h1>
        <img
          className="hero-container__heading--topimage"
          src={alonso_1}
          alt="opaque still of Fernando Alonso celebrating."
        />
      </div>
      <div className="landing-page__container">
        <div className="hero-wrapper">
          <div className="hero-container">
            <div className="image-container">
              <img
                className="hero-container__image"
                src={heroImage}
                alt="example of the live race tracker"
              />
            </div>
            <div className="hero-container__description">
              <div className="heading-container">
                <h1 className="hero-container__heading--middle">
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
        </div>
        <div className="register-container">
          <h4 className="register-container__heading">Create an account</h4>
          <div className="register-form__section">
            <RegisterForm setUser={setUser} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomePage;
