import { Color } from "../types/Color";

interface Props {
  color: Color;
  onClick: () => void;
}

export function Cell({ color, onClick }: Props) {
  return (
    <button
      className="square"
      onClick={onClick}
      style={{ background: color }}
    />
  );
}
