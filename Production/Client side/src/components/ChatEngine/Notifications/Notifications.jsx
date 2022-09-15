import React, { useEffect, useState } from "react";
import { SidebarSearch, NotificationMapComponents } from "../Sidebar/Sidebar";
import css from "./Notifications.module.css";
import { messages as allNotifications } from "../../../dummyData";
import { useNavigate, useParams } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  const { status } = useParams();
  const [notifications, setNotifications] = useState(allNotifications);

  const selectAll = () => {
    setNotifications(allNotifications);
  };

  const selectOffline = () => {
    setNotifications(
      allNotifications.filter((contact) => contact.isOnline === false)
    );
  };

  const selectOnline = () => {
    setNotifications(
      allNotifications.filter((contact) => contact.isOnline === true)
    );
  };
  return (
    <div className={css.messages}>
      <div className={css.search}>
        <SidebarSearch
          icon="fa fa-search"
          actionIcon="fa-solid fa-user-plus"
          placeholder="Search all notifications"
          all="All"
          active="Latest"
          inActive="Oldest"
          onAllClick={selectAll}
          onActiveClick={selectOnline}
          onInActiveClick={selectOffline}
          onAllLink="/chat/notifications/all"
          onActiveLink="/chat/notifications/latest"
          onInActiveLink="/chat/notifications/oldest"
        />
      </div>
      <div className={css.users}>
        <NotificationMapComponents
          title="Notifications"
          addUserIcon={false}
          profiles={notifications}
          addMessagesCount={false}
        />
      </div>
    </div>
  );
};

export default Notifications;
