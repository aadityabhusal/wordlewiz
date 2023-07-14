import letters from "./data/letters.json";

type Guess = { letter: string; state: number }[];

function checkChar(guess: Guess, index: number, word: string): boolean {
  const { letter, state } = guess[index];
  if (state === 2) return word[index] === letter;
  if (state === 1) return word.includes(letter) && word[index] !== letter;

  const multiple = guess.reduce((prev: number[], item, idx) => {
    if (idx !== index && item.letter === letter && item.state !== 0)
      return prev.concat(idx);
    return prev;
  }, []);

  if (multiple.length && word.split(letter).length === multiple.length + 1) {
    return multiple.some((item) => checkChar(guess, item, word));
  }

  return !word.includes(letter);
}

export function checkWord(guess: Guess, word: string): boolean {
  return guess.every((_, i) => checkChar(guess, i, word));
}

export const colors = ["#787c7e", "#c9b458", "#6aaa64"];

export function getColor(state: number, rowIndex: number, currentRow: number) {
  return rowIndex === currentRow && state === 0
    ? "white"
    : rowIndex <= currentRow
    ? colors[state]
    : "white";
}

export function sortWords(words: string[]) {
  const list = [...Array(26)].map(() => [0, 0, 0, 0, 0]);
  words.forEach((word) => {
    word.split("").forEach((letter, pos) => {
      const index = Number(letter.codePointAt(0)) - 97;
      list[index][pos] = list[index][pos] + 1;
    });
  });
  function getSum(word: string) {
    const sum = word.split("").reduce((prev, letter, pos) => {
      const index = Number(letter.codePointAt(0)) - 97;
      return prev + list[index][pos] + letters.indexOf(letter);
    }, 0);
    return sum * new Set(word).size;
  }
  words.sort((a, b) => getSum(b) - getSum(a));
  return words;
}
