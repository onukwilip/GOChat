import React, { useEffect, useState } from "react";
import { SidebarSearch, DisscussionMapComponents } from "../Sidebar/Sidebar";
import css from "./Messages.module.css";
import { messages as allMessages } from "../../../dummyData";
import { useNavigate, useParams } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  const { status } = useParams();
  const [messages, setMessages] = useState(allMessages);

  const selectAll = () => {
    setMessages(allMessages);
  };

  const selectOffline = () => {
    setMessages(allMessages.filter((contact) => contact.isOnline === false));
  };

  const selectOnline = () => {
    setMessages(allMessages.filter((contact) => contact.isOnline === true));
  };
  return (
    <div className={css.messages}>
      <div className={css.search}>
        <SidebarSearch
          icon="fa fa-search"
          actionIcon="fa-solid fa-user-plus"
          placeholder="Search for messages"
          all="All"
          active="Read"
          inActive="Unread"
          onAllClick={selectAll}
          onActiveClick={selectOnline}
          onInActiveClick={selectOffline}
          onAllLink="/chat/messages/all"
          onActiveLink="/chat/messages/read"
          onInActiveLink="/chat/messages/unread"
        />
      </div>
      <div className={css.users}>
        <DisscussionMapComponents
          title="Messages"
          addUserIcon={false}
          profiles={messages}
          addMessagesCount={true}
        />
      </div>
    </div>
  );
};

export default Messages;
