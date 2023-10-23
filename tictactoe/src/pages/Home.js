import { useState } from 'react';
import './style.css'

function Square({ value, onSquareClick, isHighlight }) {
  return (
    <button className={`square ${isHighlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winnerLine}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }
  function countValsAvail(squares) {
    const nonNullArray = squares.filter(value => value != null )
    return nonNullArray.length
  }

  const objWinner = calculateWinner(squares);
  let status;
  if (objWinner) {
    status = 'Winner: ' + objWinner.winner;
  } else {
    if(countValsAvail(squares) < 9){
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }else{
      status = 'Draw!!!'
    }
    
  }
  
  

  function renderBoard() {

    function checkHightLight(index, line) {
      if(index === line[0] || index === line[1] || index === line[2]){
        return true
      }else{
        return false
      }
    }
    const cell = (index) => {
      return <Square 
                key={index} 
                value={squares[index]} 
                onSquareClick={() => handleClick(index)} 
                isHighlight={checkHightLight(index, winnerLine)} />
    }

    
    const boardSize = 3;
    let rows = []
    for(let i = 0; i < boardSize; i++){
      let cols = []

      for(let j = 0; j < boardSize; j++){
        cols.push(
          cell(i*boardSize + j)
        )
      }
      rows.push(
        <div className="board-row" key={i}>
          {cols}
        </div>
      )
    }

    return <div className='board'>
        {rows}
    </div>
  }

  return (
    <>
      <div className="status">{status}</div>
      {renderBoard()}
      
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true)
  const [winnerLine, setWinnerLine] = useState([])
  const [checkWinner, setCheckWinner] = useState(false)
  const [currentPosition, setCurrentPosition] = useState([])
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const nexPosition = [...currentPosition.slice(0, currentMove), index]
    setCurrentPosition(nexPosition)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setCheckWinner(false)
    setWinnerLine([])
  }

  const handleClickToggle = () => {
    isAscending ? setIsAscending(false) : setIsAscending(true)
  }

  const objWinner = calculateWinner(history[currentMove])
  if(objWinner){
    if(checkWinner === false){
      setWinnerLine(objWinner.line)
      setCheckWinner(true)
    }
  }

  const position = (move) => {
    return ` (${Math.floor(currentPosition[move-1] /3) + 1},${(currentPosition[move-1] %3) + 1})`
  }
  
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move + position(move);
    } else {
      description = 'Go to game start';
    }
  

    return (
      <>
        
        <li key={move}>
          {move === currentMove ? 
            <div>You are at move #{currentMove} {move > 0 ? position(move) : '' }</div> :
            <button onClick={() => jumpTo(move)}>{description}</button>}
        </li>
      </>
      
    );
  });

  if(!isAscending){
    moves.reverse()
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winnerLine={winnerLine}/>
      </div>
      <div className="game-info">
        <div>
           <button onClick={handleClickToggle}>{isAscending ? 'Ascending' : 'Descending'}</button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const objWinner = {
        winner: squares[a],
        line: lines[i]
      }
      return objWinner;
    }
  }
  return null;
}
