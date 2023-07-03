import answers from "./data/wordleAnswerList.json";

type Guess = { letter: string; state: number }[];

let guess1 = [
  { letter: "s", state: 0 },
  { letter: "a", state: 0 },
  { letter: "l", state: 0 },
  { letter: "e", state: 2 },
  { letter: "t", state: 0 },
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
  { letter: "d", state: 1 },
];

let result2 = result1.filter((word: string) => checkWord(guess2, word));

console.log(result2);

export function sortByFrequency() {
  const list = [...Array(26)].map(() => [0, 0, 0, 0, 0]);
  answers.forEach((word) => {
    word.split("").forEach((letter, pos) => {
      const index = Number(letter.codePointAt(0)) - 97;
      list[index][pos] = list[index][pos] + 1;
    });
  });
  function getSum(word: string) {
    return word.split("").reduce((prev, letter, pos) => {
      const index = Number(letter.codePointAt(0)) - 97;
      return prev + list[index][pos];
    }, 0);
  }
  // const valueMap = answers.map(
  //   (word) => [word, getSum(word)] as [string, number]
  // );
  // valueMap.sort((a, b) => b[1] - a[1]);
  // console.log(valueMap);
  answers.sort((a, b) => getSum(b) - getSum(a));
  console.log(answers);
}
