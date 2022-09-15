import React from "react";
import css from "./ChatEngine.module.css";
import ChatBlock from "../../components/ChatEngine/ChatBlock/ChatBlock";
import Navbar from "../../components/ChatEngine/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Contacts from "../../components/ChatEngine/Contacts/Contacts";
import Messages from "../../components/ChatEngine/Messages/Messages";
import Notifications from "../../components/ChatEngine/Notifications/Notifications";

const ChatEngine = () => {
  return (
    <>
      <section className={css["chat-engine"]}>
        <div className={css.navbar}>
          <Navbar />
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
                  {/* <Route path="*" element={<Contacts />} /> */}
                </Routes>
              </div>
            </div>
            <div className={css["chat-block"]}>
              <ChatBlock />
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
              <Route path="platform" element={<ChatBlock />} />
            </Routes>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatEngine;
