import { Link } from "react-router-dom";

import "./SideMenu.scss";

const SideMenu = ({ isOpen, handleClose }) => {
  const closeMenu = (event) => {
    event.preventDefault();
    handleClose(event);
  };
  return (
    <div className={`side-menu ${isOpen ? "side-menu__open" : ""}`}>
      <div className="side-menu__container">
        <button className="side-menu__close" onClick={closeMenu}>
          close
        </button>
        <h5 className="side-menu__heading">Directory</h5>
        <nav className="side-menu__nav">
          <Link
            to="/race-weekend"
            className="side-menu__link"
            onClick={closeMenu}
          >
            Race Weekend
          </Link>
          <Link to="/this-year" className="side-menu__link" onClick={closeMenu}>
            This Year
          </Link>
        </nav>
        <h5 className="side-menu__heading">Account</h5>
        <div className="side-menu__auth">
          <button className="side-menu__button" onClick={closeMenu}>
            Login
          </button>
          <button className="side-menu__button" onClick={closeMenu}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
