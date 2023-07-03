import enterIcon from "./enter.svg";
import deleteIcon from "./delete.svg";

export function Keyboard({
  charStatus,
}: {
  charStatus: Record<string, number>;
}) {
  function onClick() {
    return charStatus;
  }
  return (
    <div id="keyboard">
      <div className="keyboardRow">
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) => (
          <div className="keyboardKey" key={key} onClick={onClick}>
            {key}
          </div>
        ))}
      </div>
      <div className="keyboardRow">
        {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((key) => (
          <div className="keyboardKey" key={key} onClick={onClick}>
            {key}
          </div>
        ))}
      </div>
      <div className="keyboardRow">
        <div className="keyboardKey" onClick={onClick}>
          <img src={enterIcon} />
        </div>
        {["Z", "X", "C", "V", "B", "N", "M"].map((key) => (
          <div className="keyboardKey" key={key} onClick={onClick}>
            {key}
          </div>
        ))}
        <div className="keyboardKey" onClick={onClick}>
          <img src={deleteIcon} />
        </div>
      </div>
    </div>
  );
}
