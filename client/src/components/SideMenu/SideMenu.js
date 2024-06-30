import { Link } from "react-router-dom";
import "./SideMenu.scss";

const SideMenu = ({
  isMenuOpen,
  handleMenuClose,
  handleLoginModalOpen,
  handleScrollToRegister,
  user,
  handleNavigateToProfile,
  handleLogout,
}) => {
  return (
    <div className={`side-menu ${isMenuOpen ? "side-menu__open" : ""}`}>
      <div className="side-menu__container">
        <button className="side-menu__close" onClick={handleMenuClose}>
          close
        </button>
        <h5 className="side-menu__heading">Directory</h5>
        <nav className="side-menu__nav">
          <Link
            to={"/race-weekend"}
            className="side-menu__link"
            onClick={handleMenuClose}
          >
            Race Weekend
          </Link>
          <Link
            to={"/this-year"}
            className="side-menu__link"
            onClick={handleMenuClose}
          >
            This Year
          </Link>
        </nav>
        <h5 className="side-menu__heading">Account</h5>
        {user ? (
          <div className="side-menu__auth">
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
          <div className="side-menu__auth">
            <button
              className="side-menu__button"
              onClick={handleLoginModalOpen}
            >
              Login
            </button>
            <button
              className="side-menu__button"
              onClick={handleScrollToRegister}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideMenu;
