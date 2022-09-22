import React, { createContext, useState } from "react";

export const General = createContext({
  domain: ``,
  config: "",
  emailToSendOTP: "",
  setEmailToSendOTP: (email) => {},
  OTPconfirmType: "",
  setOTPConfirmType: (type) => {},
  refreshState: "",
  setRefreshState: () => {},
  toBase64: (string) => {},
  fromBase64: (string) => {},
});

const GeneralContext = (props) => {
  const [emailToSendOTP, setEmailToSendOTP] = useState("");
  const [OTPConfirmType, setOTPConfirmType] = useState("");
  const [refreshState, setRefreshState] = useState(false);
  const domain = `https://localhost:44357/`;
  // const domain = "https://gochatapi.azurewebsites.net/";
  const config = {
    headers: {
      "Access-control-allow-origin": "*",
      "Content-type": "application/json",
    },
  };

  const toBase64 = (string) => {
    return window.btoa(string);
  };

  const fromBase64 = (string) => {
    return window.atob(string);
  };

  const context = {
    domain: domain,
    config: config,
    emailToSendOTP: emailToSendOTP,
    setEmailToSendOTP: setEmailToSendOTP,
    OTPconfirmType: OTPConfirmType,
    setOTPConfirmType: setOTPConfirmType,
    refreshState: refreshState,
    setRefreshState: setRefreshState,
    toBase64: toBase64,
    fromBase64: fromBase64,
  };

  return <General.Provider value={context}>{props.children}</General.Provider>;
};

export default GeneralContext;
