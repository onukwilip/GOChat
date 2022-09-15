import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import GeneralContext from "./context/GeneralContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <GeneralContext>
      <App />
    </GeneralContext>
  </BrowserRouter>
);
