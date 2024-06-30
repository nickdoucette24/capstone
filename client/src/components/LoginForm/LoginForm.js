import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormErrorMessage from "../FormErrorMessage/FormErrorMessage";
import "./LoginForm.scss";

const url = process.env.REACT_APP_SERVER_URL;

const LoginForm = ({ handleLoginModalClose, setUser }) => {
  const [formValues, setFormValues] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
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
      ...formValues,
      identifier: "",
      password: "",
    });
  };

  const validate = () => {
    let formErrors = {};

    if (!formValues.identifier)
      formErrors.identifier = "Username or Email is required.";
    if (!formValues.password) formErrors.password = "Password is required.";
    return formErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      if (formErrors.password || formErrors.identifier) {
        handleClear();
      }
      return;
    }

    const { identifier, password } = formValues;

    if (!identifier || !password) {
      setErrors({
        form: "Please enter your username/email and your password.",
      });
      return;
    }

    try {
      const loginPayload = {
        identifier: identifier,
        password: password,
      };

      const response = await axios.post(`${url}/auth/login`, loginPayload);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        const userInfo = {
          username: response.data.username,
          id: response.data.id,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
        handleLoginModalClose();
        setTimeout(() => {
          navigate(`/home/${response.data.username}/${response.data.id}`);
        }, 200);
      } else {
        setErrors({ form: response.data.message });
      }
    } catch (error) {
      setErrors({ form: "Invalid login credentials." });
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form__container">
        <label className="login-form__label" htmlFor="identifier">
          Username or Email
        </label>
        <input
          className="login-form__field"
          name="identifier"
          placeholder="Username or Email"
          onChange={handleInput}
          value={formValues.identifier}
        />
        {errors.identifier && <FormErrorMessage message={errors.identifier} />}
      </div>
      <div className="login-form__container">
        <label className="login-form__label" htmlFor="password">
          Password
        </label>
        <input
          className="login-form__field"
          name="password"
          type="password"
          placeholder="Enter your Password"
          onChange={handleInput}
          autoComplete="off"
          value={formValues.password}
        />
        {errors.password && <FormErrorMessage message={errors.password} />}
      </div>
      <button className="login-form__button" onSubmit={handleSubmit}>
        <span className="login-form__button--text">Login</span>
      </button>
    </form>
  );
};

export default LoginForm;
