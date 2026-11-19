/** результат хода */
export type GuessResult = 'correct' | 'incorrect' | 'already-guessed' | 'win' | 'lose';

/** состояние раунда */
export interface GameState {
  readonly word: string;          // загаданное слово
  readonly guessedLetters: ReadonlySet<string>; // угаданные буквы
  readonly wrongLetters: ReadonlySet<string>;   // неверные буквы
  readonly maxAttempts: number;   // максимум попыток
}

/** словарик рандомных слов */
const WORDS: readonly string[] = [
  'АВТОМОБИЛЬ', 'БИБЛИОТЕКА', 'ВЕЛОСИПЕД', 'ГОРИЗОНТ', 'ДЕРЕВНЯ',
  'ЖИВОПИСЬ', 'ЗАВОД', 'ИНСТРУМЕНТ', 'КНИГА', 'ЛЕСТНИЦА',
  'МАГАЗИН', 'НАУКА', 'ОКЕАН', 'ПАРОВОЗ', 'РАСТЕНИЕ',
  'САМОЛЁТ', 'ТЕЛЕФОН', 'УНИВЕРСИТЕТ', 'ФОНАРЬ', 'ХОЛОДИЛЬНИК',
  'ЦВЕТОК', 'ЧАСЫ', 'ШКОЛА', 'ЭКСКАВАТОР', 'ЮБИЛЕЙ',
  'ЯБЛОКО', 'АРХИТЕКТОР', 'БАССЕЙН', 'ВОКЗАЛ', 'ГИТАРА',
  'ДИРИЖЁР', 'ЕЖЕВИКА', 'ЖУРНАЛИСТ', 'ЗЕРКАЛО', 'ИЗОБРЕТЕНИЕ',
  'КАЛЕНДАРЬ', 'ЛАБОРАТОРИЯ', 'МЕДИЦИНА', 'НОУТБУК', 'ОРАНЖЕРЕЯ',
  'ПУТЕШЕСТВИЕ', 'РАДИОСТАНЦИЯ', 'СПУТНИК', 'ТЕЛЕВИЗОР', 'УЧИТЕЛЬ',
  'ФЕСТИВАЛЬ', 'ХУДОЖНИК', 'ЦИРК', 'ШОКОЛАД', 'ЭЛЕКТРИЧЕСТВО',
];

/**
 * случайное слово выбираем
 * @returns Случайное слово.
 */
export function pickRandomWord(): string {
  const index = Math.floor(Math.random() * WORDS.length);
  return WORDS[index]!;
}

/**
 * новый раунд
 * @param word — загаданное слово
 * @param maxAttempts — максимум попыток 6
 * @returns начальное состояние
 */
export function createGame(word: string, maxAttempts: number = 6): GameState {
  return {
    word: word.toUpperCase(),
    guessedLetters: new Set(),
    wrongLetters: new Set(),
    maxAttempts,
  };
}

/**
 * тут смотрим угадана ли буква
 * @param state — текущее состояние
 * @param letter — проверяемая буква
 * @returns true, если буква уже была введена верно или неверно
 */
export function isAlreadyGuessed(state: GameState, letter: string): boolean {
  const upper = letter.toUpperCase();
  return state.guessedLetters.has(upper) || state.wrongLetters.has(upper);
}

/**
 * обработка ввода буквы
 * @param state — текущее состояние
 * @param letter — введённая буква
 * @returns новое состояние и результат хода
 */
export function guessLetter(
  state: GameState,
  letter: string
): { state: GameState; result: GuessResult } {
  const upper = letter.toUpperCase();

  if (isAlreadyGuessed(state, upper)) {
    return { state, result: 'already-guessed' };
  }

  const isCorrect = state.word.includes(upper);
  const newGuessed = new Set(state.guessedLetters);
  const newWrong = new Set(state.wrongLetters);

  if (isCorrect) {
    newGuessed.add(upper);
  } else {
    newWrong.add(upper);
  }

  const newState: GameState = {
    ...state,
    guessedLetters: newGuessed,
    wrongLetters: newWrong,
  };

  if (isWin(newState)) {
    return { state: newState, result: 'win' };
  }
  if (isLose(newState)) {
    return { state: newState, result: 'lose' };
  }
  return { state: newState, result: isCorrect ? 'correct' : 'incorrect' };
}

/**
 * проверка на победу
 * @param state — состояние игры
 * @returns true, если игрок победил
 */
export function isWin(state: GameState): boolean {
  for (const ch of state.word) {
    if (!state.guessedLetters.has(ch)) return false;
  }
  return true;
}

/**
 * ну тут проверяем на поражение, если попытки кончились
 * @param state — состояние игры
 * @returns true, если игрок проиграл
 */
export function isLose(state: GameState): boolean {
  return state.wrongLetters.size >= state.maxAttempts;
}

/**
 * делаем маску для слова, где угаданные буквы открыты, остальные = '_'
 * @param state — состояние игры
 * @returns массив символов маски
 */
export function getMaskedWord(state: GameState): string[] {
  return [...state.word].map((ch) =>
    state.guessedLetters.has(ch) ? ch : '_'
  );
}

/**
 * оставшиеся попытки
 * @param state — состояние игры
 * @returns число оставшихся попыток
 */
export function getRemainingAttempts(state: GameState): number {
  return Math.max(0, state.maxAttempts - state.wrongLetters.size);
}