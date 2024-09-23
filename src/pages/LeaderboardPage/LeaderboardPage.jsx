import { useState, useEffect } from "react";
import styles from "./LeaderboardPage.module.css";
import { useNavigate } from "react-router-dom";
import hardlvlon from "../../components/EndGameModal/images/hardlvlon.png";
import superpoweron from "../../components/EndGameModal/images/superpoweron.png";

export function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();

  // Убедитесь, что сортировка корректная и вся информация выводится
  useEffect(() => {
    fetch("https://wedev-api.sky.pro/api/v2/leaderboard")
      .then(response => response.json())
      .then(data => {
        const sortedLeaders = data.leaders.sort((a, b) => a.time - b.time).slice(0, 10); // Оставляем только топ-10 лидеров
        console.log("Топ-10 лидеров:", sortedLeaders); // Вывод топ-10 лидеров

        setLeaders(sortedLeaders); // Устанавливаем только топ-10 лидеров
      })
      .catch(error => {
        console.error("Ошибка при получении списка лидеров:", error);
      });
  }, []);

  const handleStartGame = () => {
    navigate("/");
  };

  const renderAchievements = (achievements = []) => (
    <div className={styles.achievements}>
      {achievements.includes(1) && (
        <img src={hardlvlon} alt="Hard level achievement" className={styles.achievementIcon} />
      )}
      {achievements.includes(2) && (
        <img src={superpoweron} alt="Superpower achievement" className={styles.achievementIcon} />
      )}
    </div>
  );

  return (
    <div className={styles.leaderboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Лидерборд</h1>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handleStartGame}>
            Начать игру
          </button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Позиция</th>
            <th>Пользователь</th>
            <th>Время</th>
            <th>Достижения</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader, index) => (
            <tr key={leader.id}>
              <td>{`#${index + 1}`}</td>
              <td>{leader.name}</td>
              <td>{formatTime(leader.time)}</td>
              <td>{renderAchievements(leader.achievements)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
