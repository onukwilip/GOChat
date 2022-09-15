import React from "react";
import css from "./Navbar.module.css";
import dummy from "../../../assets/images/dummy-img.png";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("GO_Media_UserId");
    localStorage.removeItem("GO_Media_UserName");
    navigate("/", { replace: true });
  };
  return (
    <>
      <section className={css.navbar}>
        <div className={css["l-side"]}>
          <div className={css["img-container"]}>
            <img src={dummy} alt="img" />
          </div>

          <NavLink
            to="/chat/contacts"
            className={({ isActive }) => (isActive ? css.active : "")}
          >
            <div>
              <i className="fa fa-circle-user" aria-hidden="true"></i>
            </div>
          </NavLink>

          <NavLink
            to="/chat/messages"
            className={({ isActive }) => (isActive ? css.active : "")}
          >
            <div>
              <i className="fa-regular fa-message"></i>
            </div>
          </NavLink>

          <NavLink
            to="/chat/notifications"
            className={({ isActive }) => (isActive ? css.active : "")}
          >
            <div>
              <i class="fa-regular fa-bell"></i>
            </div>
          </NavLink>
        </div>
        <div className={css["r-side"]}>
          <NavLink
            to="/chat/settings"
            className={({ isActive }) => (isActive ? css.active : "")}
          >
            <div>
              <i className="fa-solid fa-gear"></i>
            </div>
          </NavLink>

          <div className={css["power-container"]} onClick={logOut}>
            <i className={`fa-solid fa-power-off ${css.power}`}></i>
          </div>
        </div>
      </section>
    </>
  );
};

export default Navbar;
