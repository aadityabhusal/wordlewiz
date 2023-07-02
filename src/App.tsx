import { useEffect, useState } from "react";
import answers from "./data/answers.json";
import { checkWord, getColor } from "./utils";

const [rows, cols] = [6, 5];

export default function App() {
  const [matrix, setMatrix] = useState(
    [...Array(rows)].map(() =>
      [...Array(cols)].map(() => ({ letter: "", state: 0 }))
    )
  );
  const [currentIndex, setCurrentIndex] = useState([0, 0]);
  const [filteredList, setFilteredList] = useState<string[]>(answers);

  function handleChange(value: string, rowIndex: number, colIndex: number) {
    setMatrix((prev) => {
      return prev.map((row, rowIdx) => {
        if (rowIndex !== rowIdx) return row;
        return row.map((col, colIdx) => {
          if (colIndex !== colIdx) return col;
          return { letter: value.slice(-1), state: !value ? 0 : col.state };
        });
      });
    });
    setCurrentIndex(() => [
      rowIndex,
      colIndex + (value && colIndex < cols - 1 ? 1 : 0),
    ]);
  }

  function handleKeyDown(key: string, rowIndex: number, colIndex: number) {
    if (rowIndex === rows) return;
    const hasValue = matrix[rowIndex][colIndex].letter;
    if (key === "Enter") {
      if (hasValue && colIndex === cols - 1) {
        setFilteredList((prev) =>
          prev.filter((word) => checkWord(matrix[currentIndex[0]], word))
        );
        setCurrentIndex(() => [rowIndex + 1, 0]);
      }
    } else if (key === "Backspace") {
      if (hasValue) handleChange("", rowIndex, colIndex);
      else if (colIndex !== 0) handleChange("", rowIndex, colIndex - 1);
    } else {
      if (key.length === 1 && /[a-z]/i.test(key))
        handleChange(key, rowIndex, colIndex);
    }
  }

  function handleClick(rowIndex: number, colIndex: number) {
    if (rowIndex !== currentIndex[0]) return;
    setMatrix((prev) => {
      return prev.map((row, rowIdx) => {
        if (rowIndex !== rowIdx) return row;
        return row.map((col, colIdx) => {
          if (colIndex !== colIdx) return col;
          return { letter: col.letter, state: (col.state + 1) % 3 };
        });
      });
    });
  }

  function handleSuggestions(word: string, rowIndex: number) {
    setMatrix((prev) => {
      return prev.map((row, rowIdx) => {
        if (rowIndex !== rowIdx) return row;
        return word.split("").map((item, i) => ({
          letter: item,
          state: prev?.[rowIdx - 1]?.[i]?.state === 2 ? 2 : 0,
        }));
      });
    });
    setCurrentIndex(() => [rowIndex, cols - 1]);
  }

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      handleKeyDown(e.key, currentIndex[0], currentIndex[1]);
    }
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  return (
    <div id="app">
      <div id="letterMatrix">
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="letterMatrixRow">
            {row.map((col, colIndex) => (
              <div
                key={colIndex}
                className="matrixLetter"
                onClick={() => col.letter && handleClick(rowIndex, colIndex)}
                style={{
                  background: getColor(col.state, rowIndex, currentIndex[0]),
                  color: rowIndex === currentIndex[0] ? "black" : "white",
                  cursor:
                    col.letter && rowIndex === currentIndex[0]
                      ? "pointer"
                      : "initial",
                }}
              >
                {col.letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div id="suggestions">
        {filteredList.slice(0, 10).map((item) => (
          <div
            key={item}
            className="suggestion"
            onClick={() => handleSuggestions(item, currentIndex[0])}
          >
            {item.split("").map((letter, i) => (
              <div key={i} className="matrixLetter">
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
