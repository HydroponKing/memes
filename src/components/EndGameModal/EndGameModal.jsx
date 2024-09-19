import { useState } from "react";
import styles from "./EndGameModal.module.css";
import { Button } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const [playerName, setPlayerName] = useState("");
  const title = isWon ? "Вы победили!" : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const handleSubmit = () => {
    const name = playerName || "Пользователь";
    const totalTime = gameDurationMinutes * 60 + gameDurationSeconds;

    console.log("Отправляем данные:", { name, time: totalTime });

    // Отправляем данные в формате JSON
    fetch("https://wedev-api.sky.pro/api/leaderboard", {
      method: "POST",
      headers: {
        // Убираем Content-Type, так как API требует это убрать
        // Не указываем заголовок Content-Type
      },
      body: JSON.stringify({ name, time: totalTime }), // Преобразуем данные в JSON
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
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart(2, "0")}:{gameDurationSeconds.toString().padStart(2, "0")}
      </div>
      {isWon && (
        <>
          <input
            className={styles.input}
            type="text"
            placeholder="Введите ваше имя"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
          />
          <Button onClick={handleSubmit}>Отправить результат</Button>
        </>
      )}
      {!isWon && <Button onClick={onClick}>Начать сначала</Button>}
    </div>
  );
}
