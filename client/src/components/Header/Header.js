import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SideMenu from "../SideMenu/SideMenu";
import LoginModal from "../LoginModal/LoginModal";
import pitstopLogo from "../../assets/images/logos/pitstop-logo.png";
import menuIcon from "../../assets/images/icons/menu-icon.svg";
import "./Header.scss";

const Header = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleResize = () => {
    if (window.innerWidth > 768) {
      handleMenuClose();
      handleLoginModalClose();
    }
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleNavigateToProfile = () => {
    if (user) {
      handleMenuClose();
      navigate(`/home/${user.username}/${user.id}`);
    }
  };

  const handleLogout = (event) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    setUser(null);
    window.location.reload();
  };

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleScrollToRegister = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToRegister: true } });
    } else {
      const registerContainer = document.querySelector(".register-container");
      if (registerContainer) {
        const offset =
          registerContainer.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }

    handleMenuClose();
    handleLoginModalClose();
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
              <Link to={"/race-weekend"} className="nav-bar__link">
                Race Weekend
              </Link>
              <Link to={"/this-year"} className="nav-bar__link">
                This Year
              </Link>
            </div>
          </nav>
          {user ? (
            <div className="home-container">
              <button
                className="home-container__button"
                onClick={handleNavigateToProfile}
              >
                Home
              </button>
              <button
                className="home-container__button"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-container">
              <button
                className="auth-container__button"
                onClick={handleLoginModalOpen}
              >
                Login
              </button>
              <button
                className="auth-container__button"
                onClick={handleScrollToRegister}
              >
                Sign Up
              </button>
            </div>
          )}
          <img
            className="nav-container__menu"
            onClick={handleMenuOpen}
            src={menuIcon}
            alt="mobile side menu icon with 3 horizontal bars"
          />
        </div>
      </header>
      <SideMenu
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
        handleLoginModalOpen={handleLoginModalOpen}
        handleLoginModalClose={handleLoginModalClose}
        isLoginModalOpen={isLoginModalOpen}
        handleScrollToRegister={handleScrollToRegister}
        user={user}
        handleLogout={handleLogout}
        handleNavigateToProfile={handleNavigateToProfile}
      />
      <LoginModal
        isLoginModalOpen={isLoginModalOpen}
        handleMenuClose={handleMenuClose}
        handleLoginModalClose={handleLoginModalClose}
        setUser={setUser}
      />
    </>
  );
};

export default Header;
