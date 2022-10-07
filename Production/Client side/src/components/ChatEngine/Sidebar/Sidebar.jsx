import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import css from "./Sidebar.module.css";
import { Form, FormGroup } from "../../Form/Form";
import { General } from "../../../context/GeneralContext";
import dummy from "../../../assets/images/dummy-img.png";
import NoItem from "../../NoItem/NoItem";
import axios from "axios";

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

  const onChangeHandler = (e) => {
    props?.onChange(e);
  };

  return (
    <>
      <section className={css["sidebar-icon"]}>
        <div className={css["icon-group"]}>
          <Form>
            <FormGroup
              icon={props.icon}
              placeholder={props.placeholder}
              onChange={onChangeHandler}
            />
            <div className={css["icon-container"]}>
              <i className={props.actionIcon}></i>
            </div>
          </Form>
        </div>
        {props.showOptions && (
          <div className={css.options}>
            <ul>
              {!props.all ? null : (
                <NavLink
                  className={({ isActive }) => (isActive ? css.active : "")}
                  to={props.onAllLink}
                >
                  <li onClick={allClickHandler}>{props.all}</li>
                </NavLink>
              )}

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
        )}
      </section>
    </>
  );
};

export const ChatRoomMapComponents = (props) => {
  const allItems = [...props?.profiles];
  return (
    <section className={css["sidebar-map-components"]}>
      <h1>{props.title}</h1>
      <br />
      <div className={css["all-components"]}>
        {allItems.length > 0 ? (
          allItems?.map((eachItem, i) => {
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
          })
        ) : (
          <div className={css["no-item"]}>
            <NoItem message="No contacts found" />
          </div>
        )}
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

export const UserMapComponents = (props) => {
  const allItems = [...props.profiles];
  return (
    <section className={css["sidebar-map-components"]}>
      <h1>{props.title}</h1>
      <br />
      <div className={css["all-user-components"]}>
        {allItems.length > 0 ? (
          allItems.map((eachItem, i) => {
            if (eachItem.Type === "group") {
              return (
                <>
                  <GroupProfile
                    items={eachItem}
                    className={css.large}
                    addUserIcon={props.addUserIcon}
                  />
                  <GroupProfile
                    items={eachItem}
                    className={css.medium}
                    addUserIcon={props.addUserIcon}
                  />
                </>
              );
            } else {
              return (
                <>
                  <UserProfile
                    items={eachItem}
                    className={css.large}
                    addUserIcon={props.addUserIcon}
                  />
                  <UserProfile
                    items={eachItem}
                    className={css.medium}
                    addUserIcon={props.addUserIcon}
                  />
                </>
              );
            }
          })
        ) : (
          <div className={css["no-item"]}>
            <NoItem message={props.notFoundMessage} />
          </div>
        )}
      </div>
    </section>
  );
};

export const RequestMapComponents = (props) => {
  const { status } = useParams();
  const allItems = [...props.profiles];
  // useEffect(() => {
  //   console.log(status);
  // }, []);
  return (
    <section className={css["sidebar-map-components"]}>
      <h1>{props.title}</h1>
      <br />
      <div className={css["all-components"]}>
        {allItems.length > 0 ? (
          allItems.map((eachItem, i) => {
            return (
              <>
                {status === "sent" && (
                  <>
                    <SentRequest onClick={props.onClick} items={eachItem} />
                  </>
                )}
                {status === "recieved" && (
                  <>
                    <RecievedRequest onClick={props.onClick} items={eachItem} />
                  </>
                )}
                {status === undefined && (
                  <>
                    <SentRequest onClick={props.onClick} items={eachItem} />
                  </>
                )}
              </>
            );
          })
        ) : (
          <div className={css["no-item"]}>
            <NoItem message="No requests found" />
          </div>
        )}
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
        <img src={items?.ProfilePicture} alt="" />
        <div
          className={`${css.status} ${
            items?.IsOnline ? css.online : css.offline
          }`}
        ></div>
      </div>
      <div className={css["details"]}>
        <p className={css["name"]}>{items?.ChatRoomName}</p>
        <p className={css["about"]}>
          {items?.Description?.length > 50
            ? items?.Description.slice(0, 50) + "..."
            : items?.Description}
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

export const UserProfile = ({ items, className, addUserIcon, onClick }) => {
  const general = useContext(General);
  const navigate = useNavigate();

  const onClickHandler = () => {
    navigate(`/chat/user/${general.toBase64(items.UserID)}`);
  };

  return (
    <section
      className={`${css["sidebar-user-profile"]} ${className}`}
      onClick={onClickHandler}
    >
      <div className={css["img-container"]}>
        <img
          src={
            items?.ProfilePicture === null || items?.ProfilePicture === ""
              ? dummy
              : items?.ProfilePicture
          }
          alt=""
        />
        <div
          className={`${css.status} ${
            items?.IsOnline ? css.online : css.offline
          }`}
        ></div>
      </div>
      <div className={css["details"]}>
        <p className={css["name"]}>{items?.UserName}</p>
        <p className={css["about"]}>
          {items?.Description?.length > 50
            ? items?.Description.slice(0, 50) + "..."
            : items?.Description}
        </p>
      </div>
      {addUserIcon && (
        <div className={css["user-icon"]}>
          <i className="fas fa-user-plus"></i>
        </div>
      )}
    </section>
  );
};

export const GroupProfile = ({ items, className, addUserIcon }) => {
  const general = useContext(General);
  const navigate = useNavigate();

  const onClickHandler = () => {
    navigate(`/chat/group/${general.toBase64(items.ChatRoomID)}`);
  };

  return (
    <section
      className={`${css["sidebar-user-profile"]} ${className}`}
      onClick={onClickHandler}
    >
      <div className={css["img-container"]}>
        <img
          src={
            items?.ProfilePicture === null || items?.ProfilePicture === ""
              ? dummy
              : items?.ProfilePicture
          }
          alt=""
        />
        <div className={`${css.status} ${css.online}`}></div>
      </div>
      <div className={css["details"]}>
        <p className={css["name"]}>{items?.ChatRoomName}</p>
      </div>
      {addUserIcon && (
        <div className={css["user-icon"]}>
          <i className="fas fa-user-plus"></i>
        </div>
      )}
    </section>
  );
};

export const SentRequest = ({ items, className }) => {
  const general = useContext(General);
  const navigate = useNavigate();
  const userId = localStorage.getItem("UserId");
  const url = `${general.domain}api/requests`;

  const onDeleteClickHandler = async () => {
    const ip = await axios.get("https://geolocation-db.com/json/");

    axios
      .delete(`${url}/${userId}/${general.toBase64(ip.data.IPv4)}/${items?.ID}`)
      .then((response) => {
        // console.log("Delete request", response.data);
        general.setRefreshState((prev) => !prev);
      })
      .catch((e) => {});
  };

  useEffect(() => {
    // console.log("SentRequest Item ", items);
  }, []);
  return (
    <section className={`${css["sidebar-sent-request"]} ${className}`}>
      <div className={css["img-container"]}>
        <img
          src={
            items?.To?.ProfilePicture === null ||
            items?.To?.ProfilePicture === ""
              ? dummy
              : items?.To?.ProfilePicture
          }
          alt=""
        />
        <div
          className={`${css.status} ${
            items?.To.IsOnline ? css.online : css.offline
          }`}
        ></div>
      </div>
      <div className={css["details"]}>
        <p className={css["name"]}>{items?.To?.UserName}</p>
        <p className={css["about"]}>
          {items?.Message?.length > 50
            ? items?.Message?.slice(0, 50) + "..."
            : items?.Message}
        </p>
      </div>
      <div className={css["icon-container"]}>
        <div className={css["delete-icon"]} onClick={onDeleteClickHandler}>
          <i className="fa-solid fa-trash"></i>
        </div>
      </div>
    </section>
  );
};

export const RecievedRequest = ({ items, className }) => {
  const general = useContext(General);
  const navigate = useNavigate();
  const userId = localStorage.getItem("UserId");
  const url = `${general.domain}api/requests`;
  const [disabled, setDisabled] = useState(false);

  const onDeleteClickHandler = async () => {
    const ip = await axios.get("https://geolocation-db.com/json/");

    axios
      .delete(`${url}/${userId}/${general.toBase64(ip.data.IPv4)}/${items?.ID}`)
      .then((response) => {
        // console.log("Delete request", response.data);
        general.setRefreshState((prev) => !prev);
      })
      .catch((e) => {});
  };

  const onAcceptHandler = async () => {
    setDisabled(true);

    const ip = await axios.get("https://geolocation-db.com/json/");

    axios
      .post(
        `${url}/accept/${userId}/${general.toBase64(ip.data.IPv4)}/${items?.ID}`
      )
      .then((response) => {
        console.log("Accept request", response.data);
        setDisabled(false);
        general.setRefreshState((prev) => !prev);
      })
      .catch((e) => {
        setDisabled(false);
      });
  };

  useEffect(() => {
    // console.log("RecievedRequest Item ", items);
  }, []);

  return (
    <section className={`${css["sidebar-recieved-request"]} ${className}`}>
      <div className={css["img-container"]}>
        <img
          src={
            items?.From?.ProfilePicture === null ||
            items?.From?.ProfilePicture === ""
              ? dummy
              : items?.From?.ProfilePicture
          }
          alt=""
        />
        <div
          className={`${css.status} ${
            items?.From?.IsOnline ? css.online : css.offline
          }`}
        ></div>
      </div>
      <div className={css["details"]}>
        <p className={css["name"]}>{items?.From?.UserName}</p>
        <p className={css["about"]}>
          {items?.Message?.length > 50
            ? items?.Message?.slice(0, 50) + "..."
            : items?.Message}
        </p>
      </div>
      <div className={css["icon-container"]}>
        <button disabled={disabled}>
          <div className={css["accept-icon"]} onClick={onAcceptHandler}>
            <i className="fa-solid fa-check"></i>
          </div>
        </button>

        <div className={css["decline-icon"]} onClick={onDeleteClickHandler}>
          <i className="fa-solid fa-ban"></i>
        </div>
      </div>
    </section>
  );
};
