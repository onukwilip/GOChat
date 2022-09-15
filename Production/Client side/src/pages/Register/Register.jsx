import React, { useState, useContext } from "react";
import css from "./Register.module.css";
import facebook from "../../assets/images/icons8-facebook-512 (2).png";
import google from "../../assets/images/icons8-google-512 (1).png";
import twitter from "../../assets/images/icons8-twitter-512.png";
import { Form, FormGroup } from "../../components/Form/Form";
import { Button } from "../../components/Button/Button";
import axios from "axios";
import { General } from "../../context/GeneralContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [error, setError] = useState("");
  const general = useContext(General);
  const navigate = useNavigate();
  const apiPrefix = general.domain;
  const config = {
    headers: {
      ...general.config.headers,
      Accept: "application/json",
      "Content-Type": "application/json; charset=UTF-8",
    },
  };
  const url = apiPrefix + `api/user/register`;
  const body = {
    UserName: username,
    Email: email,
    Password: password,
    Phone: phone,
  };

  const isOnline = (userId) => {
    const url = apiPrefix + `api/user/isOnline`;
    const body = {
      UserID: userId ? userId : "undefined",
      isOnline: true,
    };
    axios
      .put(url, body, config)
      .then((res) => {
        console.log("Is Online", res.data);
      })
      .catch((e) => {
        console.log("Error", e);
      });
  };

  const onSubmit = (e) => {
    if (username && email && password.length >= 6 && confirm === password) {
      axios
        .post(url, body, config)
        .then((res) => {
          const user = res.data;
          if (user) {
            console.log("User added successfully", res.data);
            localStorage.setItem("emailToSendOTP", JSON.stringify(email));
            localStorage.setItem(
              "OTPConfirmType",
              JSON.stringify("Registeration")
            );
            //general.setEmailToSendOTP(email);
            //general.setOTPConfirmType("Registeration");
            setError("");
            setErrorMessage(false);
            setEmail("");
            setPassword("");
            setUsername("");
            setConfirm("");
            setPhone("");
            navigate("/confirm", { replace: true });
          } else {
            setError(`User with email ${email} already exists...`);
            setErrorMessage(true);
          }
        })
        .catch((e) => {
          console.log(e);
          setErrorMessage(true);
          setError("Error connecting to the server please try again...");
        });
    } else {
      if (password.length < 6) {
        setError("Password must contain more than 6 characters...");
      } else if (confirm !== password) {
        setError("Confirm password and password must match");
      }
      setErrorMessage(true);
    }
  };

  return (
    <>
      <section className={css.Login}>
        <div className={css["left-side"]}>
          <div className={css.header}>
            <h1>Register with GO Chat</h1>
          </div>
          <div className={css.icons}>
            <img src={google} alt="" />
            <img src={facebook} alt="" />
            <img src={twitter} alt="" />
          </div>
          <p className={css.optional}>or use your email account</p>
          <Form onSubmit={onSubmit}>
            <div className={css["double-input"]}>
              <div>
                <FormGroup
                  icon="fa fa-user"
                  value={username}
                  type="text"
                  required={true}
                  onChange={setUsername}
                  placeholder="Username"
                />
              </div>
              <div>
                <FormGroup
                  icon="fa fa-envelope"
                  value={email}
                  type="email"
                  required={true}
                  onChange={setEmail}
                  placeholder="Email address"
                />
              </div>
            </div>
            <FormGroup
              icon="fa fa-lock"
              placeholder="Password"
              required={true}
              value={password}
              type="password"
              onChange={setPassword}
            />
            <FormGroup
              icon="fa fa-lock"
              placeholder="Confirm password"
              required={true}
              value={confirm}
              type="password"
              onChange={setConfirm}
            />
            <FormGroup
              icon="fa fa-phone"
              placeholder="Phone number"
              required={true}
              value={phone}
              type="tel"
              onChange={setPhone}
            />
            <Button>Sign up</Button>
            {errorMessage && <p className="error">{error}</p>}
            <p className={css.signUp}>
              Already have an account? <Link to="/login">Login...</Link>
            </p>
          </Form>
        </div>
        <div className={css["right-side"]}>
          <div>
            <h1 className={css.jumbo}>Welcome Back!</h1>
            <div className={css.details}>
              <p>
                To keep connected with your friends please login with your
                personal info.
              </p>
              <Link to="/login">
                <Button
                  style={{
                    color: "rgb(13, 153, 235)",
                    backgroundColor: "white",
                  }}
                >
                  Sign In!
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
