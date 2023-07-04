import { useEffect, useState } from "react";
import answers from "./data/answers.json";
import { checkWord, colors, getColor } from "./utils";
import { Keyboard } from "./components/Keyboard";

const [ROWS, COLS] = [6, 5];

export default function App() {
  const [matrix, setMatrix] = useState(
    [...Array(ROWS)].map(() =>
      [...Array(COLS)].map(() => ({ letter: "", state: 0 }))
    )
  );
  const [currentIndex, setCurrentIndex] = useState([0, 0]);
  const [filteredList, setFilteredList] = useState<string[]>(answers);
  const [letterState, setLetterState] = useState<Record<string, number>>({});
  const [hideSuggestions, setHideSuggestions] = useState(
    localStorage.getItem("suggestions") || false
  );

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
      colIndex + (value && colIndex < COLS - 1 ? 1 : 0),
    ]);
  }

  function handleKeyDown(key: string, rowIndex: number, colIndex: number) {
    if (rowIndex === ROWS) return;
    const hasValue = matrix[rowIndex][colIndex].letter;
    if (key === "Enter") {
      if (hasValue && colIndex === COLS - 1) {
        setFilteredList((prev) =>
          prev.filter((word) => checkWord(matrix[currentIndex[0]], word))
        );
        setLetterState((prev) => ({
          ...prev,
          ...matrix[currentIndex[0]].reduce((prev, item) => {
            if (letterState[item.letter]) return prev;
            return { ...prev, [item.letter]: item.state };
          }, {}),
        }));
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
    setCurrentIndex(() => [rowIndex, COLS - 1]);
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
      <div id="header">
        <h1 id="logo">
          <span style={{ color: colors[2] }}>Wordle</span>
          <span style={{ color: colors[1] }}>Wiz</span>
        </h1>
        <div
          id="toggleSwitch"
          style={{ flexDirection: hideSuggestions ? "row" : "row-reverse" }}
          onClick={() => {
            localStorage.setItem("suggestions", hideSuggestions ? "" : "show");
            setHideSuggestions((p) => !p);
          }}
        >
          <div style={{ backgroundColor: colors[hideSuggestions ? 0 : 2] }} />
          <span>{hideSuggestions ? "Show" : "Hide"}</span>
        </div>
      </div>
      <div id="play">
        <div
          id="letterMatrix"
          style={{ flexBasis: hideSuggestions ? "20rem" : "" }}
        >
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="letterMatrixRow">
              {row.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="matrixLetter"
                  onClick={() => col.letter && handleClick(rowIndex, colIndex)}
                  style={{
                    height: hideSuggestions ? "4rem" : "",
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
        {!hideSuggestions && (
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
        )}
      </div>
      <Keyboard
        letterState={letterState}
        handleClick={(key) =>
          handleKeyDown(key, currentIndex[0], currentIndex[1])
        }
      />
    </div>
  );
}
