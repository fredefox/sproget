import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import * as App from "./App";

const main = () => {
  const $root = document.getElementById("root");
  $root &&
    ReactDOM.createRoot($root).render(
      <React.StrictMode>
        <App.App />
      </React.StrictMode>,
    );
};

main();
