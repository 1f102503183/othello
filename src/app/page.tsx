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

  const numberOfTurn = 60 - (counter(0, board) + counter(3, board)) + 1;

  const clickhandler = (x: number, y: number) => {
    const newBoard = put(board, y, x, turnColor);

    if (counter(1, board) + counter(2, board) !== counter(1, newBoard) + counter(2, newBoard)) {
      if (counter(3, putexpect(board, 3 - turnColor)) === 0) {
        //終了、積み、パスの処理
        if (fin(putexpect(newBoard, turnColor), turnColor)) {
          setBoard(newBoard);
          return;
        }
      } else {
        setTurnColor(3 - turnColor);
      }
      setBoard(newBoard);
    }
  };

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
        {putexpect(board, turnColor).map((row, y) =>
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
                  className={styles.expectpoint}
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

const put = (board: number[][], y: number, x: number, turnColor: number): number[][] => {
  const newBoard = structuredClone(board);
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
    } else if (newBoard[dy + y][dx + x] === 3 - turnColor) {
      for (
        let j = 2;
        dy * j + y <= 7 &&
        dy * j + y >= 0 &&
        dx * j + x <= 7 &&
        dx * j + x >= 0 &&
        newBoard[dy * j + y][dx * j + x] !== 0 &&
        newBoard[dy * j + y][dx * j + x] !== 3;
        j++
      ) {
        if (newBoard[dy * j + y][dx * j + x] === turnColor) {
          //戻りながら裏返していく処理
          newBoard[y][x] = turnColor;
          for (let k = j; k > 0; k--) {
            newBoard[dy * k + y][dx * k + x] = turnColor;
          }
          break;
        }
      }
    }
  }
  return newBoard;
};

const putexpect = (board: number[][], turnColor: number): number[][] => {
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
  const ex = structuredClone(board);
  //次の地点の候補地探し
  for (let a = 0; a < 8; a++) {
    for (let b = 0; b < 8; b++) {
      if (board[a][b] === 0) {
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
                ex[a][b] = 3;
              }
            }
          }
        }
      }
    }
  }
  return ex;
};

//終了関数
const fin = (board: number[][], turnColor: number): boolean => {
  let result = false;
  if (counter(3, putexpect(board, turnColor)) !== 0) {
    alert(3 - turnColor === 1 ? '黒は置けないためパスします' : '白は置けないためパスします');
  } else {
    //終了判定
    if (counter(0, board) + counter(3, board) === 0) {
      alert(counter(1, board) > counter(2, board) ? '黒の勝ちです' : '白の勝ちです');
    } else {
      alert(
        `互いに置くことができないため, ${counter(1, board) > counter(2, board) ? '黒の勝ちです' : '白の勝ちです'}`,
      );
    }
    result = true;
  }
  return result;
};

//駒カウンター
const counter = (c: number, board: number[][]) => {
  return board.flat().filter((i) => i === c).length;
};
