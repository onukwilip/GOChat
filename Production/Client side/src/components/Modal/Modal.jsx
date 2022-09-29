import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { General } from "../../context/GeneralContext";
import { Button } from "../Button/Button";
import { Form, FormGroup } from "../Form/Form";
import Glassmorphism from "../Glassmorphism/Glassmorphism";
import css from "./Modal.module.css";

const RemoveFella = ({ items }) => {
  const general = useContext(General);
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    state: false,
    message: "",
  });
  const apiPrefix = general.domain;
  const config = general.config;
  const url = apiPrefix + `api/chatroom`;
  const [disabled, setDisabled] = useState(false);

  const blockFella = async () => {
    const ip = await axios
      .get("https://geolocation-db.com/json/")
      .catch((e) => {
        console.log(e);
      });

    const base64IP = general.toBase64(ip?.data?.IPv4);
    const base64Password = general.toBase64(password);

    const response = await axios.delete(
      `${url}/${items?.From_ID}/${items?.To_ID}/${base64IP}/${base64Password}/block`,
      { ...config }
    );

    if (response) {
      if (response.data.ResponseCode == 200) {
        setError({
          state: false,
          message: "",
        });

        general.setModalState("false");
        sessionStorage.setItem("modalState", "false");
        sessionStorage.removeItem("componentToRender");
      } else {
        setError({
          state: true,
          message: "Incorrect password!",
        });
      }
    }

    console.log(response);
    general.setRefreshState((prev) => !prev);
  };

  return (
    <>
      <div className={css["remove-fella"]}>
        <p className={css.header}>
          Removing this fella will delete the chatroom you both share and all
          it's contents including it's members. Are you sure you wan't to go on
          with it, if yes input your password else just cancel
        </p>
        <Form>
          <FormGroup
            icon="fa fa-key"
            placeholder="Enter your password to continue"
            value={password}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {error.state && <p className="error">{error.message}</p>}

          <Button className={css["btn-danger"]} onClick={blockFella}>
            <i className="fa-solid fa-ban"></i>
            Block Fella
          </Button>
        </Form>
      </div>
    </>
  );
};

const Modal = () => {
  const general = useContext(General);
  const [componentToRender, setComponentToRender] = useState({
    ...JSON.parse(sessionStorage.getItem("componentToRender")),
  });

  useEffect(() => {
    setComponentToRender({
      ...JSON.parse(sessionStorage.getItem("componentToRender")),
    });
    return () => {};
  }, [general.refreshState]);

  return (
    <>
      <div className={css.modal}>
        <div
          className={css.bg}
          onClick={() => {
            general.setModalState("false");
            sessionStorage.setItem("modalState", "false");
            sessionStorage.removeItem("componentToRender");
          }}
        ></div>
        <Glassmorphism className={css.body}>
          {componentToRender.component === "RemoveFella" && (
            <>
              <RemoveFella items={componentToRender.values} />
            </>
          )}
        </Glassmorphism>
      </div>
    </>
  );
};

export default Modal;
