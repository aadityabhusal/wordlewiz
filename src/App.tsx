import { useEffect, useRef, useState } from "react";

const [rows, cols] = [6, 5];
const colors = ["white", "#c9b458", "#6aaa64"];

export default function App() {
  const [matrix, setMatrix] = useState(
    [...Array(rows)].map(() =>
      [...Array(cols)].map(() => ({ value: "", state: 0 }))
    )
  );
  const [currentIndex, setCurrentIndex] = useState([0, 0]);
  const currentRef = useRef<HTMLInputElement>(null);

  function handleChange(value: string, rowIndex: number, colIndex: number) {
    setMatrix((prev) => {
      return prev.map((row, rowIdx) => {
        if (rowIndex !== rowIdx) return row;
        return row.map((col, colIdx) => {
          if (colIndex !== colIdx) return col;
          return { value: value.slice(0, 1), state: col.state };
        });
      });
    });
    setCurrentIndex(() => [rowIndex, colIndex + (value ? 1 : 0)]);
  }

  function handleKeyDown(key: string, rowIndex: number, colIndex: number) {
    const hasValue = matrix[rowIndex][colIndex].value;
    if (key === "Enter" && hasValue && colIndex === cols - 1) {
      setCurrentIndex(() => [rowIndex + 1, 0]);
    }
    if (key === "Backspace" && !hasValue) {
      setCurrentIndex(() => [rowIndex, colIndex - 1]);
    }
  }

  function handleClick(rowIndex: number, colIndex: number) {
    setMatrix((prev) => {
      return prev.map((row, rowIdx) => {
        if (rowIndex !== rowIdx) return row;
        return row.map((col, colIdx) => {
          if (colIndex !== colIdx) return col;
          return { value: col.value, state: (col.state + 1) % 3 };
        });
      });
    });
  }

  useEffect(() => {
    currentRef.current?.focus();
  }, [currentIndex]);

  return (
    <div className="App">
      <h1>Wordle</h1>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((col, colIndex) => (
            <input
              key={colIndex}
              disabled={currentIndex[0] !== rowIndex}
              value={col.value.toUpperCase()}
              onClick={() => col.value && handleClick(rowIndex, colIndex)}
              onChange={(e) => handleChange(e.target.value, rowIndex, colIndex)}
              onKeyDown={(e) => handleKeyDown(e.key, rowIndex, colIndex)}
              ref={
                rowIndex === currentIndex[0] && colIndex === currentIndex[1]
                  ? currentRef
                  : null
              }
              style={{
                width: "20px",
                background: colors[col.state],
                cursor: col.value ? "pointer" : "initial",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
