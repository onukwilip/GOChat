import React, { useContext, useEffect, useState } from "react";
import css from "./ConfirmOTP.module.css";
import { Form, FormGroup } from "../../components/Form/Form";
import { Button } from "../../components/Button/Button";
import { General } from "../../context/GeneralContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmOTP = () => {
  const general = useContext(General);
  const [OTP, setOTP] = useState("");
  const [otpTimeOut, setOtpTimeOut] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [invalidOTP, setInvalidOTP] = useState(false);
  const [OTPDetails, setOTPDetails] = useState(
    JSON.parse(sessionStorage.getItem("OTP"))
  );
  const apiPrefix = general.domain;
  const url = apiPrefix + `api/user/`;
  const config = general.config;
  const navigate = useNavigate();

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

  const getUserByEmail = () => {
    const _url = url + `getUserByEmail`;
    const body = {
      Email: OTPDetails?.email,
    };

    axios
      .post(_url, body, config)
      .then((res) => {
        const user = res.data;

        user.map((each) => {
          isOnline(each.UserID);
          localStorage.setItem("UserId", each.UserID);
        });
      })
      .catch((e) => {});
  };

  const clear = () => {
    const _url = url + `eraseOTP`;
    const body = {
      Email: OTPDetails?.email,
    };

    axios
      .put(_url, body, config)
      .then((res) => {
        console.log("OTP has been cleared...", res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const validateOTP = () => {
    const _url = url + `confirmOTP`;
    const body = {
      Email: OTPDetails?.email,
      OTP: OTP,
    };

    axios
      .put(_url, body, config)
      .then((res) => {
        if (res.data) {
          setInvalidOTP(false);
          clear();
          getUserByEmail();
          //IF THE OTP TYPE IS EQUAL TO 'LOGIN'
          if (OTPDetails.type === "login") {
            //Get user IP address and log it into the database
            getUserIPAddress(OTPDetails?.email);
            sessionStorage.removeItem("OTP");
            navigate("/chat", { replace: true });
          }
          //IF IT'S EQUAL TO PASSWORD
          else {
          }
        } else {
          setInvalidOTP(true);
        }
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const sendOTP = () => {
    setDisabled(true);

    const _url = url + `updateOTP`;
    const body = {
      Email: OTPDetails?.email === null ? email : OTPDetails?.email,
    };

    axios
      .put(_url, body, config)
      .then((res) => {
        if (res.data) {
          //IF OTP WAS SUCCESSFULLY SENT DISABLE RESEND AND SET TIMEOUT
          console.log("OTP sent successfully...");
          console.log("Send OTP", res.data);
        } else {
          console.log("An error occurred...");
        }
      })
      .catch((e) => {
        console.log(e);
      });

    if (OTPDetails?.type === "login") {
      if (OTPDetails?.email === "" || OTPDetails?.email === null) {
        navigate("/login", { replace: true });
      }
    } else {
    }

    setTimeout(() => {
      timeOut();
    }, 30000);
  };

  const timeOut = () => {
    setDisabled(false);
  };

  const logUserIPAddress = (userID, body) => {
    const _url = url + `IPAddress`;
    const _body = {
      ...body,
      City: body.city === null ? "" : body.city,
      State: body.state === null ? "" : body.state,
      Latitude: body.latitude === null ? 0 : body.latitude,
      Longitude: body.longitude === null ? 0 : body.longitude,
      UserID: userID,
    };
    axios
      .post(_url, _body, config)
      .then((res) => {
        console.log(res.data);
      })
      .catch();
    console.log(body);
  };

  const getUserID = (_body) => {
    const _url = url + `getUserByEmail`;
    const body = {
      Email: OTPDetails?.email,
    };

    axios
      .post(_url, body, config)
      .then((res) => {
        const user = res.data;
        user.map((each) => {
          logUserIPAddress(each.UserID, _body);
        });
      })
      .catch((e) => {});
  };

  const getUserIPAddress = (email) => {
    const ipUrl = "https://geolocation-db.com/json/";
    axios
      .get(ipUrl)
      .then((res) => {
        //Call my API to log user IP address
        getUserID(res.data);
      })
      .catch((e) => {});
  };

  const reDirect = () => {
    if (OTPDetails === null || OTPDetails === "") {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    reDirect();
    sendOTP();
    return () => {
      // clearTimeout(otpTimeOut);
      clear();
    };
  }, []);

  return (
    <>
      <section className={css.confirm}>
        <h1>Confirm your email</h1>
        {OTPDetails?.type === "password" && (
          <div className={css["email-address"]}>
            <p>
              Please enter your email address that the OTP will be sent to...
            </p>

            <Form>
              <FormGroup
                icon="fas fa-envelope"
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Button>Send OTP</Button>
            </Form>
          </div>
        )}
        <div className={css["email-address"]}>
          <p>
            Please enter the OTP sent to{" "}
            {OTPDetails?.email === "" || OTPDetails?.email === null
              ? email
              : OTPDetails?.email}
          </p>
          <Form onSubmit={validateOTP}>
            <FormGroup
              icon="fas fa-key"
              placeholder="Enter OTP..."
              onChange={(e) => {
                setOTP(e.target.value);
              }}
              value={OTP}
            />
            {invalidOTP && <p className="error">Invalid OTP...</p>}
            <div className={css["action"]}>
              <Button>Confirm OTP</Button>
              {!disabled && (
                <Button type="button" disabled={disabled} onClick={sendOTP}>
                  Resend
                </Button>
              )}
            </div>
            <p>
              Didn't recieve any mail? You will be able to resend after 30
              seconds...
            </p>
          </Form>
        </div>
      </section>
    </>
  );
};

export default ConfirmOTP;
