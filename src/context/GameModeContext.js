// context/GameModeContext.js
import { createContext, useState, useEffect } from "react";

export const GameModeContext = createContext({
  livesMode: false,
  usedSuperpower: false,
  setLivesMode: () => {},
  setUsedSuperpower: () => {},
});

export function GameModeProvider({ children }) {
  const [livesMode, setLivesMode] = useState(() => {
    const savedMode = localStorage.getItem("livesMode");
    return savedMode === "true";
  });

  const [usedSuperpower, setUsedSuperpower] = useState(false);

  useEffect(() => {
    localStorage.setItem("livesMode", livesMode);
  }, [livesMode]);

  return (
    <GameModeContext.Provider value={{ livesMode, usedSuperpower, setLivesMode, setUsedSuperpower }}>
      {children}
    </GameModeContext.Provider>
  );
}
