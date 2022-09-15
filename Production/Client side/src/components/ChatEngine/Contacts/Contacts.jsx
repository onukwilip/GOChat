import React, { useEffect, useState } from "react";
import { SidebarSearch, ChatRoomMapComponents } from "../Sidebar/Sidebar";
import css from "./Contacts.module.css";
import { chatRooms as allChatrooms } from "../../../dummyData";
import { useNavigate, useParams } from "react-router-dom";

const Contacts = () => {
  const navigate = useNavigate();
  const { status } = useParams();
  const [contacts, setContacts] = useState(allChatrooms?.chatRooms);

  const selectAll = () => {
    setContacts(allChatrooms?.chatRooms);
  };

  const selectOffline = () => {
    setContacts(
      allChatrooms?.chatRooms.filter((contact) => contact.isOnline === false)
    );
  };

  const selectOnline = () => {
    setContacts(
      allChatrooms?.chatRooms.filter((contact) => contact.isOnline === true)
    );
  };

  const onclick = () => {
    console.log("Desktop click");
  };

  const onMediumclick = () => {
    navigate("/chat/platform");
  };

  return (
    <div className={css.contacts}>
      <div className={css.search}>
        <SidebarSearch
          icon="fa fa-search"
          actionIcon="fa-solid fa-user-plus"
          placeholder="Search for people"
          all="All"
          active="Online"
          inActive="Offline"
          onAllClick={selectAll}
          onActiveClick={selectOnline}
          onInActiveClick={selectOffline}
          onAllLink="/chat/all"
          onActiveLink="/chat/online"
          onInActiveLink="/chat/offline"
        />
      </div>
      <div className={css.users}>
        <ChatRoomMapComponents
          title="Contacts"
          addUserIcon={true}
          profiles={contacts}
          addMessagesCount={false}
          onClick={onclick}
          onMediumClick={onMediumclick}
        />
      </div>
    </div>
  );
};

export default Contacts;
