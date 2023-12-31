import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ControleProvider } from "./contexts/control.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ControleProvider>
      <App />
    </ControleProvider>
  </React.StrictMode>
);
