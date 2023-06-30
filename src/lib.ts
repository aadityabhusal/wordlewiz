type Guess = { letter: string; state: number }[];

function checkChar(guess: Guess, index: number, word: string): boolean {
  const { letter, state } = guess[index];
  if (state === 2) return word[index] === letter;
  if (state === 1) return word.includes(letter) && word[index] !== letter;

  const indices = guess
    .filter((item, idx) => idx !== index && item.letter === letter)
    .map((_, idx) => idx);

  if (indices.length) return indices.some((i) => checkChar(guess, i, word));

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
