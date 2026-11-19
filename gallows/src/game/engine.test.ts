import { describe, it, expect } from '@jest/globals';
import {
  createGame,
  guessLetter,
  isWin,
  isLose,
  getMaskedWord,
  getRemainingAttempts,
  isAlreadyGuessed,
  pickRandomWord,
} from './engine';

describe('createGame', () => {
  it('создаёт игру с пустыми наборами', () => {
    const state = createGame('ПРИВЕТ');
    expect(state.word).toBe('ПРИВЕТ');
    expect(state.guessedLetters.size).toBe(0);
    expect(state.wrongLetters.size).toBe(0);
    expect(state.maxAttempts).toBe(6);
  });

  it('приводит слово к верхнему регистру', () => {
    expect(createGame('привет').word).toBe('ПРИВЕТ');
  });
});

describe('guessLetter', () => {
  it('добавляет угаданную букву в guessedLetters', () => {
    const { state } = guessLetter(createGame('ПРИВЕТ'), 'П');
    expect(state.guessedLetters.has('П')).toBe(true);
    expect(state.wrongLetters.size).toBe(0);
  });

  it('добавляет неверную букву в wrongLetters', () => {
    const { state } = guessLetter(createGame('ПРИВЕТ'), 'К');
    expect(state.wrongLetters.has('К')).toBe(true);
  });

  it('возвращает already-guessed для повторной буквы', () => {
    const first = guessLetter(createGame('ПРИВЕТ'), 'П').state;
    const { result } = guessLetter(first, 'П');
    expect(result).toBe('already-guessed');
  });

  it('не мутирует исходное состояние', () => {
    const initial = createGame('ПРИВЕТ');
    guessLetter(initial, 'П');
    expect(initial.guessedLetters.size).toBe(0);
  });

  it('возвращает win, если все буквы угаданы', () => {
    let state = createGame('АБ');
    state = guessLetter(state, 'А').state;
    const { result } = guessLetter(state, 'Б');
    expect(result).toBe('win');
  });

  it('возвращает lose, если попытки исчерпаны', () => {
    let state = createGame('А', 2);
    state = guessLetter(state, 'Б').state;
    const { result } = guessLetter(state, 'В');
    expect(result).toBe('lose');
  });
});

describe('isWin / isLose', () => {
  it('isWin возвращает true для полностью угаданного слова', () => {
    let state = createGame('А');
    state = guessLetter(state, 'А').state;
    expect(isWin(state)).toBe(true);
  });

  it('isLose возвращает true при исчерпании попыток', () => {
    let state = createGame('А', 1);
    state = guessLetter(state, 'Б').state;
    expect(isLose(state)).toBe(true);
  });
});

describe('getMaskedWord', () => {
  it('скрывает неугдаанные буквы', () => {
    const state = createGame('КОТ');
    expect(getMaskedWord(state)).toEqual(['_', '_', '_']);
  });

  it('открывает угаданные буквы', () => {
    const state = guessLetter(createGame('КОТ'), 'О').state;
    expect(getMaskedWord(state)).toEqual(['_', 'О', '_']);
  });
});

describe('getRemainingAttempts', () => {
  it('уменьшается при неверных попытках', () => {
    const state = guessLetter(createGame('КОТ'), 'Б').state;
    expect(getRemainingAttempts(state)).toBe(5);
  });

  it('не опускается ниже нуля', () => {
    let state = createGame('КОТ', 1);
    state = guessLetter(state, 'Б').state;
    expect(getRemainingAttempts(state)).toBe(0);
  });
});

describe('isAlreadyGuessed', () => {
  it('возвращает true для угаданной буквы', () => {
    const state = guessLetter(createGame('КОТ'), 'О').state;
    expect(isAlreadyGuessed(state, 'О')).toBe(true);
  });

  it('возвращает false для новой буквы', () => {
    expect(isAlreadyGuessed(createGame('КОТ'), 'О')).toBe(false);
  });
});

describe('pickRandomWord', () => {
  it('возвращает непустое слово', () => {
    expect(pickRandomWord().length).toBeGreaterThan(0);
  });
});