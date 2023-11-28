import React from "react";
import ReactDOM from "react-dom/client";
import ContentScript from "./ContentScript.tsx";
import "../index.css";

const root = document.createElement("div");
root.id = "chatgpt-content-script-root";

document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ContentScript />
  </React.StrictMode>
);
