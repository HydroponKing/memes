// src/index.js

import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { GameModeContext } from "./context/GameModeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  const [livesMode, setLivesMode] = useState(false);

  return (
    <GameModeContext.Provider value={{ livesMode, setLivesMode }}>
      <RouterProvider router={router} />
    </GameModeContext.Provider>
  );
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
