import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Route, Routes } from "react-router-dom";
import { General } from "./context/GeneralContext";
import Login from "./pages/Login/Login";
import ChatEngine from "./pages/ChatEngine/ChatEngine";
import Register from "./pages/Register/Register";
import ConfirmOTP from "./pages/ConfirmOTP/ConfirmOTP";
import Modal from "./components/Modal/Modal";
import Loader from "./components/Loader/Loader";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("UserId"));
  const [loading, setLoading] = useState(false);
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
  const verifyUser = (ipAddress) => {
    setLoading(true);
    //IF LOCALSTORAGE.USERID IS EMPTY
    if (userId !== null && userId !== "") {
      //CALL API
      axios
        .get(`${url}/${general.toBase64(ipAddress)}`, config)
        .then((res) => {
          setLoading(false);

          const user = res.data;
          //IF USER DOESN'T EXIST
          if (
            user.Response.UserExists === false ||
            user.Response.IsAuthenticated === false
          ) {
            setLoading(false);

            //NAVIGATE TO LOGIN
            console.log("User", user);
            navigate("/login", { replace: true });
          }
          //ELSE
          else {
            setLoading(false);

            localStorage.setItem("UserId", user.UserID);
            console.log(user);
            //NAVIGATE TO CHAT ENGINE
            navigate("/chat", { replace: true });
            //CALL THE isOnline FUNCTION
            // alert("Not exist");
          }
        })
        //IF ERROR NAVIGATE TO LOGIN
        .catch((e) => {
          setLoading(false);

          console.log("error", e);
          navigate("/login", { replace: true });
        });
    }
    //IF LOCALSTORAGE.USERID IS EMPTY
    else {
      setLoading(false);

      //NAVIGATE TO LOGIN
      navigate("/login", { replace: true });
    }
  };

  //GET IP ADDRESS OF USER
  const getUserIPAddress = (email) => {
    setLoading(true);

    const ipUrl = "https://geolocation-db.com/json/";
    axios
      .get(ipUrl)
      .then((res) => {
        //Call my API to log user IP address
        verifyUser(res.data.IPv4);
      })
      .catch((e) => {
        setLoading(false);

        //NAVIGATE TO LOGIN
        navigate("/login", { replace: true });
      });
  };

  useEffect(() => {
    getUserIPAddress();
    isOnline();
    setUserId(localStorage.getItem("UserId"));
    return () => {
      isOffline();
      lastSeen();
    };
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <>
          <div>
            <Routes>
              <Route path="/" element={<Login />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/chat/*" element={<ChatEngine />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/confirm" element={<ConfirmOTP />}></Route>
            </Routes>
          </div>
          {general.modalState === "true" && <Modal />}
        </>
      )}
    </>
  );
}

export default App;
