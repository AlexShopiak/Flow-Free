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
  const [shake, setShake] = useState(false);
  const countRef = useRef(1);
  const canClickRef = useRef(true);

    // on mount
  useEffect(() => {
    Player.preloadAudio();
    freshBoard();
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 400);
  };

  const freshBoard = () => {
    const [row, col, bombs] = [10, 14, 20];
    const newBoard = createBoard(row, col, bombs);
    setNonMineCount(row * col - bombs);
    setMineLocations(newBoard.mineLocation);
    setGrid(newBoard.board);
  };

  const restartGame = () => {
    Player.pauseSound();
    freshBoard();
    setGameOver(false);
    canClickRef.current = true
  };

  // On Right Click / Flag Cell
  const updateFlag = (e, x, y) => {
    // prevent dropdown menu
    e.preventDefault();

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

    if (canClickRef.current === false) {
      console.log("clickable", canClickRef.current)
      return;
    }
    let newGrid = JSON.parse(JSON.stringify(grid));
    const newValue = newGrid[x][y].value;

    //If mine
    if (newValue === "X") {
      canClickRef.current = false;

      (async () => {
        newGrid[x][y].revealed = true;
        setGrid([...newGrid]);
        Player.playSound("mine_5");
        triggerShake();
        await new Promise((resolve) => setTimeout(resolve, 500));

        for (let i = 0; i < mineLocations.length; i++) {
          const [row, col] = mineLocations[i];
          if (row === x && col === y) continue;
  
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
  
        // Play music after autorevealing all mines
        Player.playSoundLoop("lose");
        setGameOver(true);
      })();
    } 
    //if not a mine
    else {
      let newRevealedBoard = revealed(newGrid, x, y, nonMineCount);
      if (newValue === 0) triggerShake();
      Player.playSound('pop_' + newValue);

      setGrid(newRevealedBoard.arr);
      setNonMineCount(newRevealedBoard.newNonMinesCount);

      if (newRevealedBoard.newNonMinesCount === 0) { //if win
        Player.playSound('win');
        console.log('set gameover true win')
        setGameOver(true);
        canClickRef.current = false;
      }
    }
  };

  return (
    <div className={`boardStyle ${shake ? 'shake' : ''}`}>
      {gameOver && <Modal restartGame={restartGame} /> /* display modal if finished */}

      {grid.map((singleRow, index1) => (          /* display cels */
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
