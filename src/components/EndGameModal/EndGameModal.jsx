import { useState, useContext } from "react";
import styles from "./EndGameModal.module.css";
import { Button } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link } from "react-router-dom";
import { GameModeContext } from "../../context/GameModeContext"; // Импортируем контекст

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, isSuperPowerUsed }) {
  const [playerName, setPlayerName] = useState("");
  const { livesMode } = useContext(GameModeContext); // Получаем данные из контекста

  const title = isWon ? "Вы попали\nна Лидерборд!" : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const handleSubmit = () => {
    const name = playerName || "Пользователь";
    const totalTime = gameDurationMinutes * 60 + gameDurationSeconds;

    // Определяем достижения
    const achievements = [];
    if (!livesMode) achievements.push(1); // Сложный уровень (без трех жизней)
    if (!isSuperPowerUsed) achievements.push(2); // Не использовалась суперсила

    console.log("Отправляем данные:", { name, time: totalTime, achievements });

    // Отправляем данные в формате JSON без заголовка Content-Type
    fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
      method: "POST",
      body: JSON.stringify({
        name,
        time: totalTime,
        achievements, // Передаем массив достижений
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Лидер добавлен:", data); // Лог для проверки результата
        onClick(); // Закрытие модального окна
      })
      .catch(error => {
        console.error("Ошибка при добавлении лидера:", error);
      });
  };

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      <input
        className={styles.input}
        type="text"
        placeholder="Пользователь"
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
      />
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart(2, "0")}:{gameDurationSeconds.toString().padStart(2, "0")}
      </div>
      {isWon && (
        <>
          <Button onClick={handleSubmit}>Отправить результат</Button>
        </>
      )}
      {!isWon && <Button onClick={onClick}>Начать сначала</Button>}
      <Link to="/leaderboard" className={styles.leaderboardLink}>
        Перейти к лидерборду
      </Link>
    </div>
  );
}
