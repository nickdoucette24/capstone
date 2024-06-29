import react from "react";
import errorIcon from "../../assets/images/icons/error-icon.svg";
import "./FormErrorMessage.scss";

const FormErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <img className="error-message__icon" src={errorIcon} />
      <p className="error-message__text">{message}</p>
    </div>
  );
};

export default FormErrorMessage;
