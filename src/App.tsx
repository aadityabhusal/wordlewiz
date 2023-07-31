import { useEffect, useState } from "react";
import words from "./data/words.json";
import answers from "./data/answers.json";
import { checkWord, colors, getColor, sortWords } from "./utils";
import { Keyboard } from "./components/Keyboard";

const [ROWS, COLS] = [6, 5];
const DEFAULT_MATRIX = [...Array(ROWS)].map(() =>
  [...Array(COLS)].map(() => ({ letter: "", state: 0 }))
);
const messages = ["Not enough letters", "Not in word list", "Word not found"];

export default function App() {
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX);
  const [currentIndex, setCurrentIndex] = useState([0, 0]);
  const [filteredList, setFilteredList] = useState<string[]>(answers);
  const [letterState, setLetterState] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [hideSuggestions] = useState(
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
        const currentRow = matrix[currentIndex[0]];
        if (!words.includes(currentRow.map((i) => i.letter).join(""))) {
          return setMessage(messages[1]);
        }
        const filteredWords = filteredList.filter((word) =>
          checkWord(currentRow, word)
        );
        setFilteredList(() => sortWords([...filteredWords]));
        if (!filteredWords.length) setMessage(messages[2]);
        setLetterState((prev) => ({
          ...prev,
          ...currentRow.reduce((prev, item) => {
            if (letterState[item.letter]) return prev;
            return { ...prev, [item.letter]: item.state };
          }, {}),
        }));
        setCurrentIndex(() => [rowIndex + 1, 0]);
      } else setMessage(messages[0]);
    } else if (key === "Backspace") {
      if (hasValue) handleChange("", rowIndex, colIndex);
      else if (colIndex !== 0) handleChange("", rowIndex, colIndex - 1);
    } else {
      if (key.length === 1 && /[a-z]/i.test(key))
        handleChange(key.toLowerCase(), rowIndex, colIndex);
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

  function reset() {
    setMatrix(DEFAULT_MATRIX);
    setLetterState({});
    setCurrentIndex([0, 0]);
    setFilteredList(answers);
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

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(""), 1000);
    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <div className="flex flex-col justify-center my-0 mx-auto max-w-[26rem] w-screen">
      <div className="border-b border-solid border-[#d3d6da] mb-4 py-1 px-2 flex justify-between items-center">
        <h1 className="m-0">
          <span style={{ color: colors[2] }}>Wordle</span>
          <span style={{ color: colors[1] }}>Wiz</span>
        </h1>
        {/* The toggle switch will be hidden until a "normal game node" is not ready */}
        {/* <div
          className="border border-solid border-[#d3d6da] flex items-center cursor-pointer rounded-xl p-1 gap-1"
          style={{ flexDirection: hideSuggestions ? "row" : "row-reverse" }}
          onClick={() => {
            localStorage.setItem("suggestions", hideSuggestions ? "" : "show");
            setHideSuggestions((p) => !p);
          }}
        >
          <div
            style={{ backgroundColor: colors[hideSuggestions ? 0 : 2] }}
            className="w-[1.1rem] h-[1.1rem] rounded-full bg-[red]"
          />
          <span>{hideSuggestions ? "Show" : "Hide"}</span>
        </div> */}
      </div>
      <div className="flex justify-center gap-2 px-2 relative">
        <div
          className="flex flex-col gap-[0.125rem] flex-[0_1_16rem]"
          style={{ flexBasis: hideSuggestions ? "20rem" : "" }}
        >
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-[0.125rem]">
              {row.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="flex-[1_1_3rem] h-12 flex justify-center items-center font-bold border-2 border-solid border-[#d3d6da] rounded-sm select-none uppercase"
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
          <div className="flex-[0_1_9rem] flex flex-col gap-1 overflow-y-auto">
            {filteredList.slice(0, 9).map((item) => (
              <div
                key={item}
                className="group flex gap-[0.125rem] cursor-pointer"
                onClick={() => handleSuggestions(item, currentIndex[0])}
              >
                {item.split("").map((letter, i) => (
                  <div
                    key={i}
                    className="flex-[0_1_1.55rem] h-[1.55rem] flex justify-center items-center font-bold border-2 border-solid border-[#d3d6da] rounded-sm select-none uppercase group-hover:bg-[#d3d6da]"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            ))}
            <button
              className="h-9 border border-solid border-[#d3d6da]"
              onClick={reset}
            >
              Reset
            </button>
          </div>
        )}
        {message && (
          <div
            className="absolute p-4 rounded bg-[#d3d6da]"
            style={{ top: "calc(50% - 2rem)" }}
          >
            {message}
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
