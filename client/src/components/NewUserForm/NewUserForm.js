import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import FormErrorMessage from "../FormErrorMessage/FormErrorMessage";

import "./NewUserForm.scss";

const url = process.env.SERVER_BASE_URL;

const NewUserForm = () => {
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    team_id: "",
  });
  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleClear = () => {
    setFormValues({
      password: "",
      confirm_password: "",
    });
    setErrors({});
  };

  const validate = () => {
    let formErrors = {};

    if (!formValues.username) formErrors.first_name = "Username is required.";
    if (!formValues.first_name)
      formErrors.first_name = "First Name is required.";
    if (!formValues.last_name) formErrors.last_name = "Last Name is required.";
    if (!formValues.email) formErrors.email = "Email is required.";
    if (!formValues.password) formErrors.password = "Password is required.";
    if (!formValues.confirm_password)
      formErrors.confirm_password = "Please confirm your password.";
    if (formValues.password !== formValues.confirm_password)
      formErrors.no_match = "Passwords do not match!";
    return formErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validate();
    setErrors(formErrors);

    const password = formValues.password;
    const confirmedPassword = formValues.confirm_password;

    if (password !== confirmedPassword) {
      handleClear();
      return;
    }

    const registrationPayload = {
      username: formValues.username,
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      email: formValues.email,
      password: formValues.password,
      team_id: formValues.team_id,
    };

    try {
      const response = await axios.post(
        `${url}/auth/register`,
        registrationPayload
      );

      if (response.data.success) {
        const { username, id, token } = response.data;
        localStorage.setItem("token", token);
        navigate(`/home/${username}/${id}`);
      } else {
        setErrors({ form: response.data.message });
      }
    } catch (error) {
      console.error("Error Registering User: ", error);
    }
  };

  return (
    <form className="register-form__wrapper" onSubmit={handleSubmit}>
      <div className="register-form__inputs">
        <div className="register-form__inputs--group">
          <div className="register-form__container">
            <label className="register-form__label" htmlFor="username">
              Username
            </label>
            <input
              className="register-form__field"
              name="username"
              placeholder="Choose a Username"
              onChange={handleInput}
              value={formValues.username}
            />
            {errors.username && <FormErrorMessage message={errors.username} />}
          </div>
          <div className="register-form__container">
            <label className="register-form__label" htmlFor="first_name">
              First Name
            </label>
            <input
              className="register-form__field"
              name="first_name"
              placeholder="Enter your First Name"
              onChange={handleInput}
              value={formValues.first_name}
            />
            {errors.first_name && (
              <FormErrorMessage message={errors.first_name} />
            )}
          </div>
          <div className="register-form__container">
            <label className="register-form__label" htmlFor="last_name">
              Last Name
            </label>
            <input
              className="register-form__field"
              name="last_name"
              placeholder="Enter your Last Name"
              onChange={handleInput}
              value={formValues.last_name}
            />
            {errors.last_name && (
              <FormErrorMessage message={errors.last_name} />
            )}
          </div>
        </div>
        <div className="register-form__inputs--group">
          <div className="register-form__container">
            <label className="register-form__label" htmlFor="email">
              Email
            </label>
            <input
              className="register-form__field"
              name="email"
              placeholder="Enter your Email"
              onChange={handleInput}
              value={formValues.email}
            />
            {errors.email && <FormErrorMessage message={errors.email} />}
          </div>
          <div className="register-form__container">
            <label className="register-form__label" htmlFor="password">
              Password
            </label>
            <input
              className="register-form__field"
              name="password"
              placeholder="Enter your Password"
              onChange={handleInput}
              value={formValues.password}
            />
            {errors.password && <FormErrorMessage message={errors.password} />}
          </div>
          <div className="register-form__container">
            <label className="register-form__label" htmlFor="confirm_password">
              Confirm Password
            </label>
            <input
              className="register-form__field"
              name="confirm_password"
              placeholder="Confirm your Password"
              onChange={handleInput}
              value={formValues.confirm_password}
            />
            {errors.confirm_password && (
              <FormErrorMessage message={errors.confirm_password} />
            )}
            {errors.no_match && <FormErrorMessage message={errors.no_match} />}
          </div>
        </div>
      </div>
      <hr className="register-form__divider" />
      <div className="register-form__teams">
        <div className="register-form__teams--group">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="register-form__teams--group">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </form>
  );
};

export default NewUserForm;
