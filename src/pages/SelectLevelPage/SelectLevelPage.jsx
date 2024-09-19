import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useContext } from "react";
import { GameModeContext } from "../../context/GameModeContext";

export function SelectLevelPage() {
  const { livesMode, setLivesMode } = useContext(GameModeContext);

  const handleCheckboxChange = event => {
    setLivesMode(event.target.checked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <label className={styles.checkboxContainer}>
          <input type="checkbox" checked={livesMode} onChange={handleCheckboxChange} />
          Режим с тремя жизнями
        </label>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <Link to="/leaderboard" className={styles.leaderboardLink}>
          Перейти к лидерборду
        </Link>
      </div>
    </div>
  );
}
