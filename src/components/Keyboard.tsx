import enterIcon from "../assets/enter.svg";
import deleteIcon from "../assets/delete.svg";
import { getColor } from "../utils";

export function Keyboard({
  letterState,
  handleClick,
}: {
  letterState: Record<string, number>;
  handleClick: (letter: string) => void;
}) {
  return (
    <div id="keyboard" className="mt-4 p-2">
      <div className="keyboardRow">
        {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((key) => (
          <KeyboardKey
            key={key}
            letter={key}
            state={letterState[key]}
            handleClick={handleClick}
          />
        ))}
      </div>
      <div className="keyboardRow">
        {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((key) => (
          <KeyboardKey
            key={key}
            letter={key}
            state={letterState[key]}
            handleClick={handleClick}
          />
        ))}
      </div>
      <div className="keyboardRow">
        <button className="keyboardKey" onClick={() => handleClick("Enter")}>
          <img src={enterIcon} />
        </button>
        {["z", "x", "c", "v", "b", "n", "m"].map((key) => (
          <KeyboardKey
            key={key}
            letter={key}
            state={letterState[key]}
            handleClick={handleClick}
          />
        ))}
        <button
          className="keyboardKey"
          onClick={() => handleClick("Backspace")}
        >
          <img src={deleteIcon} />
        </button>
      </div>
    </div>
  );
}

function KeyboardKey({
  letter,
  state,
  handleClick,
}: {
  letter: string;
  state: number | undefined;
  handleClick: (letter: string) => void;
}) {
  return (
    <button
      className="keyboardKey"
      onClick={() => handleClick(letter)}
      style={{
        background: state !== undefined ? getColor(state, 0, 1) : "",
        color: state !== undefined ? "white" : "black",
      }}
    >
      {letter}
    </button>
  );
}
