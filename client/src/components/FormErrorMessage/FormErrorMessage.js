import errorIcon from "../../assets/images/icons/error-icon.svg";
import "./FormErrorMessage.scss";

const FormErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <img
        className="error-message__icon"
        src={errorIcon}
        alt="error ! icon to signify an input field error"
      />
      <p className="error-message__text">{message}</p>
    </div>
  );
};

export default FormErrorMessage;
