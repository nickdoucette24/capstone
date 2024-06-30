import { useEffect } from "react";
import LoginForm from "../LoginForm/LoginForm";
import closeIcon from "../../assets/images/icons/close-icon.svg";
import "./LoginModal.scss";

const LoginModal = ({ isLoginModalOpen, handleLoginModalClose, setUser }) => {
  const handleResize = () => {
    if (window.innerWidth > 768) {
      handleLoginModalClose();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    isLoginModalOpen && (
      <div className="login-modal">
        <div className="login-modal__wrapper">
          <div className="login-modal__content">
            <h2 className="login-modal__heading">Login</h2>
            <img
              className="login-modal__close"
              src={closeIcon}
              alt="x icon to close the modal form popout."
              onClick={handleLoginModalClose}
            />
          </div>
          <LoginForm
            handleLoginModalClose={handleLoginModalClose}
            setUser={setUser}
          />
        </div>
      </div>
    )
  );
};

export default LoginModal;
