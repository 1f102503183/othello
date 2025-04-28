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
  const newBoard = structuredClone(board);
  //候補地消し
  for (let a = 0; a < 8; a++) {
    for (let b = 0; b < 8; b++) {
      board[a][b] %= 3;
    }
  }
  //候補地探し
  for (let a = 0; a < 8; a++) {
    for (let b = 0; b < 8; b++) {
      // y = a  x = b
      if (board[a][b] === 0 || newBoard[a][b] === 3) {
        for (let i = 0; i < directions.length; i++) {
          const dy = directions[i][0];
          const dx = directions[i][1];
          if (dy + a > 7 || dy + a < 0 || dx + b > 7 || dx + b < 0) {
            continue;
          } else if (board[dy + a][dx + b] === 3 - turnColor) {
            for (
              let j = 2;
              dy * j + a <= 7 &&
              dy * j + a >= 0 &&
              dx * j + b <= 7 &&
              dx * j + b >= 0 &&
              board[dy * j + a][dx * j + b] !== 0 &&
              board[dy * j + a][dx * j + b] !== 3;
              j++
            ) {
              if (board[dy * j + a][dx * j + b] === turnColor) {
                newBoard[a][b] = 3;
                break;
              }
            }
          }
        }
      }
    }
  }

  const clickhandler = (x: number, y: number) => {
    console.log(turnColor);
    console.log(x, y);
    if (newBoard[y][x] === 0 || newBoard[y][x] === 3) {
      for (let i = 0; i < directions.length; i++) {
        const dy = directions[i][0];
        const dx = directions[i][1];
        if (dy + y > 7 || dy + y < 0 || dx + x > 7 || dx + x < 0) {
          console.log(dx + x);
          console.log(dy + y);
          console.log('contenue');
          continue;
        } else if (board[dy + y][dx + x] === 3 - turnColor) {
          console.log('next is other');
          for (
            let j = 2;
            dy * j + y <= 7 &&
            dy * j + y >= 0 &&
            dx * j + x <= 7 &&
            dx * j + x >= 0 &&
            board[dy * j + y][dx * j + x] !== 0 &&
            board[dy * j + y][dx * j + x] !== 3;
            j++
          ) {
            console.log('enough=>for dy,dx = ', dy * j, dx * x);
            if (board[dy * j + y][dx * j + x] === turnColor) {
              newBoard[y][x] = turnColor;
              setTurnColor(3 - turnColor);
              for (let k = j; k > 0; k--) {
                newBoard[dy * k + y][dx * k + x] = turnColor;
              }
              console.log('turn');
              break;
            }
          }
        }
      }
    }
    setBoard(newBoard);
  };

  return (
    <div className={styles.container}>
      <div className={styles.counter} />
      <div className={styles.board}>
        {newBoard.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickhandler(x, y)}>
              {color % 3 !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
              {color === 3 && <div className={styles.expectPoint} />}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
