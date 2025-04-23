'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  const clickhandler = (x: number, y: number) => {
    console.log(turnColor);
    console.log(x, y);
    const newBoard = structuredClone(board);
    for (let i = 0; i < directions.length; i++) {
      const dy = y + directions[i][0]; //クリックした値から調べるますの位置
      const dx = x + directions[i][1];
      if (
        dy > 7 ||
        (dy - y) * 2 > 7 ||
        dy > 7 ||
        (dy - y) * 2 < 0 ||
        dx > 7 ||
        (dx - x) * 2 > 7 ||
        dx > 7 ||
        (dx - x) * 2 < 0
      ) {
        return;
      } else if (
        board[dy][dx] === 3 - turnColor &&
        board[(dy - y) * 2][(dx - x) * 2] === turnColor
      ) {
        newBoard[y][x] = turnColor;
        setTurnColor(3 - turnColor);
        newBoard[dy][dx] = turnColor;
      }
    }
    setBoard(newBoard);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickhandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
