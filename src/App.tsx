import { useEffect, useState } from "react";
import "./App.css";
import { Color } from "./types/Color";
import { Cell } from "./components/Cell";

function randomColor(): Color {
  const colors = Object.values(Color);
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomBoard(): Color[][] {
  const board: Color[][] = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    const row: Color[] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      row.push(randomColor());
    }
    board.push(row);
  }
  return board;
}

function shouldFillCell(
  currentColor: Color,
  board: Color[][],
  x: number,
  y: number
) {
  return (
    0 <= x &&
    x < BOARD_SIZE &&
    0 <= y &&
    y < BOARD_SIZE &&
    board[y][x] === currentColor
  );
}

const BOARD_SIZE = 12;

interface Coord {
  x: number;
  y: number;
}

const neighbours: Coord[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function App() {
  const [numMoves, setNumMoves] = useState(0);
  const [board, setBoard] = useState(randomBoard());
  const [victory, setVictory] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const maxMovesAllowed = 25; // TODO: find solve puzzle and find optimal number of moves

  function floodBoard(board: Color[][], newColor: Color): Color[][] {
    const newBoard = JSON.parse(JSON.stringify(board));
    const currentColor = newBoard[0][0];
    const queue: Coord[] = [];
    queue.push({ x: 0, y: 0 });
    while (queue.length > 0) {
      const { x, y } = queue.pop()!!;
      newBoard[y][x] = newColor;
      for (const { x: dx, y: dy } of neighbours) {
        if (shouldFillCell(currentColor, newBoard, x + dx, y + dy)) {
          queue.push({ x: x + dx, y: y + dy });
        }
      }
    }

    return newBoard;
  }

  const makeMove = (newColor: Color) => {
    if (victory || gameOver || newColor === board[0][0]) {
      return;
    }
    setBoard((prev) => floodBoard(prev, newColor));
    setNumMoves((prev) => prev + 1);
  };

  useEffect(() => {
    if (numMoves >= maxMovesAllowed) {
      setGameOver(true);
    }
  }, [numMoves]);

  useEffect(() => {
    let allCellsSameColor = true;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== board[0][0]) {
          allCellsSameColor = false;
        }
      });
    });
    setVictory(allCellsSameColor);
  }, [board]);

  return (
    <>
      <h1>Flood</h1>

      <p>
        Moves: {numMoves}/{maxMovesAllowed}
      </p>

      {gameOver && <p>You are out of moves. Game over...</p>}

      {victory && <p>You win! Happy, happy, happy!</p>}

      <div className="board-frame">
        {board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((color, columnIndex) => (
              <Cell
                key={columnIndex}
                color={color}
                onClick={() => {
                  makeMove(color);
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
