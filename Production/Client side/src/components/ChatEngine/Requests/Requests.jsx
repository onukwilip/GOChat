import React, { useContext, useEffect, useState } from "react";
import css from "./Requests.module.css";
import { SidebarSearch, RequestMapComponents } from "../Sidebar/Sidebar";
import { users as allContacts, users } from "../../../dummyData";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { General } from "../../../context/GeneralContext";
import Loader from "../../Loader/Loader";
import ServerError from "../../ServerError/ServerError";

const Requests = () => {
  const navigate = useNavigate();
  const { status } = useParams();
  const [requests, setRequests] = useState([]);
  const userId = localStorage.getItem("UserId");
  const general = useContext(General);
  const apiPrefix = general.domain;
  const config = general.config;
  const baseUrl = apiPrefix + `api/requests/`;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getAllRequests = async () => {
    setLoading(true);
    setError(false);
    const ip = await axios.get("https://geolocation-db.com/json/");

    if (status === "sent") {
      axios
        .get(`${baseUrl}/sent/${userId}/${general.toBase64(ip.data.IPv4)}`)
        .then((response) => {
          console.log(response.data);
          const requests = response.data.Data;
          if (requests !== null) {
            setRequests([...requests]);
          } else {
            setRequests([]);
          }
          setLoading(false);
          setError(false);
          console.log("Sent Requests ", response.data.Data);
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
    } else if (status === "recieved") {
      axios
        .get(`${baseUrl}/recieved/${userId}/${general.toBase64(ip.data.IPv4)}`)
        .then((response) => {
          console.log(response.data);
          const requests = response.data.Data;
          if (requests !== null) {
            setRequests([...requests]);
          } else {
            setRequests([]);
          }
          setLoading(false);
          setError(false);
          console.log("Recieved Requests ", response.data.Data);
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
        .get(`${baseUrl}/sent/${userId}/${general.toBase64(ip.data.IPv4)}`)
        .then((response) => {
          console.log(response.data);
          const requests = response.data.Data;
          if (requests !== null) {
            setRequests([...requests]);
          } else {
            setRequests([]);
          }
          setLoading(false);
          setError(false);
          console.log("Sent Requests ", response.data.Data);
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
    }
  };

  const sent = async () => {
    const ip = await axios.get("https://geolocation-db.com/json/");

    axios
      .get(`${baseUrl}/sent/${userId}/${general.toBase64(ip.data.IPv4)}`)
      .then((response) => {
        console.log(response.data);
        const requests = response.data.Data;
        if (requests !== null) {
          setRequests([...requests]);
        } else {
          setRequests([]);
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
  };
  const recieved = async () => {
    const ip = await axios.get("https://geolocation-db.com/json/");

    axios
      .get(`${baseUrl}/recieved/${userId}/${general.toBase64(ip.data.IPv4)}`)
      .then((response) => {
        console.log(response.data);
        const requests = response.data.Data;
        if (requests !== null) {
          setRequests([...requests]);
        } else {
          setRequests([]);
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
  };

  useEffect(() => {
    getAllRequests();
  }, [general.refreshState, status]);

  return (
    <div className={css["all-requests"]}>
      <div className={css.search}>
        <SidebarSearch
          icon="fa fa-search"
          actionIcon="fa-solid fa-user-plus"
          placeholder="Search for people"
          all={false}
          active="Sent"
          inActive="Recieved"
          onActiveClick={sent}
          onInActiveClick={recieved}
          onAllLink="/chat/requests/"
          onActiveLink="/chat/requests/sent"
          onInActiveLink="/chat/requests/recieved"
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
            <RequestMapComponents
              title="Requests"
              addUserIcon={false}
              profiles={requests}
              addMessagesCount={false}
              notFoundMessage="No group was found..."
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Requests;
