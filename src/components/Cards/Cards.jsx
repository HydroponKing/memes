// src/components/Cards/Cards.jsx

import { shuffle } from "lodash";
import { useEffect, useState, useContext } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { GameModeContext } from "../../context/GameModeContext";

// Константы статусов игры
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const { livesMode } = useContext(GameModeContext); // Используем контекст

  // Состояние для игровых карт
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);
  // Дата начала и окончания игры
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  // Состояние таймера
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });
  // Количество оставшихся жизней
  const initialLives = livesMode ? 3 : 1;
  const [lives, setLives] = useState(initialLives);
  // Выбранные в данный момент карты
  const [selectedCards, setSelectedCards] = useState([]);
  // Флаг для блокировки кликов во время проверки пар
  const [isProcessing, setIsProcessing] = useState(false);

  // Обновляем количество жизней при изменении режима игры
  useEffect(() => {
    setLives(initialLives);
  }, [initialLives]);

  // Функция для завершения игры
  function finishGame(gameStatus = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(gameStatus);
  }

  // Функция для старта игры
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
    setLives(initialLives);
    setSelectedCards([]);
    setIsProcessing(false);
  }

  // Функция для перезапуска игры
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setLives(initialLives);
    setSelectedCards([]);
    setIsProcessing(false);
  }

  /**
   * Обработка открытия карты
   */
  const openCard = clickedCard => {
    if (isProcessing || clickedCard.open) {
      return;
    }

    // Открываем кликнутую карту
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    // Добавляем карту в выбранные
    const nextSelectedCards = [...selectedCards, clickedCard];
    setSelectedCards(nextSelectedCards);

    if (nextSelectedCards.length === 2) {
      setIsProcessing(true);
      const [firstCard, secondCard] = nextSelectedCards;

      const isMatch = firstCard.rank === secondCard.rank && firstCard.suit === secondCard.suit;

      if (isMatch) {
        // Карты совпали
        setSelectedCards([]);

        // Проверяем, выиграл ли игрок
        const isPlayerWon = nextCards.every(card => card.open);
        if (isPlayerWon) {
          finishGame(STATUS_WON);
        }
        setIsProcessing(false);
      } else {
        // Карты не совпали
        const nextLives = lives - 1;
        setLives(nextLives);

        if (nextLives === 0) {
          // Жизни закончились, игрок проиграл
          finishGame(STATUS_LOST);
          setIsProcessing(false);
        } else {
          // Закрываем карты обратно после задержки
          setTimeout(() => {
            setCards(currentCards =>
              currentCards.map(card => {
                if (card.id === firstCard.id || card.id === secondCard.id) {
                  return {
                    ...card,
                    open: false,
                  };
                }
                return card;
              }),
            );
            setSelectedCards([]);
            setIsProcessing(false);
          }, 1000); // Задержка в 1 секунду
        }
      }
    }
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Инициализация игры
  useEffect(() => {
    if (status !== STATUS_PREVIEW) {
      return;
    }

    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновление таймера
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart(2, "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart(2, "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? (
          <>
            {livesMode && (
              <div className={styles.lives}>
                <p>Жизни: {lives}</p>
              </div>
            )}
            <Button onClick={resetGame}>Начать заново</Button>
          </>
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      ) : null}
    </div>
  );
}
