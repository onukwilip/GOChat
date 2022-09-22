import React, { useContext, useEffect, useState } from "react";
import css from "./User.module.css";
import dummy from "../../../assets/images/dummy-img.png";
import axios from "axios";
import { General } from "../../../context/GeneralContext";
import { useParams } from "react-router-dom";
import { Form, FormGroup } from "../../Form/Form";
import { Button } from "../../Button/Button";
import Loader from "../../Loader/Loader";
import ServerError from "../../ServerError/ServerError";

const Profile = ({ user }) => {
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <>
      <div className={css.profile}>
        <div className={css["img-container"]}>
          <img
            src={user?.ProfilePicture ? user?.ProfilePicture : dummy}
            alt=""
          />
        </div>
        <div className={css.name}>
          <p>
            <em>{user?.UserName ? user?.UserName : "John Doe"}</em>
            <em>
              {user?.Description
                ? user?.Description
                : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam minus, alias recusandae amet temporibus ut veritatis placeat iste quo molestiae."}
            </em>
          </p>
        </div>
        <div className={css["stats-container"]}>
          <div className={css.stats}>
            <div className={css["stat-child"]}>
              <p>
                <em>134</em>
                <em>Fellas</em>
              </p>
            </div>
            <div className={css["stat-child"]}>
              <p>
                <em>1000</em>
                <em>Chats</em>
              </p>
            </div>
            <div className={css["stat-child"]}>
              <p>
                <em>10</em>
                <em>Groups</em>
              </p>
            </div>
          </div>
        </div>
        {user.UserID !== localStorage.getItem("UserId") && (
          <div className={css["btn-container"]}>
            <Button>
              <i className="fa-solid fa-user-plus"></i>
              Add fella
            </Button>
            <Button className={css["btn-danger"]}>
              <i className="fa-solid fa-ban"></i>
              Remove fella
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

const Accordion = (props) => {
  const [body, setBody] = useState(false);
  return (
    <>
      <div className={css.accordion}>
        <div className={css["tab-container"]}>
          <div
            className={css.tab}
            onClick={() => {
              setBody((prev) => !prev);
            }}
          >
            <div className={css["icon-container"]}>
              <i className={`${props.icon} ${props.iconClass}`}></i>
            </div>
            <div className={css.details}>
              <em>{props.title}</em>
              <em>{props.details}</em>
            </div>
            <div className={`${css["icon-container"]} ${css.next}`}>
              <i className="fa fa-greater-than"></i>
            </div>
          </div>
        </div>
        {body && <div className={css.body}>{props.children}</div>}
      </div>
    </>
  );
};

const EditUser = ({ user }) => {
  const general = useContext(General);
  const userApiRoute = `${general.domain}api/user/`;
  const config = { ...general.config };
  const [userDetailsDisabled, setUserDetailsDisabled] = useState(false);
  const [passwordDisabled, setPasswordDisabled] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState({
    state: false,
    message: "",
  });

  const [passwordError, setPasswordError] = useState({
    state: false,
    message: "",
  });

  const [accountDetails, setAccountDetails] = useState({
    UserName: user?.UserName,
    Email: user?.Email,
    Description: user?.Description,
    ProfilePicture: "",
  });

  const [passwordDetails, setPasswordDetails] = useState({
    OldPassword: "",
    NewPassword: "",
    RetypePassword: "",
  });
  const [src, setSrc] = useState(user?.ProfilePicture);

  const fileOnChangeHandler = (e) => {
    setAccountDetails((prev) => ({
      ...prev,
      ProfilePicture: e.target.files[0],
    }));
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (arg) => {
      setSrc(arg.target.result);
    };

    reader.readAsDataURL(file);
  };

  const UserDetilsHandler = (ip) => {
    setUserDetailsDisabled(true);

    const body = {
      ...accountDetails,
      ProfilePicture: "",
    };

    axios
      .put(
        `${userApiRoute}${user.UserID}/${general.toBase64(ip.data.IPv4)}/`,
        body,
        { ...config }
      )
      .then((res) => {
        console.log("User details", res.data);
        setUserDetailsDisabled(false);
      })
      .catch();
  };

  const FromDataHandler = (ip) => {
    const _config = {
      ...config,
      headers: {
        "Content-type": "multipart/formdata",
        "Access-control-allow-origin": "*",
      },
    };

    if (
      accountDetails.ProfilePicture !== undefined &&
      accountDetails.ProfilePicture !== "" &&
      accountDetails.ProfilePicture !== null
    ) {
      const formData = new FormData();
      formData.append("body", accountDetails.ProfilePicture);

      axios
        .put(
          `${userApiRoute}file/${user.UserID}/${general.toBase64(
            ip.data.IPv4
          )}`,
          formData,
          { ..._config }
        )
        .then((res) => {
          console.log("Form data", res.data);
        })
        .catch();
    }
  };

  const userDetailsSubmitHandler = async () => {
    const ip = await axios.get("https://geolocation-db.com/json/");

    UserDetilsHandler(ip);
    FromDataHandler(ip);

    general.setRefreshState((prev) => !prev);
  };

  const changePasswordSubmitHandler = async () => {
    setPasswordDisabled(true);
    const ip = await axios.get("https://geolocation-db.com/json/");
    const url = `${userApiRoute}password/${user?.UserID}/${general.toBase64(
      ip.data.IPv4
    )}`;
    const body = {
      ...passwordDetails,
    };

    if (passwordDetails.NewPassword === passwordDetails.RetypePassword) {
      const response = await axios.put(url, body, config);
      if (response) {
        setPasswordDisabled(false);
        if (response.data.ResponseCode === 400) {
          setPasswordError({
            state: true,
            message: "*Old password is not correct",
          });
        }
      }
      console.log("Password response", response.data);
    } else {
      setPasswordDisabled(false);

      console.log(
        "Password response: New password and retype password MUST match"
      );
      setPasswordError({
        state: true,
        message: "*Password and retype password must match...",
      });
    }

    setPasswordDetails({
      OldPassword: "",
      NewPassword: "",
      RetypePassword: "",
    });
  };

  useEffect(() => {
    setAccountDetails({
      UserName: user?.UserName,
      Email: user?.Email,
      Description: user?.Description,
      ProfilePicture: "",
    });
    console.log(user?.Description);
    // setSrc(user?.ProfilePicture);
    return () => {};
  }, []);

  return (
    <div className={css["edit-user"]}>
      <Form onSubmit={userDetailsSubmitHandler}>
        {accountDetails.ProfilePicture === undefined ||
        accountDetails.ProfilePicture === "" ||
        accountDetails.ProfilePicture === null ? (
          <label className={css["img-upload"]}>
            <input type="file" hidden onChange={fileOnChangeHandler} />
            <div>
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <h3>Upload profile picture</h3>
          </label>
        ) : (
          <div className={css["img-container"]}>
            <img src={src} alt="" />
            <label>
              <input type="file" hidden onChange={fileOnChangeHandler} />
              <i className="fa fa-pencil"></i>
            </label>
          </div>
        )}

        <FormGroup
          icon="fa fa-user"
          value={accountDetails.UserName}
          onChange={(e) => {
            setAccountDetails((prev) => ({
              ...prev,
              UserName: e.target.value,
            }));
          }}
          placeholder="Enter Username..."
          disabled={userDetailsDisabled}
        />
        <FormGroup
          icon="fa fa-envelope"
          value={accountDetails.Email}
          onChange={(e) => {
            setAccountDetails((prev) => ({
              ...prev,
              Email: e.target.value,
            }));
          }}
          placeholder="Enter Email..."
          disabled={userDetailsDisabled}
        />
        <FormGroup
          type="textarea"
          onChange={(e) => {
            setAccountDetails((prev) => ({
              ...prev,
              Description: e.target.value,
            }));
          }}
          placeholder="Tell us about yourself..."
          disabled={userDetailsDisabled}
        >
          {user?.Description}
        </FormGroup>
        <Button disabled={userDetailsDisabled}>
          {userDetailsDisabled ? "Updating..." : "Update"}
        </Button>
      </Form>

      <Form onSubmit={changePasswordSubmitHandler}>
        <div className={css.password}>
          <h3>Change Password</h3>
          <FormGroup
            icon="fa fa-key"
            onChange={(e) => {
              setPasswordDetails((prev) => ({
                ...prev,
                OldPassword: e.target.value,
              }));
            }}
            placeholder="Old password..."
            type="password"
            required={true}
            value={passwordDetails.OldPassword}
          />
          <FormGroup
            icon="fa fa-key"
            onChange={(e) => {
              setPasswordDetails((prev) => ({
                ...prev,
                NewPassword: e.target.value,
              }));
            }}
            placeholder="New password..."
            type="password"
            required={true}
            value={passwordDetails.NewPassword}
          />
          <FormGroup
            icon="fa fa-key"
            onChange={(e) => {
              setPasswordDetails((prev) => ({
                ...prev,
                RetypePassword: e.target.value,
              }));
            }}
            placeholder="Retype password..."
            type="password"
            required={true}
            value={passwordDetails.RetypePassword}
          />
          {passwordError.state ? (
            <p className="error" style={{ textAlign: "center", width: "100%" }}>
              {passwordError.message}
            </p>
          ) : null}
          <Button disabled={passwordDisabled}>
            {passwordDisabled ? "Updating..." : "Change"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

const Settings = ({ user }) => {
  return (
    <>
      <div className={css.settings}>
        <div className={css.header}>
          <h1>Settings</h1>
        </div>
        <div className={css.accordions}>
          <Accordion
            title="My Account"
            details="Update your profile details"
            icon="fa fa-user"
          >
            <EditUser user={user} />
          </Accordion>
          <Accordion
            title="Appearance"
            details="Customise the look of GOChat"
            icon="fa fa-pen-fancy"
          ></Accordion>
        </div>
      </div>
    </>
  );
};

const User = () => {
  const [user, setUser] = useState({});
  const general = useContext(General);
  const { userid } = useParams("userid");
  const _userid = general.fromBase64(userid);
  const apiPrefix = general.domain;
  const config = general.config;
  const url = apiPrefix + `api`;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getUser = async () => {
    setLoading(true);
    setError(false);

    const ip = await axios.get("https://geolocation-db.com/json/");

    const _url = `${url}/user/${_userid}`;
    const res = await axios.get(_url).catch(() => {
      setLoading(false);
      setError(true);
    });
    const data = res.data.Data;
    data.map((_user) => {
      setUser(_user);
      setLoading(false);
      setError(false);
    });
  };

  useEffect(() => {
    getUser();
    return () => {};
  }, [userid, general.refreshState]);
  return (
    <>
      {loading ? (
        <div className={css["loading-container"]}>
          <Loader />
        </div>
      ) : error ? (
        <div className={css["loading-container"]}>
          <ServerError />
        </div>
      ) : (
        <section className={css.user}>
          <div className={css.profile}>
            <Profile user={user} />
          </div>
          {user.UserID === localStorage.getItem("UserId") && (
            <div className={css.setting}>
              <Settings user={user} />
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default User;
