import React, { useContext, useEffect, useState } from "react";
import { SidebarSearch, UserMapComponents } from "../Sidebar/Sidebar";
import css from "./AllContacts.module.css";
import { users as allContacts, users } from "../../../dummyData";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { General } from "../../../context/GeneralContext";
import Loader from "../../Loader/Loader";
import ServerError from "../../ServerError/ServerError";

const AllContacts = () => {
  const navigate = useNavigate();
  const { status } = useParams();
  const [contacts, setContacts] = useState([]);
  const userId = localStorage.getItem("UserId");
  const general = useContext(General);
  const apiPrefix = general.domain;
  const config = general.config;
  const userUrl = apiPrefix + `api/user/all/${userId}`;
  const chatroomUrl = apiPrefix + `api/chatroom/`;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getAllUsers = async () => {
    setLoading(true);
    setError(false);
    const ip = await axios.get("https://geolocation-db.com/json/");

    if (status === "fellas") {
      axios
        .get(`${userUrl}/${general.toBase64(ip.data.IPv4)}`)
        .then((response) => {
          console.log(response.data);
          const users = response.data.Data;
          setContacts([...users]);
          setLoading(false);
          setError(false);
        })
        .catch(() => {
          setLoading(false);
          setError(true);
        });
    } else if (status === "groups") {
      axios
        .get(`${chatroomUrl}`)
        .then((response) => {
          console.log(response.data);
          const users = response.data.Data;
          if (users !== null) {
            setContacts([...users]);
          } else {
            setContacts([]);
          }
          setLoading(false);
          setError(false);
        })
        .catch((e) => {
          if (e.request) {
            setLoading(false);
            setError(true);
          } else {
            setLoading(false);
            setError(false);
          }
        });
    } else {
      axios
        .get(`${userUrl}/${general.toBase64(ip.data.IPv4)}`)
        .then((response) => {
          console.log(response.data);
          const users = response.data.Data;
          setContacts([...users]);
          setLoading(false);
          setError(false);
        })
        .catch(() => {
          setLoading(false);
          setError(true);
        });
    }
  };

  const selectFellas = async () => {};
  const selectGroups = async () => {};

  useEffect(() => {
    getAllUsers();
  }, [general.refreshState, status]);

  return (
    <div className={css["all-contacts"]}>
      <div className={css.search}>
        <SidebarSearch
          icon="fa fa-search"
          actionIcon="fa-solid fa-user-plus"
          placeholder="Search for people"
          all={false}
          active="Fellas"
          inActive="Groups"
          onActiveClick={selectFellas}
          onInActiveClick={selectGroups}
          onAllLink="/chat/all-contacts/"
          onActiveLink="/chat/all-contacts/fellas"
          onInActiveLink="/chat/all-contacts/groups"
          showOptions={true}
        />
      </div>
      <div className={css.users}>
        {loading ? (
          <Loader />
        ) : error ? (
          <>
            <ServerError />
          </>
        ) : (
          <>
            <UserMapComponents
              title="All Contacts"
              addUserIcon={true}
              profiles={contacts}
              addMessagesCount={false}
              notFoundMessage="No group was found..."
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AllContacts;
