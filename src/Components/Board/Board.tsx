import React, {useState, useEffect} from "react";
import "./Board.css";
import Square from '../Square/Square';

interface SquareInfo {
  value: string;
  colour: string;
  // className: string;
}

interface BoardProps {
  rows: number;
  columns: number;
  onStateChange: (squareValues: SquareInfo[]) => void;
  route: number[][] | boolean
}

const Board: React.FC<BoardProps> = ({ rows, columns, onStateChange, route}) => {


  const initialSquares = Array(rows * columns).fill('');
  const [squareValues, setSquareValues] = useState(initialSquares)

  const containerStyle = {
    height: `${rows * 50}px`,
  };

  // useEffect hook to handle prop changes and update state
  useEffect(() => {
    const newSquares = Array(rows * columns).fill('');
    setSquareValues(newSquares);
  }, [rows, columns]);

  const handleClick = (row: number, col: number) => {
    const index = row * columns + col;
    // console.log(index)
    // console.log(squareValues)
  
    const newSquareValues = [...squareValues];
    // A, X, >, ^, <, v
    if (newSquareValues[index] === '') {
      newSquareValues[index] = 'A';
    } else if (newSquareValues[index] === 'A') {
      newSquareValues[index] = 'X'; 
    } else if (newSquareValues[index] === 'X') {
      newSquareValues[index] = '>'; 
    } else if (newSquareValues[index] === '>') {
      newSquareValues[index] = '^'; 
    } else if (newSquareValues[index] === '^') {
      newSquareValues[index] = '<'; 
    } else if (newSquareValues[index] === '<') {
      newSquareValues[index] = 'v'; 
    } else if (newSquareValues[index] === 'v') {
      newSquareValues[index] = ''; 
    }

    setSquareValues(newSquareValues);

  };
  
  useEffect(() => {
    // Pass the state to the parent using the callback function whenever it changes
    onStateChange(squareValues);
  }, [squareValues, onStateChange]);


  // const renderSquare = (row: number, col: number) => (
  //   (row === rows - 1 && col === columns - 1) ?
  //   <Square value={squareValues[row * columns + col]} colour="rgb(102, 253, 0)" onClick={() => handleClick(row, col)} />
  //   :
  //   <Square value={squareValues[row * columns + col]} colour="" onClick={() => handleClick(row, col)} />
  // );

  const renderSquare = (row: number, col: number) => {
    function checkMatrix(matrix: number[][], value: number[]): boolean {
      let targetSubarray = value;
      const includesSubarray = matrix.some(
        (subarray) =>
          subarray.length === targetSubarray.length &&
          subarray.every((value, index) => value === targetSubarray[index])
      );
      return includesSubarray;
    }
    let isPathSquare: boolean = false

    if (Array.isArray(route)) { // check if the route is valid
      isPathSquare = checkMatrix(route, [col, row])
      return (
        <Square
          key={`${row}-${col}`}
          value={squareValues[row * columns + col]}
          // colour={isPathSquare || (row === rows - 1 && col === columns - 1) ? "rgb(102, 253, 0)" : ""}
          colour={(row === rows - 1 && col === columns - 1) ? "rgb(102, 253, 0)" : isPathSquare ? "pink" : ""}
          onClick={() => handleClick(row, col)}
        />
      );
    } else  {
      // console.log('no route')
      return (
        <Square
          key={`${row}-${col}`}
          value={squareValues[row * columns + col]}
          // colour={isPathSquare || (row === rows - 1 && col === columns - 1) ? "rgb(102, 253, 0)" : ""}
          colour={(row === rows - 1 && col === columns - 1) ? "rgb(102, 253, 0)" : ""}
          onClick={() => handleClick(row, col)}
        />
      );
    }
    
  };


  

  const renderRow = (rowIndex: number) => (
    <div className="board-row" key={rowIndex}>
      {Array.from({ length: columns }, (_, colIndex) => renderSquare(rowIndex, colIndex))}
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* <div className="status">Board Configuration</div> */}
      <div >
        {Array.from({ length: rows }, (_, rowIndex) => renderRow(rowIndex))}
      </div>
    </div>
  );
}

export default Board;
