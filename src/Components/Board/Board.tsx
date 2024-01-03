import React, {useState} from "react";
import "./Board.css";
import Square from '../Square/Square';

interface BoardProps {
  rows: number;
  columns: number;
}

const Board: React.FC<BoardProps> = ({ rows, columns}) => {

  // const [squares, setSquares] = useState(Array(rows * columns).fill(null));
  // const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (row: number, col: number) => {
    const index = row * columns + col;
    // if (squares[index]) {
    //   console.log(index)
    //   return;
    // }
    console.log('Clicked button at index:', index);
    // console.log(index)
    // console.log('hello')

    // const newSquares = squares.slice();
    // newSquares[index] = xIsNext ? 'X' : 'O';

    // setSquares(newSquares);
    // setXIsNext(!xIsNext);
  };

  const renderSquare = (row: number, col: number) => (
    // <Square value={(row * columns + col).toString()} onClick={() => handleClick(row, col)} />
    <Square value='' onClick={() => handleClick(row, col)} />
    // <Square value={squares[index]}/>
  );

  const renderRow = (rowIndex: number) => (
    <div className="board-row" key={rowIndex}>
      {Array.from({ length: columns }, (_, colIndex) => renderSquare(rowIndex, colIndex))}
    </div>
  );

  return (
    <div className="board-container2">
      <div className="status">Status</div>
      {/* <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div> */}
      <div >
        {Array.from({ length: rows }, (_, rowIndex) => renderRow(rowIndex))}
      </div>
    </div>
  );
}

export default Board;
