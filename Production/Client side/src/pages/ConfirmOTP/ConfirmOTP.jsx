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
  const [email, setEmail] = useState(general.emailToSendOTP);
  const [invalidOTP, setInvalidOTP] = useState(false);
  const apiPrefix = general.domain;
  const url = apiPrefix + `api/user/`;
  const config = general.config;
  const navigate = useNavigate();
  const OTPConfirmType = JSON.parse(localStorage.getItem("OTPConfirmType"));
  const emailToSendOTP = JSON.parse(localStorage.getItem("emailToSendOTP"));
  const [resent, setResent] = useState({
    bool: false,
    message: `OTP has been resent to ${emailToSendOTP}`,
  });

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
      Email: emailToSendOTP,
    };

    axios
      .post(_url, body, config)
      .then((res) => {
        const user = res.data;

        user.map((each) => {
          isOnline(each.UserID);
          localStorage.setItem("GO_Media_UserId", each.UserID);
          localStorage.setItem("GO_Media_UserName", each.UserName);
        });
      })
      .catch((e) => {});
  };

  const clear = () => {
    const _url = url + `eraseOTP`;
    const body = {
      Email: emailToSendOTP,
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
      Email: emailToSendOTP,
      OTP: OTP,
    };

    axios
      .put(_url, body, config)
      .then((res) => {
        if (res.data) {
          setInvalidOTP(false);

          clear();
          getUserByEmail();

          localStorage.removeItem("OTPConfirmType");
          localStorage.removeItem("emailToSendOTP");

          navigate("/chat", { replace: true });
        } else {
          setInvalidOTP(true);
        }
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const clearOTP = () => {
    setDisabled(true);

    const timeOut = setTimeout(() => {
      clear();
      setDisabled(false);
      // setResent((prev) => ({
      //   bool: false,
      //   ...prev,
      // }));
    }, 180000);
    setOtpTimeOut(timeOut);
  };

  const onReload = () => {
    const _url = url + `updateOTP`;
    const body = {
      Email: emailToSendOTP === null ? email : emailToSendOTP,
    };

    axios
      .put(_url, body, config)
      .then((res) => {
        if (res.data) {
          console.log("OTP sent successfully...");
          console.log("Send OTP", res.data);
        } else {
          console.log("An error occurred...");
        }
      })
      .catch((e) => {
        console.log(e);
      });

    if (OTPConfirmType === "Registeration") {
      if (emailToSendOTP === "" || emailToSendOTP === null) {
        navigate("/login", { replace: true });
      }
    } else {
    }
  };

  const resendOTP = () => {
    const _url = url + `updateOTP`;
    const body = {
      Email: emailToSendOTP === null ? email : emailToSendOTP,
    };

    axios
      .put(_url, body, config)
      .then((res) => {
        if (res.data) {
          console.log("Resent...", res.data);
          setResent((prev) => ({
            bool: true,
            ...prev,
          }));
        } else {
          console.log("An error occurred...");
        }
      })
      .catch((e) => {
        console.log(e);
      });

    clearOTP();
  };

  useEffect(() => {
    onReload();
    clearOTP();
    return () => {
      clearTimeout(otpTimeOut);
    };
  }, []);

  return (
    <>
      <section className={css.confirm}>
        <h1>Confirm your email</h1>
        {OTPConfirmType === "Password" && (
          <div className={css["email-address"]}>
            <p>
              Please enter your email address that the OTP will be sent to...
            </p>

            <Form>
              <FormGroup
                icon="fas fa-envelope"
                placeholder="Enter email address..."
              />
              <Button>Send OTP</Button>
            </Form>
          </div>
        )}
        <div className={css["email-address"]}>
          <p>Please enter the OTP sent to {emailToSendOTP}</p>
          <Form onSubmit={validateOTP}>
            <FormGroup
              icon="fas fa-key"
              placeholder="Enter OTP..."
              onChange={setOTP}
              value={OTP}
            />
            {invalidOTP && <p className="error">Invalid OTP...</p>}
            <div className={css["action"]}>
              <Button>Confirm OTP</Button>
              <Button type="button" disabled={disabled} onClick={resendOTP}>
                Resend
              </Button>
            </div>
            {!disabled && <p>OTP has been cleared click to resend...</p>}
            {resent.bool && (
              <p>OTP has been successfully resent to {emailToSendOTP}...</p>
            )}
          </Form>
        </div>
      </section>
    </>
  );
};

export default ConfirmOTP;
