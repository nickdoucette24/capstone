import "./NewUserForm.scss";

const NewUserForm = () => {
  return (
    <form className="register-form__wrapper">
      <div className="register-form__inputs">
        <div className="register-form__first-name"></div>
        <div className="register-form__last-name"></div>
        <div className="register-form__username"></div>
        <div className="register-form__email"></div>
        <div className="register-form__password"></div>
      </div>
      <div className="register-form__divider"></div>
      <div className="register-form__teams"></div>
    </form>
  );
};

export default NewUserForm;
