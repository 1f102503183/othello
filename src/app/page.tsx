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

  const clickhandler = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    if (board[y][x] === 0) {
      CanPut(y, x, newBoard, turnColor);
    }
    if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
      setTurnColor(3 - turnColor);
      setBoard(newBoard);
    }
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

//おけるか調べる関数
function CanPut(y: number, x: number, board: number[][], turnColor: number) {
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
  for (let i = 0; i < directions.length; i++) {
    const dy = directions[i][0];
    const dx = directions[i][1];
    if (dy + y > 7 || dy + y < 0 || dx + x > 7 || dx + x < 0) {
      continue;
    } else if (board[dy + y][dx + x] === 3 - turnColor) {
      console.log('next is other');
      for (
        let j = 2;
        dy * j + y <= 7 &&
        dy * j + y >= 0 &&
        dx * j + x <= 7 &&
        dx * j + x >= 0 &&
        board[dy * j + y][dx * j + x] !== 0;
        j++
      ) {
        if (board[dy * j + y][dx * j + x] === turnColor) {
          //戻りながら裏返していく処理
          board[y][x] = turnColor;
          for (let k = j; k > 0; k--) {
            board[dy * k + y][dx * k + x] = turnColor;
          }
          console.log('turn');
          break;
        }
      }
    }
  }
}
