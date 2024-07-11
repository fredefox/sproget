import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as Sample from "./sample.html";

const main = () => {
  console.log({ Sample });
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

main();
