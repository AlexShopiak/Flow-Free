import { useState, useEffect, useRef } from "react";
import createBoard from "../util/createBoard.js";
import { revealed } from "../util/reveal.js";
import { Player } from "../util/player.js";
import Cell from "./Cell.jsx";
import Modal from "./Modal.jsx";

const Board = () => {
  const [grid, setGrid] = useState([]);
  const [nonMineCount, setNonMineCount] = useState(0);
  const [mineLocations, setMineLocations] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const countRef = useRef(1);

  const [shake, setShake] = useState(false);
  const triggerShake = () => {
    setShake(true);
    // Убираем эффект тряски после завершения анимации
    setTimeout(() => {
      setShake(false);
    }, 400); // Время должно совпадать с длительностью анимации
  };

  

  // ComponentDidMount
  useEffect(() => {
    Player.preloadAudio();
    freshBoard();
  }, []);

  

  const freshBoard = () => {//10 15 15
    const row = 10
    const col = 14
    const bombs = 20
    const newBoard = createBoard(row, col, bombs);
    setNonMineCount(row * col - bombs);
    setMineLocations(newBoard.mineLocation);
    setGrid(newBoard.board);
  };

  const restartGame = () => {
    Player.pauseSound();
    freshBoard();
    setGameOver(false);
  };

  // On Right Click / Flag Cell
  const updateFlag = (e, x, y) => {
    e.preventDefault();// to not have a dropdown on right click

    // Deep copy of a state
    let newGrid = JSON.parse(JSON.stringify(grid));
    console.log(newGrid[x][y]);

    //Cant put flag on revealed
    if (newGrid[x][y].revealed) return;

    const isFlagged = !newGrid[x][y].flagged;
    newGrid[x][y].flagged = isFlagged;
    Player.playSound(isFlagged ? 'flag_on' : 'flag_off');
    setGrid(newGrid);
  };

  // Reveal Cell
  const revealCell = (x, y) => {
    if (grid[x][y].revealed || gameOver) {
      return;
    }

    let newGrid = JSON.parse(JSON.stringify(grid));
    const newValue = newGrid[x][y].value;

    //If mine
    if (newValue === "X") {
      triggerShake();
      (async () => {
        for (let i = 0; i < mineLocations.length; i++) {
          const [row, col] = mineLocations[i];
  
          // Открываем текущую мину
          newGrid[row][col].revealed = true;
          setGrid([...newGrid]); // Обновляем состояние
  
          // Воспроизводим звук
          Player.playSound("mine_" + countRef.current);

          if (countRef.current === 5) {
            countRef.current = 1
          } else {
            countRef.current++;
          }
  
          // Ждём 1 секунду перед открытием следующей мины
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
  
        // Завершаем игру после открытия всех мин
        Player.playSoundLoop("lose");
        setGameOver(true);
      })();
    } 
    //if not a mine
    else {
      let newRevealedBoard = revealed(newGrid, x, y, nonMineCount);
      Player.playSound('pop_' + newValue);

      setGrid(newRevealedBoard.arr);
      setNonMineCount(newRevealedBoard.newNonMinesCount);

      if (newRevealedBoard.newNonMinesCount === 0) { //if win
        Player.playSound('win');
        setGameOver(true);
      }
    }
  };

  return (
    <div className={`boardStyle ${shake ? 'shake' : ''}`}>
      {gameOver && <Modal restartGame={restartGame} />}
      {grid.map((singleRow, index1) => (
        <div style={{ display: "flex" }} key={index1}>
          {singleRow.map((singleBlock, index2) => (
            <Cell
              revealCell={revealCell}
              details={singleBlock}
              updateFlag={updateFlag}
              key={index2}
            />
          ))}
        </div>
      ))}
    </div>
  );  
};

export default Board;
