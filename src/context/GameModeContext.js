// src/GameModeContext.js

import { createContext } from "react";

export const GameModeContext = createContext({
  livesMode: false, // false - оригинальный режим, true - режим с тремя жизнями
  setLivesMode: () => {},
});
