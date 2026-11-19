import {
  createGame,
  pickRandomWord,
  guessLetter,
  getRemainingAttempts,
  type GameState,
} from './game/engine';
import { renderBoard, renderKeyboard, showResult } from './ui/renderer';
import './style.css';

/**
 * счетчик побед и поражений
 */
interface Score {
  wins: number;
  losses: number;
}

/**
 * состояние приложения
 */
interface AppState {
  game: GameState;
  result: 'win' | 'lose' | null;
  score: Score;
}

/**
 * подгружаем счет
 */
function loadScore(): Score {
  const raw = localStorage.getItem('gallows_score');
  if (!raw) return { wins: 0, losses: 0 };
  try {
    return JSON.parse(raw) as Score;
  } catch {
    return { wins: 0, losses: 0 };
  }
}

/**
 * сохраняем счет
 */
function saveScore(score: Score): void {
  localStorage.setItem('gallows_score', JSON.stringify(score));
}

const appContainer = document.getElementById('app') as HTMLElement;
const state: AppState = {
  game: createGame(pickRandomWord()),
  result: null,
  score: loadScore(),
};

/**
 * синхронизирует UI с состоянием на сейчас
 */
function syncUI(): void {
  renderBoard(appContainer, state.game);
  renderKeyboard(
    appContainer.querySelector('.keyboard') as HTMLElement,
    state.game.guessedLetters,
    state.game.wrongLetters
  );
  showResult(
    appContainer.querySelector('.result-banner') as HTMLElement,
    state.result,
    state.game.word
  );
  
  const scoreEl = appContainer.querySelector('.score');
  if (scoreEl) {
    scoreEl.textContent = `Побед: ${state.score.wins} | Поражений: ${state.score.losses}`;
  }
}

/**
 * ввод буквы
 * @param letter — буква.
 */
function handleGuess(letter: string): void {
  if (state.result !== null) return;

  const { state: newGame, result } = guessLetter(state.game, letter);
  state.game = newGame;

  if (result === 'win' || result === 'lose') {
    state.result = result;
    if (result === 'win') {
      state.score.wins += 1;
    } else {
      state.score.losses += 1;
    }
    saveScore(state.score);
  }
  syncUI();
}
/**
 * сброс игры: новое слово, очистка состояния
 */
function handleNewGame(): void {
  state.game = createGame(pickRandomWord());
  state.result = null;
  syncUI();
}

/**
 * разметка
 */
function initLayout(): void {
  appContainer.innerHTML = `
    <h1>Виселица</h1>
    <div class="score"></div> 
    <div class="hangman stage-0"></div>
    <div class="word-mask"></div>
    <div class="wrong-letters">—</div>
    <div class="attempts"></div>
    <div class="keyboard"></div>
    <div class="result-banner"></div>
    <button class="btn-new-game">Новая игра</button>
  `;

  appContainer
    .querySelector('.keyboard')
    ?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('key') && target.dataset.letter) {
        handleGuess(target.dataset.letter);
      }
    });

  appContainer
    .querySelector('.btn-new-game')
    ?.addEventListener('click', handleNewGame);
}

initLayout();
syncUI();