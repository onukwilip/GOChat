import React, { useContext } from "react";
import css from "./TheirChats.module.css";
import image from "../../../../assets/images/dummy-img.png";
import Glassmorphism from "../../../Glassmorphism/Glassmorphism";
import { useState } from "react";
import { Icon } from "../MyChats/MyChats";
import { General } from "../../../../context/GeneralContext";

const TheirChats = ({ chat }) => {
  const [showAllMessage, setShowAllMessage] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const general = useContext(General);

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

  return (
    <div className={css["their-chats"]} id={chat?.ChatID}>
      <div className={css.main}>
        <div className={css["img-container"]}>
          <img src={chat?.Author?.AuthorImage} alt="" />
        </div>
        <div className={css["text-body"]}>
          <p className={css.name}>{chat?.Author?.AuthorName}</p>
          <div style={{ maxWidth: "50%", minWidth: "200px" }} align="left">
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
              <Glassmorphism className={css.filter}>
                {chat.Parent.ParentID !== null &&
                chat.Parent.ParentID !== "" ? (
                  <>
                    {chat?.Parent.ParentMessage !== null &&
                    chat?.Parent.ParentMessage !== "" ? (
                      <>
                        <a
                          href={`#${chat.Parent.ParentId}`}
                          className={css["replied-link"]}
                        >
                          <div className={css["replied-message"]}>
                            <em className={css["parent-author"]}>
                              {chat?.Parent.ParentAuthor}
                            </em>
                            <em className={css["parent-message"]}>
                              {chat?.Parent?.ParentMessage?.length > 50 ? (
                                <>
                                  {chat?.Parent.ParentMessage.substring(0, 50)}
                                  ...
                                </>
                              ) : (
                                <>{chat?.Parent.ParentMessage}</>
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
                  {chat?.Message.length > 100 && !showAllMessage ? (
                    <>
                      {chat?.Message.substring(0, 100)}
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
              <div
                onClick={() => {
                  setShowActions((prev) => !prev);
                }}
              >
                <Icon icon="fa-solid fa-ellipsis" />
              </div>
              {showActions && (
                <div className={css.actions}>
                  <Icon icon="fa-solid fa-reply" onClick={replyChat} />
                </div>
              )}
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

export default TheirChats;
