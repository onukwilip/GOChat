import React, { useContext, useEffect, useState } from "react";
import css from "./ChatBlock.module.css";
import dummy from "../../../assets/images/dummy-img.png";
import { Form, FormGroup } from "../../Form/Form";
import { Button } from "../../Button/Button";
import MyChats from "../Chats/MyChats/MyChats";
import TheirChats from "../Chats/TheirChats/TheirChats";
import { General } from "../../../context/GeneralContext";
import { Chats } from "../../../dummyData";

const ChatBlock = (props) => {
  const general = useContext(General);

  const [chatRoomProfile, setChatRoomProfile] = useState({
    ...JSON.parse(sessionStorage.getItem("chatRoom")),
  });
  const chatRoomVariable = {
    ...JSON.parse(sessionStorage.getItem("chatRoom")),
  };
  const [chats, setChats] = useState([]);

  const getAllChats = () => {
    const allChats = Chats.filter(
      (chat) => chat.chatRoomId === chatRoomVariable.ChatRoomID
    );
    setChats(allChats);
    console.log("Chats", allChats);
  };

  const NoChatsAvailable = () => {
    return (
      <div className={css["no-chat"]}>
        <h1>No chats available...</h1>
        <p>
          Some people are actually shy to start the chat, why don't you trigger
          the discussion 😁
        </p>
      </div>
    );
  };

  useEffect(() => {
    setChatRoomProfile({ ...JSON.parse(sessionStorage.getItem("chatRoom")) });
    // console.log(`User name ${props.userName}`, `Image ${props.image}`);
    // console.log("chat room profile", chatRoomProfile);
    getAllChats();
  }, [general.refreshState]);
  const date = new Date(chatRoomProfile.LastSeen);

  return (
    <section className={css.chat}>
      <div className={css.bg}></div>
      <div className={css.body}>
        <div className={css.header}>
          <div>
            <div className={css["img-container"]}>
              <img
                src={
                  // chatRoomProfile?.ProfilePicture
                  //   ? chatRoomProfile?.ProfilePicture
                  //   : props.image

                  Object.keys(chatRoomProfile).length > 0 &&
                  chatRoomProfile?.ProfilePicture
                    ? chatRoomProfile?.ProfilePicture
                    : Object.keys(chatRoomProfile).length < 1 &&
                      props.image != null
                    ? props.image
                    : dummy
                }
                alt=""
              />
              <div
                className={`${css.status} ${
                  // chatRoomProfile?.IsOnline ? css.online : css.offline
                  Object.keys(chatRoomProfile).length > 0 &&
                  chatRoomProfile.IsOnline
                    ? css.online
                    : Object.keys(chatRoomProfile).length > 0 &&
                      !chatRoomProfile.IsOnline
                    ? css.offline
                    : css.IsOnline
                }`}
              ></div>
            </div>
            <div className={css["details"]}>
              <p className={css["name"]}>
                {chatRoomProfile.ChatRoomName
                  ? chatRoomProfile.ChatRoomName
                  : props.userName}
              </p>
              <p className={css.status}>
                {
                  /* {chatRoomProfile.IsOnline
                  ? "Online"
                  : `Last seen ${date.getFullYear()}/${
                      date.getMonth() + 1
                    }/${date.getDate()}`} */

                  Object.keys(chatRoomProfile).length > 0 &&
                  chatRoomProfile?.IsOnline
                    ? "Online"
                    : Object.keys(chatRoomProfile).length > 0 &&
                      !chatRoomProfile?.IsOnline
                    ? `Last seen ${date.getFullYear()}/${
                        date.getMonth() + 1
                      }/${date.getDate()}`
                    : "Online"
                }
              </p>
            </div>
          </div>
        </div>
        <div className={css["platform"]}>
          {/* CHAT PLATFORM GOES IN HERE... */}
          {chats.length < 1 && <NoChatsAvailable />}
          {chats.map((eachChat) => {
            return (
              <>
                {eachChat.author.authorId === "11" ? (
                  <MyChats chat={eachChat} />
                ) : (
                  <TheirChats chat={eachChat} />
                )}
              </>
            );
          })}
        </div>
        <div className={css.form}>
          <Form>
            <div className={css["form-parent"]}>
              <div className={css["l-side"]}>
                <FormGroup
                  icon={`fa-solid fa-face-smile ${css.cursor} ${css["icon-hover"]}`}
                  placeholder="Enter message..."
                />
              </div>
              <div className={css.middle}>
                <i className="fa-solid fa-paperclip"></i>
              </div>
              <div className={css["r-side"]}>
                <button>
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ChatBlock;
