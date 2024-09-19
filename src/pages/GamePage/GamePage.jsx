import { useParams } from "react-router-dom";
import { Cards } from "../../components/Cards/Cards";
import { useEffect } from "react";

export function GamePage() {
  const { pairsCount } = useParams();

  // Пример функции для отправки результата в API
  const sendResultToLeaderboard = (name, time) => {
    const result = {
      name,
      time,
      level: pairsCount / 3, // предположим, что level = количество пар / 3
    };

    fetch("https://wedev-api.sky.pro/api/leaderboard", {
      method: "POST",
      body: JSON.stringify(result), // JSON всё ещё отправляется, но без указания заголовка
    })
      .then(response => response.json())
      .then(data => {
        console.log("Результат успешно добавлен:", data);
      })
      .catch(error => {
        console.error("Ошибка при добавлении результата:", error);
      });
  };

  // Пример эффекта для отправки данных при завершении игры
  useEffect(() => {
    // Это может быть любая логика завершения игры
    const gameEnded = true; // Предположим, что игра завершена
    const playerName = "Игрок"; // Можно получить откуда-то имя игрока
    const gameTime = 120; // Время игры в секундах

    if (gameEnded) {
      sendResultToLeaderboard(playerName, gameTime);
    }
  }, [pairsCount]); // Этот эффект будет срабатывать при изменении количества пар

  return (
    <>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5}></Cards>
    </>
  );
}
