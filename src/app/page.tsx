'use client';

import { useState } from 'react';
import styles from './page.module.css';
//board,newBoardへの書き込みはすべて
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

  const numberOfTurn = 60 - counter(0, board);

  const clickhandler = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    //↑変更はすべてこのnewBoardへ
    if (board[y][x] === 0) {
      CanPut(y, x, newBoard, directions, turnColor);
    }
    if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
      //条件を満たしたらかってにうらかえる処理
      for (let a = 0; a < 8; a++) {
        for (let b = 0; b < 8; b++) {
          break;
        }
      }
      setTurnColor(3 - turnColor);
      setBoard(newBoard);
      const log = JSON.stringify(board);
    }
  };
  if (counter(0, board) === 0) {
    alert(counter(1, board) > counter(2, board) ? '黒の勝ちです' : '白の勝ちです');
    return;
  }
  return (
    <div className={styles.container}>
      <div
        className={styles.counterWindow}
        style={{
          background: turnColor === 1 ? '#000' : '#fff',
          color: turnColor === 1 ? '#fff' : '#000',
        }}
      >
        black:{counter(1, board)} white:{counter(2, board)} {numberOfTurn}turn
      </div>
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

//おけるか調べる関数にしたい
function CanPut(
  y: number,
  x: number,
  board: number[][],
  directions: number[][],
  turnColor: number,
) {
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
//駒カウンター
const counter = (c: number, board: number[][]) => {
  return board.flat().filter((i) => i === c).length;
};
