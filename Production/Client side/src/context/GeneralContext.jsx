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
});

const GeneralContext = (props) => {
  const [emailToSendOTP, setEmailToSendOTP] = useState("");
  const [OTPConfirmType, setOTPConfirmType] = useState("");
  const [refreshState, setRefreshState] = useState(false);
  // const domain = `https://localhost:44357/`;
  const domain = "https://gochatapi.azurewebsites.net/";
  const config = {
    headers: {
      "Access-allow-control-origin": "*",
    },
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
  };

  return <General.Provider value={context}>{props.children}</General.Provider>;
};

export default GeneralContext;
