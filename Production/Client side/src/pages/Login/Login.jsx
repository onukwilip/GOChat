import React, { useState, useContext } from "react";
import css from "./Login.module.css";
import facebook from "../../assets/images/icons8-facebook-512 (2).png";
import google from "../../assets/images/icons8-google-512 (1).png";
import twitter from "../../assets/images/icons8-twitter-512.png";
import { Form, FormGroup } from "../../components/Form/Form";
import { Button } from "../../components/Button/Button";
import axios from "axios";
import { General } from "../../context/GeneralContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    state: false,
    message: "",
  });
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
  const url = apiPrefix + `api/user/login`;
  const body = {
    Email: email,
    Password: password,
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
    axios
      .post(url, body, config)
      .then((res) => {
        const user = res.data;
        if (!user.Response.UserExists) {
          setErrorMessage({
            state: true,
            message: "Invalid username or password...",
          });
        } else if (!user.Response.IsAuthenticated) {
          //SEND OTP IF !USER IS AUTHENTICATED
          localStorage.setItem("emailToSendOTP", JSON.stringify(email));
          localStorage.setItem(
            "OTPConfirmType",
            JSON.stringify("Registeration")
          );
          navigate("/confirm", { replace: true });
          console.log(res.data);
        } else {
          setErrorMessage({
            state: false,
            message: "",
          });
          isOnline(user.UserID);
          localStorage.setItem("GO_Media_UserId", user.UserID);
          localStorage.setItem("GO_Media_UserName", user.UserName);
          navigate("/chat", { replace: true });
        }
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
        setErrorMessage({
          state: true,
          message: "Error connecting to the server, please try again...",
        });
      });
  };

  return (
    <>
      <section className={css.Login}>
        <div className={css["left-side"]}>
          <div className={css.header}>
            <h1>Sign in to GO Chat</h1>
          </div>
          <div className={css.icons}>
            <img src={google} alt="" />
            <img src={facebook} alt="" />
            <img src={twitter} alt="" />
          </div>
          <p className={css.optional}>or use your email account</p>
          <div className={css.container}>
            <Form onSubmit={onSubmit}>
              <FormGroup
                icon="fa fa-envelope"
                value={email}
                type="email"
                required={true}
                onChange={setEmail}
                placeholder="Email address"
              />
              <FormGroup
                icon="fa fa-lock"
                placeholder="Password"
                required={true}
                value={password}
                type="password"
                onChange={setPassword}
              />
              <Button>Sign in</Button>
              {errorMessage.state && (
                <p className="error">{errorMessage.message}</p>
              )}
              <p className={css.signUp}>
                Don't have account?{" "}
                <Link to="/register">Create account...</Link>
              </p>
            </Form>
          </div>
        </div>
        <div className={css["right-side"]}>
          <div>
            <h1 className={css.jumbo}>Hello, friend!</h1>
            <p>
              Enter your personal details and start your journey with GO Chat
              today.
            </p>
            {/* <Link to="/register" style={{ width: "100%" }}> */}
            <Button
              style={{ color: "rgb(13, 153, 235)", backgroundColor: "white" }}
              onClick={() => {
                navigate("/register", { replace: true });
              }}
            >
              Sign Up!
            </Button>
            {/* </Link> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
