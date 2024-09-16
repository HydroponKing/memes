import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { GameModeProvider } from "./context/GameModeContext"; // Импортируем обновленный провайдер

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  return (
    <GameModeProvider>
      <RouterProvider router={router} />
    </GameModeProvider>
  );
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
