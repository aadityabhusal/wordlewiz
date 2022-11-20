import words from "./data/Top15Letters.json";
import { letterList } from "./data";
import { sortWords } from "./utils";

/**
 * The 26 most letters in order - EARIOTNSLCUDPMHGBFYWKVXZJQ
 * Get the array of 5 letter words made from above letters (unique letters)
 * Filter the array into array of 4 words, all having unique letters
 * Sort the array based on the most used letters
 */

function getList(words: string[], word: string) {
  let result = [word];
  words.forEach((word) => {
    let unique = !result.some((item) =>
      word.split("").some((letter) => item.includes(letter))
    );
    if (unique) result.push(word);
  });
  return result;
}

let result: string[] = [];
let total: string[][] = [];

words.forEach((word) => {
  let list = getList(words, word);
  if (list.length > result.length) total = [];
  if (list.length >= result.length) {
    list.sort((a, b) => sortWords(letterList, a, b));
    result = list;
    total.push(list);
  }
});

total.sort((a, b) => sortWords(letterList, a[0], b[0]));
console.log(total);
