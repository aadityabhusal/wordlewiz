import answers from "./data/wordleAnswerList.json";

type Guess = { letter: string; state: number }[];

let guess1 = [
  { letter: "s", state: 0 },
  { letter: "a", state: 0 },
  { letter: "l", state: 0 },
  { letter: "e", state: 2 },
  { letter: "t", state: 0 }
];

function checkWord(guess: Guess, word: string) {
  return guess.every((g, i) =>
    g.state === 2
      ? word[i] === g.letter
      : g.state === 1
      ? word.includes(g.letter) && word[i] !== g.letter
      : !word.includes(g.letter)
  );
}

let result1 = answers.filter((word: string) => checkWord(guess1, word));

let guess2 = [
  { letter: "r", state: 1 },
  { letter: "o", state: 0 },
  { letter: "2", state: 0 },
  { letter: "n", state: 1 },
  { letter: "d", state: 1 }
];

let result2 = result1.filter((word: string) => checkWord(guess2, word));

console.log(result2);
