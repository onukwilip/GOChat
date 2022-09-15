import React from "react";
import css from "./TheirChats.module.css";
import image from "../../../../assets/images/dummy-img.png";
import Glassmorphism from "../../../Glassmorphism/Glassmorphism";

const TheirChats = ({ chat }) => {
  return (
    <div className={css["their-chats"]}>
      <div className={css.main}>
        <div className={css["img-container"]}>
          <img src={chat?.author?.authorImage} alt="" />
        </div>
        <div className={css["text-body"]}>
          <p className={css.name}>{chat?.author?.authorName}</p>
          <div style={{ maxWidth: "50%", minWidth: "200px" }} align="left">
            <div className={css["file-container"]}>
              {chat?.chatFile.length >= 1
                ? chat?.chatFile.map((eachFile, i) => (
                    <Glassmorphism className={css.file} key={i}>
                      <a>
                        <div className={css["file-icon-container"]}>
                          <i className="fas fa-file"></i>
                        </div>
                      </a>
                      <div className={css["file-details"]}>
                        <a
                          href={eachFile.path}
                          download={eachFile.fileName}
                          target="_blank"
                        >
                          <em className={css["file-name"]}>
                            {eachFile.fileName}
                          </em>
                        </a>
                        <em className={css["file-size"]}>
                          {eachFile.size} Kb file...
                        </em>
                      </div>
                    </Glassmorphism>
                  ))
                : null}
            </div>
            <Glassmorphism className={css.filter}>
              {chat.parent.parentId !== null && chat.parent.parentId !== "" ? (
                <a
                  href={`#${chat.parent.parentId}`}
                  className={css["replied-link"]}
                >
                  <div className={css["replied-message"]}>
                    <em className={css["parent-author"]}>
                      {chat?.parent.parentAuthor}
                    </em>
                    <em className={css["parent-message"]}>
                      {chat?.parent.parentMessage}
                    </em>
                  </div>
                </a>
              ) : null}
              <div className={css.message}>{chat?.message}</div>
            </Glassmorphism>
          </div>

          <div className={css.time}>
            {new Date(chat?.date).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheirChats;
