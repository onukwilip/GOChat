import "./App.css";
import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Route, Routes } from "react-router-dom";
import { General } from "./context/GeneralContext";
import Login from "./pages/Login/Login";
import ChatEngine from "./pages/ChatEngine/ChatEngine";
import Register from "./pages/Register/Register";
import ConfirmOTP from "./pages/ConfirmOTP/ConfirmOTP";

function App() {
  const userId = localStorage.getItem("GO_Media_UserId");
  const navigate = useNavigate();
  const general = useContext(General);
  const apiPrefix = general.domain;
  const config = general.config;
  const url = apiPrefix + `api/user/${userId}`;

  //USER IS ONLINE
  const isOnline = () => {
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

  //USER IS OFFLINE
  const isOffline = () => {
    const url = apiPrefix + `api/user/isOnline`;
    const body = {
      UserID: userId ? userId : "undefined",
      isOnline: false,
    };
    axios
      .put(url, body, config)
      .then((res) => {
        console.log("Is Offline", res.data);
      })
      .catch((e) => {
        console.log("Error", e);
      });
  };

  //USER WAS LAST SEEN AFTER HE WENT OFFLINE
  const lastSeen = () => {
    const url =
      apiPrefix + `api/user/lastSeen/${userId ? userId : "undefined"}`;
    axios
      .put(url, config)
      .then((res) => {
        console.log("Res", res.data);
      })
      .catch((e) => {
        console.log("Error", e);
      });
  };

  //VERIFY IF USER IS LOGGED IN
  const verifyUser = () => {
    //IF LOCALSTORAGE.USERID IS EMPTY
    if (userId !== null && userId !== "") {
      //CALL API
      axios
        .get(url, config)
        .then((res) => {
          const user = res.data;
          //IF USER DOESN'T EXIST
          if (
            user.Response.UserExists === false ||
            user.Response.IsAuthenticated === false
          ) {
            //NAVIGATE TO LOGIN
            console.log("User", user);
            navigate("/login", { replace: true });
          }
          //ELSE
          else {
            localStorage.setItem("GO_Media_UserId", user.UserID);
            localStorage.setItem("GO_Media_UserName", user.UserName);
            //NAVIGATE TO CHAT ENGINE
            navigate("/chat", { replace: true });
            //CALL THE isOnline FUNCTION
            // alert("Not exist");
          }
        })
        //IF ERROR NAVIGATE TO LOGIN
        .catch((e) => {
          console.log("error", e);
          navigate("/login", { replace: true });
        });
    }
    //IF LOCALSTORAGE.USERID IS EMPTY
    else {
      //NAVIGATE TO LOGIN
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    // verifyUser();
    isOnline();
    return () => {
      isOffline();
      lastSeen();
    };
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/chat/*" element={<ChatEngine />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/confirm" element={<ConfirmOTP />}></Route>
      </Routes>
    </div>
  );
}

export default App;
