import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import css from "./Sidebar.module.css";
import { Form, FormGroup } from "../../Form/Form";
import { General } from "../../../context/GeneralContext";

export const SidebarSearch = (props) => {
  const allClickHandler = () => {
    props?.onAllClick();
  };

  const activeClickHandler = () => {
    props?.onActiveClick();
  };

  const inActiveClickHandler = () => {
    props?.onInActiveClick();
  };

  return (
    <>
      <section className={css["sidebar-icon"]}>
        <div className={css["icon-group"]}>
          <Form>
            <FormGroup icon={props.icon} placeholder={props.placeholder} />
            <div className={css["icon-container"]}>
              <i className={props.actionIcon}></i>
            </div>
          </Form>
        </div>
        <div className={css.options}>
          <ul>
            <NavLink
              className={({ isActive }) => (isActive ? css.active : "")}
              to={props.onAllLink}
            >
              <li onClick={allClickHandler}>{props.all}</li>
            </NavLink>
            <NavLink
              to={props.onActiveLink}
              className={({ isActive }) => (isActive ? css.active : "")}
            >
              <li onClick={activeClickHandler}>{props.active}</li>
            </NavLink>
            <NavLink
              to={props.onInActiveLink}
              className={({ isActive }) => (isActive ? css.active : "")}
            >
              <li onClick={inActiveClickHandler}>{props.inActive}</li>
            </NavLink>
          </ul>
        </div>
      </section>
    </>
  );
};

export const ChatRoomMapComponents = (props) => {
  const allItems = [...props.profiles];
  return (
    <section className={css["sidebar-map-components"]}>
      <h1>{props.title}</h1>
      <br />
      <div className={css["all-components"]}>
        {allItems.map((eachItem, i) => {
          return (
            <>
              <ChatRoomProfile
                onClick={props.onClick}
                items={eachItem}
                className={css.large}
                addUserIcon={props.addUserIcon}
                addMessagesCount={props.addMessagesCount}
              />
              <ChatRoomProfile
                onClick={props.onMediumClick}
                items={eachItem}
                className={css.medium}
                addUserIcon={props.addUserIcon}
                addMessagesCount={props.addMessagesCount}
              />
            </>
          );
        })}
      </div>
    </section>
  );
};

export const DisscussionMapComponents = (props) => {
  const allItems = [...props.profiles];
  return (
    <section className={css["sidebar-map-components"]}>
      <h1>{props.title}</h1>
      <br />
      <div className={css["all-components"]}>
        {allItems.map((eachItem, i) => {
          return (
            <>
              <Discussion
                onClick={props.onClick}
                items={eachItem}
                className={css.large}
                addUserIcon={props.addUserIcon}
                addMessagesCount={props.addMessagesCount}
              />
              <Discussion
                onClick={props.onMediumClick}
                items={eachItem}
                className={css.medium}
                addUserIcon={props.addUserIcon}
                addMessagesCount={props.addMessagesCount}
              />
            </>
          );
        })}
      </div>
    </section>
  );
};

export const NotificationMapComponents = (props) => {
  const allItems = [...props.profiles];
  return (
    <section className={css["sidebar-map-components"]}>
      <h1>{props.title}</h1>
      <br />
      <div className={css["all-components"]}>
        {allItems.map((eachItem, i) => {
          return (
            <>
              <Notification
                onClick={props.onClick}
                items={eachItem}
                className={css.large}
                addUserIcon={props.addUserIcon}
                addMessagesCount={props.addMessagesCount}
              />
              <Notification
                onClick={props.onMediumClick}
                items={eachItem}
                className={css.medium}
                addUserIcon={props.addUserIcon}
                addMessagesCount={props.addMessagesCount}
              />
            </>
          );
        })}
      </div>
    </section>
  );
};

export const ChatRoomProfile = ({ items, className, addUserIcon, onClick }) => {
  const general = useContext(General);

  const onClickHandler = () => {
    onClick();
    const chatRoom = {
      ...items,
      members: [
        {
          userId: "2",
          userName: "Vasanta Kim",
          profilePic:
            "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
          isOnline: true,
          lastSeen: new Date("2022 / 01 / 01"),
        },
        {
          userId: "8",
          userName: "Cindi Jayanta",
          profilePic:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
          isOnline: false,
          lastSeen: new Date("2022 / 01 / 01"),
        },
      ],
    };
    sessionStorage.setItem("chatRoom", JSON.stringify(chatRoom));
    console.log(chatRoom);
    general.setRefreshState((prev) => !prev);
  };

  return (
    <section
      className={`${css["sidebar-user"]} ${className}`}
      onClick={onClickHandler}
    >
      <div className={css["img-container"]}>
        <img src={items?.chatRoomPicture} alt="" />
        <div
          className={`${css.status} ${
            items?.isOnline ? css.online : css.offline
          }`}
        ></div>
      </div>
      <div className={css["details"]}>
        <p className={css["name"]}>{items?.chatRoomName}</p>
        <p className={css["about"]}>
          {items?.description?.length > 50
            ? items?.description.slice(0, 50) + "..."
            : items?.description}
        </p>
      </div>
      {addUserIcon && (
        <div className={css["user-icon"]}>
          <i className="fas fa-user"></i>
        </div>
      )}
    </section>
  );
};

export const Discussion = ({ items, className, addMessagesCount, onClick }) => {
  const onClickHandler = () => {
    onClick();
    console.log(items);
  };

  return (
    <section
      className={`${css["sidebar-discussion"]} ${className}`}
      onClick={onClickHandler}
    >
      <div className={css["img-container"]}>
        <img src={items?.chatRoomPicture} alt="" />
        <div
          className={`${css.status} ${
            items?.isOnline ? css.online : css.offline
          }`}
        ></div>
      </div>
      <div className={css["details"]}>
        <p className={css["name"]}>{items?.chatRoomName}</p>
        <p className={css["about"]}>
          {items?.description?.length > 50
            ? items?.description.slice(0, 50) + "..."
            : items?.description}
        </p>
      </div>
      {addMessagesCount && (
        <div className={css["message-count"]}>{items?.messageCount}+</div>
      )}
    </section>
  );
};

export const Notification = ({ items, className, onClick }) => {
  const onClickHandler = () => {
    onClick();
    console.log(items);
  };
  return (
    <section
      className={`${css["sidebar-notification"]} ${className}`}
      onClick={onClickHandler}
    >
      <div className={css["img-container"]}>
        <img src={items?.chatRoomPicture} alt="" />
        <div
          className={`${css.status} ${
            items?.isOnline ? css.online : css.offline
          }`}
        ></div>
      </div>
      <div className={css["details"]}>
        <p className={css["name"]}>{items?.chatRoomName}</p>
        <p className={css["about"]}>
          {items?.description?.length > 50
            ? items?.description.slice(0, 50) + "..."
            : items?.description}
        </p>
      </div>
    </section>
  );
};
