import { useEffect, useState } from "react";

const [rows, cols] = [6, 5];
const colors = ["white", "#f7da21", "#6aaa64"];

export default function App() {
  const [matrix, setMatrix] = useState(
    [...Array(rows)].map(() =>
      [...Array(cols)].map(() => ({ letter: "", state: 0 }))
    )
  );
  const [currentIndex, setCurrentIndex] = useState([0, 0]);

  function handleChange(value: string, rowIndex: number, colIndex: number) {
    setMatrix((prev) => {
      return prev.map((row, rowIdx) => {
        if (rowIndex !== rowIdx) return row;
        return row.map((col, colIdx) => {
          if (colIndex !== colIdx) return col;
          return { letter: value.slice(-1), state: col.state };
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
        setCurrentIndex(() => [rowIndex + 1, 0]);
      }
    } else if (key === "Backspace") {
      if (hasValue) handleChange("", rowIndex, colIndex);
      else if (colIndex !== 0) handleChange("", rowIndex, colIndex - 1);
    } else {
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
    <div>
      <h1>Wordle Solver</h1>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((col, colIndex) => (
            <div
              key={colIndex}
              onClick={() => col.letter && handleClick(rowIndex, colIndex)}
              style={{
                width: "20px",
                height: "20px",
                border: "1px solid gray",
                background: colors[col.state],
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {col.letter.toUpperCase()}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
