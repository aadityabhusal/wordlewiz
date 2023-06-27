export function sortWords(letterList: string[], first: string, second: string) {
  let firstCount = 0;
  let secondCount = 0;
  letterList.forEach((letter, i) => {
    if (first.includes(letter)) firstCount += i + 1;
    if (second.includes(letter)) secondCount += i + 1;
  });
  return secondCount - firstCount;
}
