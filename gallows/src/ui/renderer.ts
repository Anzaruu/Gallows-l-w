import type { GameState } from '../game/engine';
import { getMaskedWord, getRemainingAttempts } from '../game/engine';

/**
 * отрисовка поля
 * @param container — корневой элемент
 * @param state — состояние игры
 */
export function renderBoard(container: HTMLElement, state: GameState): void {
  const wordEl = container.querySelector('.word-mask');
  if (wordEl) {
    wordEl.textContent = getMaskedWord(state).join(' ');
  }

  const wrongEl = container.querySelector('.wrong-letters');
  if (wrongEl) {
    wrongEl.textContent = state.wrongLetters.size
      ? [...state.wrongLetters].join(', ')
      : '—';
  }

  const attemptsEl = container.querySelector('.attempts');
  if (attemptsEl) {
    attemptsEl.textContent = `Осталось попыток: ${getRemainingAttempts(state)}`;
  }

  const hangmanEl = container.querySelector('.hangman');
  if (hangmanEl) {
    const wrongCount = state.wrongLetters.size;
    hangmanEl.className = `hangman stage-${wrongCount}`;
  }
}

/**
 * алфавит фигачим
 * @param container — контейнер
 * @param guessedLetters — угаданные буквы
 * @param wrongLetters — неверные буквы
 */
export function renderKeyboard(
  container: HTMLElement,
  guessedLetters: ReadonlySet<string>,
  wrongLetters: ReadonlySet<string>
): void {
  const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  container.innerHTML = '';
  for (const letter of alphabet) {
    const btn = document.createElement('button');
    btn.className = 'key';
    btn.textContent = letter;
    btn.dataset.letter = letter;
    if (guessedLetters.has(letter)) btn.classList.add('key--correct');
    if (wrongLetters.has(letter)) btn.classList.add('key--wrong');
    container.appendChild(btn);
  }
}

/**
 * результат игры выводим
 * @param resultEl — элемент для сообщения
 * @param result — результат
 * @param word — загаданное слово при проигрыше
 */
export function showResult(
  resultEl: HTMLElement,
  result: 'win' | 'lose' | null,
  word: string
): void {
  if (result === null) {
    resultEl.className = 'result-banner';
    resultEl.textContent = '';
    return;
  }

  resultEl.className = `result-banner ${result === 'win' ? 'win' : 'lose'}`;
  resultEl.textContent =
    result === 'win'
      ? 'Победа! Вы угадали слово!'
      : `Поражение. Слово было: ${word}`;
}