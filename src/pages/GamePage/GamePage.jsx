import { useParams } from "react-router-dom";
import { Cards } from "../../components/Cards/Cards";
import { useEffect, useContext } from "react";
import { GameModeContext } from "../../context/GameModeContext"; // Импортируем контекст для режимов игры

export function GamePage() {
  const { pairsCount } = useParams();
  const { livesMode, usedSuperpower } = useContext(GameModeContext); // Получаем режимы игры и использование суперсилы

  // Функция для отправки результата в API с ачивками
  const sendResultToLeaderboard = (name, time) => {
    const achievements = [];

    // Проверяем, играл ли пользователь в режиме без жизней
    if (!livesMode) achievements.push(1); // Если сложный режим (без трех жизней)

    // Проверяем, использовалась ли суперсила
    if (!usedSuperpower) achievements.push(2); // Если суперсила не использовалась

    const level = Math.floor(pairsCount / 3); // Рассчитываем уровень на основе количества пар

    // Проверим, что все значения корректны перед отправкой
    console.log("Отправляем результат:", {
      name,
      time,
      level,
      achievements,
    });

    const result = {
      name: name || "Пользователь", // Если имя не указано, используем "Пользователь"
      time: parseInt(time, 10), // Убедимся, что время передано как число
      level, // Уровень игры
      achievements, // Добавляем массив ачивок в запрос
    };

    // Отправляем POST-запрос без заголовка Content-Type
    fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
      method: "POST",
      body: JSON.stringify(result), // Преобразуем объект в строку JSON
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            console.error("Ошибка при добавлении результата:", errorData);
            throw new Error(`Ошибка HTTP: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log("Результат успешно добавлен:", data);
      })
      .catch(error => {
        console.error("Ошибка при добавлении результата:", error);
      });
  };

  // Пример эффекта для отправки данных при завершении игры
  useEffect(() => {
    const gameEnded = true; // Предположим, что игра завершена
    const playerName = "Игрок"; // Можно получить откуда-то имя игрока
    const gameTime = 120; // Время игры в секундах

    if (gameEnded) {
      sendResultToLeaderboard(playerName, gameTime);
    }
  }, [pairsCount]);

  return (
    <>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5} />
    </>
  );
}
