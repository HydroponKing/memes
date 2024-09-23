import { shuffle } from "lodash";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { GameModeContext } from "../../context/GameModeContext";
import { ReactComponent as PowerIcon } from "../../components/EndGameModal/images/power.svg";

// Константы статусов игры
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(secondsElapsed) {
  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  return {
    minutes,
    seconds,
  };
}

export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const { livesMode } = useContext(GameModeContext);

  // Состояние для игровых карт
  const [cards, setCards] = useState([]);
  const [initialCardsState, setInitialCardsState] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
  const [intervalId, setIntervalId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuperPowerUsed, setIsSuperPowerUsed] = useState(false);

  const initialLives = livesMode ? 3 : 1;
  const [lives, setLives] = useState(initialLives);
  const [selectedCards, setSelectedCards] = useState([]);

  // Обновляем количество жизней при изменении режима игры
  useEffect(() => {
    setLives(initialLives);
  }, [initialLives]);

  // Функция для завершения игры
  function finishGame(gameStatus = STATUS_LOST) {
    setStatus(gameStatus);
    clearInterval(intervalId);
  }

  // Функция для старта игры
  function startGame() {
    setStatus(STATUS_IN_PROGRESS);
    setSecondsElapsed(0);
    setSelectedCards([]);
    setIsProcessing(false);
    setIsSuperPowerUsed(false);
    setTimer(getTimerValue(0));

    const newIntervalId = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    setIntervalId(newIntervalId);
  }

  useEffect(() => {
    if (status === STATUS_IN_PROGRESS) {
      setTimer(getTimerValue(secondsElapsed));
    }
  }, [secondsElapsed, status]);

  // Функция для перезапуска игры
  function resetGame() {
    setStatus(STATUS_PREVIEW);
    setSecondsElapsed(0);
    setTimer({ minutes: 0, seconds: 0 });
    setSelectedCards([]);
    setIsProcessing(false);
    setIsSuperPowerUsed(false);
    clearInterval(intervalId);
  }

  const openCard = clickedCard => {
    if (isProcessing || clickedCard.open) {
      return;
    }

    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }
      return { ...card, open: true };
    });

    setCards(nextCards);
    const nextSelectedCards = [...selectedCards, clickedCard];
    setSelectedCards(nextSelectedCards);

    if (nextSelectedCards.length === 2) {
      setIsProcessing(true);
      const [firstCard, secondCard] = nextSelectedCards;
      const isMatch = firstCard.rank === secondCard.rank && firstCard.suit === secondCard.suit;

      if (isMatch) {
        setSelectedCards([]);
        const isPlayerWon = nextCards.every(card => card.open);
        if (isPlayerWon) {
          finishGame(STATUS_WON);
        }
        setIsProcessing(false);
      } else {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives === 0) {
          finishGame(STATUS_LOST);
        } else {
          setTimeout(() => {
            setCards(currentCards =>
              currentCards.map(card => {
                if (card.id === firstCard.id || card.id === secondCard.id) {
                  return { ...card, open: false };
                }
                return card;
              }),
            );
            setSelectedCards([]);
            setIsProcessing(false);
          }, 1000);
        }
      }
    }
  };

  const handleSuperPower = () => {
    if (!isSuperPowerUsed) {
      setIsSuperPowerUsed(true);
      setInitialCardsState(cards);

      const openedCards = cards.map(card => ({ ...card, open: true }));
      setCards(openedCards);

      clearInterval(intervalId);

      setTimeout(() => {
        setCards(initialCardsState);
        const newIntervalId = setInterval(() => {
          setSecondsElapsed(prev => prev + 1);
        }, 1000);
        setIntervalId(newIntervalId);
      }, 5000);
    }
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;
  const navigate = useNavigate();

  useEffect(() => {
    if (status !== STATUS_PREVIEW) {
      return;
    }

    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    const deck = shuffle(generateDeck(pairsCount));
    setCards(deck);
    setInitialCardsState(deck);

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  const handleStartGame = () => {
    navigate("/"); // Выполняем переход на главную страницу
  };

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
              <div className={`${styles.lives} ${lives === 1 ? styles.livesCritical : ""}`}>
                <p>Жизни: {lives}</p>
              </div>
            )}
            <Button onClick={resetGame}>Начать заново</Button>
            <div className={styles.superPowerContainer}>
              <button onClick={handleSuperPower} disabled={isSuperPowerUsed} className={styles.superPowerButton}>
                <PowerIcon width="68" height="68" />
              </button>
              <div className={styles.tooltip}>
                <div className={styles.title}>Прозрение</div>
                <p>На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.</p>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS || card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>
      <button className={styles.buttonEsc} onClick={handleStartGame}>
        Вернуться к выбору режима
      </button>
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
