import React, { useContext, useState } from "react";
import css from "./MyChats.module.css";
import image from "../../../../assets/images/dummy-img.png";
import Glassmorphism from "../../../Glassmorphism/Glassmorphism";
import { General } from "../../../../context/GeneralContext";
import axios from "axios";

const SeeMore = <p>See more</p>;
export const Icon = (props) => (
  <>
    <div className={css.icon} onClick={props.onClick}>
      <i className={`${props.icon} ${props.className}`}></i>
    </div>
  </>
);

const MyChats = ({ chat }) => {
  const [showAllMessage, setShowAllMessage] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showAllParentMessage, setShowAllParentMessage] = useState(false);
  const general = useContext(General);
  const userID = localStorage.getItem("UserId");
  const url = `${general.domain}api`;

  const replyChat = () => {
    const chatRoomID = JSON.parse(
      sessionStorage.getItem("chatRoom")
    )?.ChatRoomID;

    const values = {
      parentID: chat?.ChatID,
      parentName: chat?.Author?.AuthorName,
      parentMessage: chat?.Message,
      chatRoomID: chatRoomID,
    };

    general.setParentChatProperties(values);
  };

  const deleteChat = async () => {
    const confrimDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (confrimDelete) {
      const ip = await axios
        .get("https://geolocation-db.com/json/")
        .catch((e) => {
          console.log(e);
          if (e.request) {
          } else {
          }
        });

      const base64IP = general.toBase64(ip?.data?.IPv4);

      const _url = `${url}/chats/${userID}/${base64IP}/${chat?.ChatID}`;
      const response = await axios.delete(_url).catch((e) => {
        setShowActions(false);
      });
      if (response) {
        setShowActions(false);
      }
    } else {
      setShowActions(false);
    }
  };

  return (
    <div className={css["my-chats"]} id={chat?.ChatID}>
      <div className={css.main}>
        <div className={css["img-container"]}>
          <img src={chat?.Author?.AuthorImage} alt="" />
        </div>
        <div className={css["text-body"]}>
          <p className={css.name}>{chat?.Author?.AuthorName}</p>
          <div style={{ maxWidth: "50%", minWidth: "200px" }} align="right">
            <div className={css["file-container"]}>
              {chat?.ChatFile.length >= 1
                ? chat?.ChatFile.map((eachFile, i) => (
                    <Glassmorphism className={css.file} key={i}>
                      <a>
                        <div className={css["file-icon-container"]}>
                          <i className="fas fa-file"></i>
                        </div>
                      </a>
                      <div className={css["file-details"]}>
                        <a
                          href={eachFile.Path}
                          download={eachFile.FileName}
                          target="_blank"
                        >
                          <em className={css["file-name"]}>
                            {eachFile.FileName}
                          </em>
                        </a>
                        <em className={css["file-size"]}>
                          {eachFile.Size} Kb file...
                        </em>
                      </div>
                    </Glassmorphism>
                  ))
                : null}
            </div>
            <div className={css["filter-container"]}>
              {showActions && (
                <div className={css.actions}>
                  <Icon icon="fa-solid fa-reply" onClick={replyChat} />
                  <Icon icon="fa-solid fa-pen-to-square" className={css.edit} />
                  <Icon
                    icon="fa-solid fa-trash"
                    className={css.delete}
                    onClick={deleteChat}
                  />
                </div>
              )}
              <div
                onClick={() => {
                  setShowActions((prev) => !prev);
                }}
              >
                <Icon icon="fa-solid fa-ellipsis" />
              </div>
              <Glassmorphism className={css.filter}>
                {chat.Parent.ParentID !== null &&
                chat.Parent.ParentID !== "" ? (
                  <>
                    {chat?.Parent.ParentMessage !== null &&
                    chat?.Parent.ParentMessage !== "" ? (
                      <>
                        <a
                          href={`#${chat.Parent.ParentID}`}
                          className={css["replied-link"]}
                        >
                          <div className={css["replied-message"]}>
                            <em className={css["parent-author"]}>
                              {chat?.Parent?.ParentAuthor}
                            </em>
                            <em className={css["parent-message"]}>
                              {chat?.Parent?.ParentMessage?.length > 50 ? (
                                <>
                                  {chat?.Parent?.ParentMessage.substring(0, 50)}
                                  ...
                                </>
                              ) : (
                                <>{chat?.Parent?.ParentMessage}</>
                              )}
                            </em>
                          </div>
                        </a>
                      </>
                    ) : null}
                  </>
                ) : null}

                <div className={css.message}>
                  {/* {chat?.message} */}
                  {chat?.Message?.length > 100 && !showAllMessage ? (
                    <>
                      {chat?.Message?.substring(0, 100)}
                      <a
                        onClick={() => {
                          setShowAllMessage((prev) => !prev);
                        }}
                        className={css.toogle}
                      >
                        ...See more
                      </a>
                    </>
                  ) : (
                    <>
                      {chat?.Message}
                      {chat?.Message.length > 100 && showAllMessage ? (
                        <>
                          <a
                            onClick={() => {
                              setShowAllMessage((prev) => !prev);
                            }}
                            className={css.toogle}
                          >
                            &nbsp; See less
                          </a>
                        </>
                      ) : null}
                    </>
                  )}
                </div>
              </Glassmorphism>
            </div>
          </div>

          <div className={css.time}>
            {new Date(chat?.Date).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyChats;
