import React, { useEffect, useState, useContext } from "react";
import css from "./ChatEngine.module.css";
import ChatBlock from "../../components/ChatEngine/ChatBlock/ChatBlock";
import Navbar from "../../components/ChatEngine/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Contacts from "../../components/ChatEngine/Contacts/Contacts";
import Messages from "../../components/ChatEngine/Messages/Messages";
import Notifications from "../../components/ChatEngine/Notifications/Notifications";
import Glassmorphism from "../../components/Glassmorphism/Glassmorphism";
import { General } from "../../context/GeneralContext";
import axios from "axios";
import AllContacts from "../../components/ChatEngine/AllContacts/AllContacts";
import User from "../../components/ChatEngine/User/User";
import { Request } from "../../components/ChatEngine/Sidebar/Sidebar";
import Requests from "../../components/ChatEngine/Requests/Requests";

const ChatEngine = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState("");
  const general = useContext(General);
  const userId = localStorage.getItem("UserId");
  const apiPrefix = general.domain;
  const config = general.config;
  const url = apiPrefix + `api`;

  const getUser = (ipAddress) => {
    const _url = `${url}/user/${userId}/${general.toBase64(ipAddress)}`;
    axios
      .get(_url, config)
      .then((res) => {
        setUser(res.data);
        console.log("Chat engine", res.data);
      })
      .catch();
  };

  const getUserIPAddress = (email) => {
    const ipUrl = "https://geolocation-db.com/json/";
    axios
      .get(ipUrl)
      .then((res) => {
        //Call my API to get user from database
        getUser(res.data.IPv4);
      })
      .catch((e) => {});
  };

  useEffect(() => {
    getUserIPAddress();
    return () => {};
  }, [general.refreshState]);

  return (
    <>
      <div
        className={css.hamburger}
        onClick={() => {
          setMobileMenu((prev) => !prev);
        }}
      >
        <i className={!mobileMenu ? "fas fa-bars" : "fas fa-times"}></i>
      </div>
      {mobileMenu && (
        <Glassmorphism className={css["mobile-menu"]}>
          <Navbar image={user.ProfilePicture} userId={user.UserID} />
        </Glassmorphism>
      )}

      <section className={css["chat-engine"]}>
        <div className={css.navbar}>
          <Navbar image={user.ProfilePicture} userId={user.UserID} />
        </div>
        <div className={css.body}>
          <div className={css["body-container"]}>
            <div className={css.sidebar}>
              <div className={css["sidebar-children"]}>
                <Routes>
                  <Route path="" element={<Contacts />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path=":status" element={<Contacts />} />
                  <Route path="messages/" element={<Messages />} />
                  <Route path="messages/:status" element={<Messages />} />
                  <Route path="notifications/" element={<Notifications />} />
                  <Route
                    path="notifications/:status"
                    element={<Notifications />}
                  />
                  <Route path="all-contacts/" element={<AllContacts />} />
                  <Route
                    path="all-contacts/:status"
                    element={<AllContacts />}
                  />
                  <Route path="user/" element={<User />} />
                  <Route path="user/:userid" element={<User />} />
                  <Route path="requests/" element={<Requests />} />
                  <Route path="requests/:status" element={<Requests />} />
                  {/* <Route path="*" element={<Contacts />} /> */}
                </Routes>
              </div>
            </div>
            <div className={css["chat-block"]}>
              <ChatBlock image={user.ProfilePicture} userName={user.UserName} />
            </div>
          </div>
          <div className={css["mobile-body"]}>
            <Routes>
              <Route path="" element={<Contacts />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path=":status" element={<Contacts />} />
              <Route path="messages/" element={<Messages />} />
              <Route path="messages/:status" element={<Messages />} />
              <Route path="notifications/" element={<Notifications />} />
              <Route path="notifications/:status" element={<Notifications />} />
              <Route path="all-contacts/" element={<AllContacts />} />
              <Route path="all-contacts/:status" element={<AllContacts />} />
              <Route path="user/" element={<User />} />
              <Route path="user/:userid" element={<User />} />
              <Route
                path="platform"
                element={
                  <ChatBlock
                    image={user.ProfilePicture}
                    userName={user.UserName}
                  />
                }
              />
              <Route path="requests/" element={<Requests />} />
              <Route path="requests/:status" element={<Requests />} />
            </Routes>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatEngine;
