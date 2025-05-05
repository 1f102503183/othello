'use client';

import { useState } from 'react';
import styles from './page.module.css';
//board,newBoardへの書き込みはすべて

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  //ここから下がレンダー直後に実行される
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

  const numberOfTurn = 60 - counter(0, board) + 1;
  const history: number[][][] = [];

  const clickhandler = (x: number, y: number) => {
    let newBoard = structuredClone(board);
    const nextTurnColor = 3 - turnColor;

    //現在の候補地の削除
    for (let a = 0; a < 8; a++) {
      for (let b = 0; b < 8; b++) {
        newBoard[a][b] %= 3;
      }
    }

    //置く
    if (board[y][x] === 3 || board[y][x] === 0) {
      for (let i = 0; i < directions.length; i++) {
        const dy = directions[i][0];
        const dx = directions[i][1];
        if (dy + y > 7 || dy + y < 0 || dx + x > 7 || dx + x < 0) {
          continue;
        } else if (board[dy + y][dx + x] === 3 - turnColor) {
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
            console.log('enough for');
            if (board[dy * j + y][dx * j + x] === turnColor) {
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
    }
    //定義されていないとこなら履歴にしようとした
    if (board[y][x] === undefined) {
      newBoard = history[numberOfTurn];
    }

    //終了判定
    if (counter(0, board) + counter(3, board) === 0) {
      alert(counter(1, board) > counter(2, board) ? '黒の勝ちです' : '白の勝ちです');
    }

    if (counter(1, board) + counter(2, board) !== counter(1, newBoard) + counter(2, newBoard)) {
      //候補地差がし
      for (let a = 0; a < 8; a++) {
        for (let b = 0; b < 8; b++) {
          if (canPut(a, b, newBoard, directions, nextTurnColor)) {
            newBoard[a][b] = 3;
          }
        }
      }
      console.log(newBoard);

      if (counter(3, newBoard) === 0) {
        let point = 0;
        for (let a = 0; a < 8; a++) {
          for (let b = 0; b < 8; b++) {
            if (canPut(a, b, newBoard, directions, turnColor)) {
              point += 1;
            }
          }
        }
        if (point === 0) {
          alert(
            `互いに置くことができないため, ${counter(1, board) > counter(2, board) ? '黒の勝ちです' : '白の勝ちです'}`,
          );
          setBoard(newBoard);
          return;
        }
        for (let a = 0; a < 8; a++) {
          for (let b = 0; b < 8; b++) {
            if (canPut(a, b, newBoard, directions, turnColor)) {
              newBoard[a][b] = 3;
            }
          }
        }
        setBoard(newBoard);
        alert(nextTurnColor === 1 ? '黒は置けないためパスします' : '白は置けないためパスします');
        return;
      }
      setTurnColor(3 - turnColor);
      setBoard(newBoard);
      history[numberOfTurn] = board;
    }
    //ここまではレンダーされない?
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
        {board.map((row, y) =>
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

//置けるかどうかを調べる関数
function canPut(
  y: number,
  x: number,
  board: number[][],
  directions: number[][],
  turnColor: number,
) {
  if (board[y][x] === 0 || board[y][x] === 3) {
    for (let i = 0; i < directions.length; i++) {
      const dy = directions[i][0];
      const dx = directions[i][1];
      if (dy + y > 7 || dy + y < 0 || dx + x > 7 || dx + x < 0) {
        continue;
      } else if (board[dy + y][dx + x] === 3 - turnColor) {
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
          if (board[dy * j + y][dx * j + x] === turnColor) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

//駒カウンター
const counter = (c: number, board: number[][]) => {
  return board.flat().filter((i) => i === c).length;
};
