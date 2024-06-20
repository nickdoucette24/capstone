import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Header.scss";
import SideMenu from "../SideMenu/SideMenu";
import pitstopLogo from "../../assets/images/logos/pitstop-logo.png";
import menuIcon from "../../assets/images/icons/menu-icon.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleResize = () => {
    if (window.innerWidth > 768) {
      handleClose();
    }
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <>
      <header className="header">
        <div className="header-wrapper">
          <nav className="nav-container">
            <img
              className="nav-container__logo"
              src={pitstopLogo}
              onClick={handleNavigateHome}
              alt="pistop main logo with subtext 'formula 1 live'"
            />
            <div className="nav-bar">
              <Link to={"/race-weekend"} className="nav-bar__link" href>
                Race Weekend
              </Link>
              <Link to={"/this-year"} className="nav-bar__link">
                This Year
              </Link>
            </div>
          </nav>
          <div className="auth-container">
            <button className="auth-container__button">Login</button>
            <button className="auth-container__button">Sign Up</button>
          </div>
          <img
            className="nav-container__menu"
            onClick={handleOpen}
            src={menuIcon}
            alt="mobile side menu icon with 3 horizontal bars"
          />
        </div>
      </header>
      <SideMenu isOpen={isOpen} handleClose={handleClose} />
    </>
  );
};

export default Header;
