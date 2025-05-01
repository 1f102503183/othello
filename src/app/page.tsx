'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [turnColor, setTurnColor] = useState(1);
  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  const Serch_or_Turn = (a: number, b: number) => {
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
              if (newBoard[a][b] === 0) {
                newBoard[a][b] = 3;
                console.log('serch');
                return;
              } else {
                newBoard[a][b] = turnColor;
                for (let k = j; k > 0; k--) {
                  newBoard[dy * k + a][dx * k + b] = turnColor;
                }
                break;
              }
            }
          }
        }
      }
    }
  };

  //駒カウンター
  const counter = (c: number) => {
    return newBoard.flat().filter((newBoard) => newBoard === c).length;
  };

  const newBoard = structuredClone(board);

  //候補地探し

  for (let a = 0; a < 8; a++) {
    for (let b = 0; b < 8; b++) {
      Serch_or_Turn(a, b);
    }
  }

  const clickhandler = (x: number, y: number) => {
    console.log([y][x]);
    Serch_or_Turn(y, x);
    if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
      //候補地消し
      for (let a = 0; a < 8; a++) {
        for (let b = 0; b < 8; b++) {
          newBoard[a][b] %= 3;
        }
      }
      setTurnColor(3 - turnColor);
      console.log(newBoard);
    }
    setBoard(newBoard);
  };

  return (
    <div className={styles.container}>
      <button>buck</button>
      <div
        className={styles.counter}
        style={{ border: turnColor === 1 ? '3px solid #000' : '3px solid #fff' }}
      >
        white:{counter(2)} black:{counter(1)}
      </div>
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
              {color === 3 && (
                <div
                  className={styles.expectPoint}
                  style={{ border: turnColor === 1 ? '5px dotted #000' : '5px dotted #fff' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
