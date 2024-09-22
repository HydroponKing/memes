import { useParams } from "react-router-dom";
import { Cards } from "../../components/Cards/Cards";
import { useEffect, useState } from "react"; // Добавляем useState для супер-силы

export function GamePage() {
  const { pairsCount } = useParams();
  const [isSuperPowerUsed, setIsSuperPowerUsed] = useState(false); // Добавляем состояние для отслеживания использования супер-силы

  // Функция для отправки результата в API
  const sendResultToLeaderboard = (name, time) => {
    const result = {
      name,
      time,
      level: pairsCount / 3, // предположим, что level = количество пар / 3
    };

    fetch("https://wedev-api.sky.pro/api/leaderboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result), // JSON всё ещё отправляется, но теперь с заголовком
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

  // Функция для активации супер-силы
  const handleSuperPowerClick = () => {
    if (!isSuperPowerUsed) {
      setIsSuperPowerUsed(true); // Ставим флаг, что супер-сила была использована
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <button
          onClick={handleSuperPowerClick}
          disabled={isSuperPowerUsed}
          style={{
            width: "50px",
            height: "50px",
            backgroundImage: 'url("/mnt/data/Group 1077240074.svg")',
            backgroundSize: "cover",
            border: "none",
            cursor: "pointer",
            opacity: isSuperPowerUsed ? 0.5 : 1,
          }}
          title="Использовать супер-силу"
        />
      </div>

      <Cards
        pairsCount={parseInt(pairsCount, 10)}
        previewSeconds={5}
        isSuperPowerUsed={isSuperPowerUsed} // Передаем состояние супер-силы в Cards
      />
    </>
  );
}
