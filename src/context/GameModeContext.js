import { createContext, useState, useEffect } from "react";

export const GameModeContext = createContext({
  livesMode: false,
  setLivesMode: () => {},
});

export function GameModeProvider({ children }) {
  const [livesMode, setLivesMode] = useState(() => {
    const savedMode = localStorage.getItem("livesMode");
    return savedMode === "true";
  });

  useEffect(() => {
    localStorage.setItem("livesMode", livesMode);
  }, [livesMode]);

  return <GameModeContext.Provider value={{ livesMode, setLivesMode }}>{children}</GameModeContext.Provider>;
}
