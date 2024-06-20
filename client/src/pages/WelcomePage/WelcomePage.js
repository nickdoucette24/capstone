import React from "react";
import { Link } from "react-router-dom";
import NewUserForm from "../../components/NewUserForm/NewUserForm";
import heroImage from "../../assets/images/photos/hero-img.png";
import "./WelcomePage.scss";

const WelcomePage = () => {
  return (
    <section className="landing-page">
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
              <h1 className="hero-container__heading">
                follow Formula 1 like never before
              </h1>
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
                    <strong className="hero-list__item--bold">LIVE</strong>
                  </li>
                  <li className="hero-list__item">
                    follow along in <strong>real time</strong> to view in-depth
                    data on each individual driver and team as the session
                    progresses
                  </li>
                  <li className="hero-list__item">
                    use the{" "}
                    <Link to={"/this-year"} className="hero-list__item--link">
                      This Year
                    </Link>{" "}
                    page to follow the current season
                  </li>
                  <li className="hero-list__item">
                    build your{" "}
                    <Link
                      to={"/profile-page/:id"}
                      className="hero-list__item--link"
                    >
                      Profile Page
                    </Link>{" "}
                    to show you the standings and stats you like
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="register-container">
          <h4 className="register-container__heading">Create an account</h4>
          <div className="register-form__container">
            <NewUserForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomePage;
