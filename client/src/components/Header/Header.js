import "./Header.scss";
import pitstopLogo from "../../assets/images/logos/pitstop-logo.png";

const Header = () => {
  return (
    <header className="header">
      <div className="header-wrapper">
        <nav className="nav-container">
          <img
            className="nav-container__logo"
            src={pitstopLogo}
            alt="pistop main logo with subtext 'formula 1 live'"
          />
          <div className="nav-bar">
            <div className="nav-bar__weekend" href>
              Race Weekend
            </div>
            <div className="nav-bar__season">This Year</div>
          </div>
        </nav>
        <div className="auth-container">
          <div className="auth-container__login">Login</div>
          <div className="auth-container__signup">Sign Up</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
