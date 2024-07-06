import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import FormErrorMessage from "../FormErrorMessage/FormErrorMessage";

import "./RegisterForm.scss";

const url = process.env.REACT_APP_SERVER_URL;

const RegisterForm = ({ setUser }) => {
  const [errors, setErrors] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("");
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
      ...formValues,
      password: "",
      confirm_password: "",
    });
  };

  const validate = () => {
    let formErrors = {};

    if (!formValues.username) formErrors.username = "Username is required.";
    if (!formValues.first_name)
      formErrors.first_name = "First Name is required.";
    if (!formValues.last_name) formErrors.last_name = "Last Name is required.";
    if (!formValues.email) formErrors.email = "Email is required.";
    if (!formValues.password) formErrors.password = "Password is required.";
    if (!formValues.confirm_password)
      formErrors.confirm_password = "Please confirm your password.";
    if (formValues.password !== formValues.confirm_password)
      formErrors.no_match = "Passwords do not match!";
    if (!formValues.team_id)
      formErrors.team_id = "Please select a team to join.";
    return formErrors;
  };

  const handleTeamSelect = (teamId) => {
    setSelectedTeam(teamId);
    setFormValues({
      ...formValues,
      team_id: teamId,
    });
    setErrors({
      ...errors,
      team_id: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      if (formErrors.no_match) {
        handleClear();
      }
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
        const { token } = response.data;
        localStorage.setItem("token", token);
        const userInfo = {
          username: response.data.username,
          id: response.data.id,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
        setTimeout(() => {
          navigate(`/home/${response.data.username}/${response.data.id}`);
        }, 200);
      } else {
        setErrors({ form: response.data.message });
      }
    } catch (error) {
      console.error("Error Registering User: ", error);
    }
    //   if (response.data.success) {
    //     localStorage.setItem("token", response.data.token);
    //     const userInfo = {
    //       username: response.data.username,
    //       id: response.data.id,
    //     };
    //     localStorage.setItem("user", JSON.stringify(userInfo));
    //     setUser(userInfo);
    //     handleLoginModalClose();
    //     setTimeout(() => {
    //       navigate(`/home/${response.data.username}/${response.data.id}`);
    //     }, 200);
    //   } else {
    //     setErrors({ form: response.data.message });
    //   }
    // } catch (error) {
    //   setErrors({ form: "Invalid login credentials." });
    // }
  };

  const teamList = [
    { name: "alpine", id: "1" },
    { name: "astonmartin", id: "2" },
    { name: "ferrari", id: "3" },
    { name: "haas", id: "4" },
    { name: "kicksauber", id: "5" },
    { name: "mclaren", id: "6" },
    { name: "mercedes", id: "7" },
    { name: "vcarb", id: "8" },
    { name: "redbull", id: "9" },
    { name: "williams", id: "10" },
  ];

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
              placeholder="First Name"
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
              placeholder="Last Name"
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
              type="email"
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
              type="password"
              autoComplete="off"
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
              type="password"
              autoComplete="off"
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
        <h2 className="register-form__teams--heading">Choose a team</h2>
        <div className="register-form__teams--group">
          {teamList.slice(0, 5).map((team) => (
            <div
              key={team.id}
              className={`team-container team-container__${team.name.replace(
                " ",
                ""
              )} ${selectedTeam === team.id ? "selected" : ""}`}
              onClick={() => handleTeamSelect(team.id)}
            ></div>
          ))}
        </div>
        <div className="register-form__teams--group">
          {teamList.slice(5).map((team) => (
            <div
              key={team.id}
              className={`team-container team-container__${team.name.replace(
                " ",
                ""
              )} ${selectedTeam === team.id ? "selected" : ""}`}
              onClick={() => handleTeamSelect(team.id)}
            ></div>
          ))}
        </div>
        {errors.team_id && <FormErrorMessage message={errors.team_id} />}
        <button className="register-form__button" onSubmit={handleSubmit}>
          <span className="register-form__button--text">Start</span>
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
