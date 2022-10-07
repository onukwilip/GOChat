import React, { useContext, useEffect, useState } from "react";
import css from "./ChatBlock.module.css";
import dummy from "../../../assets/images/dummy-img.png";
import { Form, FormGroup } from "../../Form/Form";
import { Button } from "../../Button/Button";
import MyChats from "../Chats/MyChats/MyChats";
import TheirChats from "../Chats/TheirChats/TheirChats";
import { General } from "../../../context/GeneralContext";
import { Chats } from "../../../dummyData";
import axios from "axios";
import Loader from "../../Loader/Loader";
import ServerError from "../../ServerError/ServerError";
import { v4 as uuidv4 } from "uuid";

const ChatBlock = (props) => {
  const general = useContext(General);
  const userID = localStorage.getItem("UserId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [intervalId, setIntervalId] = useState("");
  const [newChats, setNewChats] = useState([]);
  const url = `${general.domain}api`;

  const [chatRoomProfile, setChatRoomProfile] = useState({
    ...JSON.parse(sessionStorage.getItem("chatRoom")),
  });
  const [chats, setChats] = useState([]);

  const getChatRoom = async () => {
    setLoading(true);
    setError(false);

    const ip = await axios
      .get("https://geolocation-db.com/json/")
      .catch((e) => {
        console.log(e);
        if (e.request) {
          setLoading(false);
          setError(true);
        } else {
          setLoading(false);
          setError(false);
        }
      });

    const base64IP = general.toBase64(ip?.data?.IPv4);
    const { ChatRoomID } = {
      ...JSON.parse(sessionStorage.getItem("chatRoom")),
    };
    const base64ChatRoomID = general.toBase64(ChatRoomID);

    const _url = `${url}/chatroom/${userID}/${base64IP}/${base64ChatRoomID}/chatroom`;

    const response = await axios.get(_url).catch((e) => {
      console.log(e);
      if (e.request) {
        setLoading(false);
        setError(true);
      } else {
        setLoading(false);
        setError(false);
      }
    });

    if (response) {
      const chatRoomData = response?.data?.Data;
      const chatRoomArray = chatRoomData?.map((chatroom) => {
        setChatRoomProfile(chatroom);
        setChats(chatroom.Chats);
        // console.log("Loaded!");
        // console.log("Chatroom!", chatroom);

        setLoading(false);
        setError(false);
      });
    }
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

  const addFileHandelr = (e) => {
    if (e?.target?.files[0]?.name?.length > 0) {
      general.setChatFiles((prev) => [...prev, e?.target?.files[0]]);
    }
    console.log("File", e?.target?.files[0]);
  };

  const removeFileHandler = (name) => {
    general.setChatFiles((prevFiles) =>
      prevFiles.filter((file) => file?.name !== name)
    );
  };

  const refreshMessage = () => {
    general.setChatMessage("");
    general.setChatFiles([]);
    general.setParentChatProperties({
      parentID: "",
      parentName: "",
      parentMessage: "",
      chatRoomID: "",
    });
  };

  const submitChatFiles = async (ip, chatID) => {
    const _url = `${url}/chats/${userID}/${general.toBase64(
      ip
    )}/${general.toBase64(chatRoomProfile?.ChatRoomID)}/${chatID}`;
    const config = {
      ...general.config,
      headers: {
        "Content-type": "multipart/form-data",
        "Access-control-allow-origin": "*",
      },
    };

    general.chatFiles.forEach((file) => {
      console.log("ChatFile", file);
    });

    const formData = new FormData();
    general.chatFiles.forEach((file) => {
      formData.append(`body${general.chatFiles.length}`, file);
    });

    const response = await axios
      .post(_url, formData, { ...config })
      .catch((e) => {
        console.log(e);
        if (e.request) {
          setLoading(false);
          setError(true);
        } else {
          setLoading(false);
          setError(false);
        }
      });

    if (response) {
      console.log("File", response);

      setLoading(false);
      setError(false);

      return response;
    }
  };

  const submitChatMessage = async (ip, chat) => {
    const _url = `${url}/chats/${userID}/${general.toBase64(ip)}`;
    const config = {
      ...general.config,
    };

    const response = await axios
      .post(_url, { ...chat }, { ...config })
      .catch((e) => {
        console.log(e);
        if (e.request) {
          setLoading(false);
          setError(true);
        } else {
          setLoading(false);
          setError(false);
        }
      });

    if (response) {
      console.log("Message", response);

      setLoading(false);
      setError(false);

      return response;
    }
  };

  const onSubmitHandler = async () => {
    general.setSubmitChatProperties((prev) => ({
      ...prev,
      disabled: true,
      chatRoomID: chatRoomProfile?.ChatRoomID,
    }));

    const chatID = `CHAT_${uuidv4()}`;

    const chat = {
      message: general.chatMessage,
      type: "chat",
      Parent: {
        ParentID: general.parentChatProperties?.parentID,
      },
      Author: {
        AuthorID: userID,
      },
      ChatroomID: chatRoomProfile?.ChatRoomID,
      ChatID: chatID,
    };

    const ip = await axios
      .get("https://geolocation-db.com/json/")
      .catch((e) => {
        console.log(e);
        if (e.request) {
          setLoading(false);
          setError(true);
        } else {
          setLoading(false);
          setError(false);
        }
      });

    if (general.chatMessage !== null || general.chatMessage !== "") {
      const message = await submitChatMessage(ip?.data?.IPv4, chat);
      const file = await submitChatFiles(ip?.data?.IPv4, chatID);

      if (message) {
        general.setChatMessage("");
        general.setParentChatProperties({
          parentID: "",
          parentName: "",
          parentMessage: "",
          chatRoomID: "",
        });
        general.setSubmitChatProperties((prev) => ({
          ...prev,
          disabled: false,
          messageError: false,
        }));
      } else {
        general.setSubmitChatProperties((prev) => ({
          ...prev,
          disabled: false,
          messageError: true,
        }));
      }

      if (file) {
        general.setChatFiles([]);
        general.setChatMessage("");
        general.setParentChatProperties({
          parentID: "",
          parentName: "",
          parentMessage: "",
          chatRoomID: "",
        });
        general.setSubmitChatProperties((prev) => ({
          ...prev,
          disabled: false,
          fileError: false,
        }));
      } else {
        general.setSubmitChatProperties((prev) => ({
          ...prev,
          disabled: false,
          fileError: true,
        }));
      }

      if (message && file) {
        console.log("Both submitted successfully");
        general.setChatMessage("");
        general.setChatFiles([]);
        general.setParentChatProperties({
          parentID: "",
          parentName: "",
          parentMessage: "",
          chatRoomID: "",
        });
        general.setSubmitChatProperties((prev) => ({
          ...prev,
          disabled: false,
          error: false,
          messageError: false,
          fileError: false,
          chatRoomID: "",
        }));
      }

      if (!(message && file)) {
        general.setSubmitChatProperties((prev) => ({
          ...prev,
          disabled: false,
          error: true,
        }));
      }

      // general.setRefreshState((prev) => !prev);
    }
  };

  const intervalHandler = () => {
    const interval = setInterval(() => {
      const _url = `${url}/chats/${general.toBase64(
        JSON.parse(sessionStorage.getItem("chatRoom"))?.ChatRoomID
      )}`;
      axios
        .get(_url)
        .then((response) => {
          if (response?.data?.length > 0) {
            setNewChats(response?.data);
            // console.log(response?.data);
            // console.log(
            //   JSON.parse(sessionStorage.getItem("chatRoom"))?.ChatRoomID
            // );
          }
        })
        .catch((e) => {});
    }, 10000);
    setIntervalId(interval);
  };

  const removeParentChat = () => {
    general.setParentChatProperties({
      parentID: "",
      parentName: "",
      parentMessage: "",
      chatRoomID: "",
    });
  };

  useEffect(() => {
    getChatRoom();
    setChatRoomProfile({ ...JSON.parse(sessionStorage.getItem("chatRoom")) });
    refreshMessage();
  }, [general.refreshState]);

  useEffect(() => {
    intervalHandler();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setChats(newChats);
    // console.log("There is a new chat");
  }, [newChats]);

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
                {Object.keys(chatRoomProfile).length > 0 &&
                chatRoomProfile?.IsOnline
                  ? "Online"
                  : Object.keys(chatRoomProfile).length > 0 &&
                    !chatRoomProfile?.IsOnline
                  ? `Last seen ${date.getFullYear()}/${
                      date.getMonth() + 1
                    }/${date.getDate()}`
                  : "Online"}
              </p>
            </div>
          </div>
        </div>
        <div className={css["platform"]}>
          {/* CHAT PLATFORM GOES IN HERE... */}
          {loading ? (
            <Loader />
          ) : error ? (
            <ServerError />
          ) : (
            <>
              {chats.length < 1 && <NoChatsAvailable />}
              {chats.map((eachChat, i) => {
                return (
                  <div>
                    {eachChat?.Author?.AuthorID === userID ? (
                      <MyChats chat={eachChat} key={i} />
                    ) : (
                      <TheirChats chat={eachChat} key={i} />
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
        {general.parentChatProperties.chatRoomID ===
          chatRoomProfile?.ChatRoomID &&
        general.parentChatProperties.parentID !== null &&
        general.parentChatProperties.parentID !== "" ? (
          <div className={css["parent-chat"]}>
            <div className={css["replied-message"]}>
              <div>
                <em className={css["parent-author"]}>
                  {general.parentChatProperties?.parentName}
                </em>
                <em className={css["parent-message"]}>
                  {general.parentChatProperties?.parentMessage}
                </em>
              </div>
              <div onClick={removeParentChat} className={css["remove-parent"]}>
                X
              </div>
            </div>
          </div>
        ) : null}
        <div className={css.form}>
          {general.chatFiles.length > 0 ? (
            <div className={css["files-container"]}>
              {general.chatFiles.map((file, i) => (
                <div
                  onClick={() => {
                    removeFileHandler(file?.name);
                  }}
                  key={i}
                >
                  {file?.name}
                </div>
              ))}
            </div>
          ) : null}
          <Form>
            <div className={css["form-parent"]}>
              <div className={css["l-side"]}>
                <FormGroup
                  icon={`fa-solid fa-face-smile ${css.cursor} ${css["icon-hover"]}`}
                  placeholder="Enter message..."
                  value={general.chatMessage}
                  onChange={(e) => {
                    general.setChatMessage(e?.target?.value);
                  }}
                />
              </div>
              <label htmlFor="file_upload">
                <input
                  type="file"
                  name="file_upload"
                  onChange={addFileHandelr}
                  id="file_upload"
                  hidden
                />
                <div className={css.middle}>
                  <i className="fa-solid fa-paperclip"></i>
                </div>
              </label>
              {general.chatMessage !== null && general.chatMessage !== "" ? (
                <>
                  {general.submitChatProperties.disabled ? (
                    "Loading..."
                  ) : (
                    <div className={css["r-side"]}>
                      <button
                        onClick={onSubmitHandler}
                        disabled={general.submitChatProperties.disabled}
                      >
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </Form>
          {general.submitChatProperties.chatRoomID ===
            chatRoomProfile.ChatRoomID && (
            <div style={{ width: "100%" }} align="center">
              {general.submitChatProperties.messageError && (
                <p className="error">There was an error in sending your chat</p>
              )}
              {general.submitChatProperties.fileError && (
                <p className="error">
                  There was an error in sending the files of your chat
                </p>
              )}
              {general.submitChatProperties.error && (
                <p className="error">Could not send chat</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatBlock;

//4Y2ARXhpZgAATU0A
//4Y2ARXhpZgAATU0A
