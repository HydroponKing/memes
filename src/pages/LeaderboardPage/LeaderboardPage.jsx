import { useState, useEffect } from "react";
import styles from "./LeaderboardPage.module.css";
import { useNavigate } from "react-router-dom";

export function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://wedev-api.sky.pro/api/leaderboard")
      .then(response => response.json())
      .then(data => {
        setLeaders(data.leaders);
      })
      .catch(error => {
        console.error("Ошибка при получении списка лидеров:", error);
      });
  }, []);

  // Обработчик нажатия на кнопку
  const handleStartGame = () => {
    navigate("/"); // Выполняем переход на главную страницу
  };

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
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader, index) => (
            <tr key={leader.id}>
              <td>{`# ${index + 1}`}</td>
              <td>{leader.name}</td>
              <td>{formatTime(leader.time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Функция для форматирования времени в минуты и секунды
function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
