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
    if (newBoard[y][x] === 0) {
      for (let i = 0; i < directions.length; i++) {
        const dy = directions[i][0];
        const dx = directions[i][1];
        if (dy + y > 7 || dy + y < 0 || dx + x > 7 || dx + x < 0) {
          console.log(dx + x);
          console.log(dy + y);
          console.log('return');
          continue;
        } else if (
          board[dy + y][dx + x] === 3 - turnColor &&
          board[dy * 2 + y][dx * 2 + x] === turnColor
        ) {
          newBoard[y][x] = turnColor;
          setTurnColor(3 - turnColor);
          newBoard[dy + y][dx + x] = turnColor;
        }
        console.log('check for count', i);
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
