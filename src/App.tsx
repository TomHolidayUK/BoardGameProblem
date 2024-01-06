import React, { useState } from 'react';
import './App.css';
import Board from './Components/Board/Board';
import Dial from './Components/Dial/Dial';
// import ParticleConfig from './Components/Particle/ParticleConfig';
import ParticlesBg from 'particles-bg'
import HyperlinkLogo from './Components/HyperlinkLogo/HyperlinkLogo';


function backtrackingAlgorithm(initial_input: string[]): number[][] | boolean {
  
  function freeSquares(B: string[]): number[][][] {
    // index = [y,x]
    let startPosition: number[] = [];
    let width: number = B[0].length;
    let height: number = B.length;
    const endPosition: number[] = [width - 1, height - 1];

    // find start position
    B.forEach((el, index) =>
      el.split("").forEach((el2, index2) => {
        if (el2 === "A") {
          startPosition = [index2, index];
        }
      })
    );

    console.log(`inputs: 
      start = ${startPosition}, 
      end = ${endPosition}, 
      [width, height] = [${width}, ${height}]`);

    // Find blocked squares
    // Squares with a guard on:
    let allBlocked: number[][] = [];
    let squaresWithGuards: number[][] = [];
    B.forEach((el, index) =>
      el.split("").forEach((el2, index2) => {
        if (
          el2 === "X" ||
          el2 === "v" ||
          el2 === "^" ||
          el2 === ">" ||
          el2 === "<" 
          // el2 === "<v>"
        ) {
          squaresWithGuards.push([index2, index]);
        }
      })
    );

    console.log("squaresWithGuards", squaresWithGuards);

    // Squares in line of sight of guard:
    let blockedBySight: number[][] = [];
    B.forEach((el, index) =>
      el.split("").forEach((el2, index2) => {
        if (el2 === "v") {
          // x coordinate = index2
          let shouldContinue: boolean = true;
          for (let i = index + 1; i < height; i++) {
            if (
              !checkMatrix(squaresWithGuards, [index2, i]) &&
              shouldContinue === true
            ) {
              blockedBySight.push([index2, i]);
            } else if (checkMatrix(squaresWithGuards, [index2, i])) {
              shouldContinue = false;
            }
          }
        } else if (el2 === "^") {
          let shouldContinue: boolean = true;
          for (let i = index - 1; i > -1; i--) {
            if (
              !checkMatrix(squaresWithGuards, [index2, i]) &&
              shouldContinue === true
            ) {
              blockedBySight.push([index2, i]);
            } else if (checkMatrix(squaresWithGuards, [index2, i])) {
              shouldContinue = false;
            }
          }
        } else if (el2 === ">") {
          // x coordinate = index
          let shouldContinue: boolean = true;
          for (let i = index2 + 1; i < width; i++) {
            if (
              !checkMatrix(squaresWithGuards, [i, index]) &&
              shouldContinue === true
            ) {
              blockedBySight.push([i, index]);
            } else if (checkMatrix(squaresWithGuards, [i, index])) {
              shouldContinue = false;
            }
          }
        } else if (el2 === "<") {
          // x coordinate = index
          let shouldContinue: boolean = true;
          for (let i = index2 - 1; i > -1; i--) {
            if (
              !checkMatrix(squaresWithGuards, [i, index]) &&
              shouldContinue === true
            ) {
              blockedBySight.push([i, index]);
            } else if (!checkMatrix(squaresWithGuards, [i, index])) {
              shouldContinue = false;
            }
          }
        }
      })
    );

    console.log("blocked by sight:", blockedBySight);

    allBlocked = squaresWithGuards.concat(blockedBySight); // THIS CONTAINS DUPLICATES!!!!!
    console.log("all blocked:", allBlocked);

    let freeSquares: number[][] = [];

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (!checkMatrix(allBlocked, [j, i])) {
          freeSquares.push([j, i]);
        }
      }
    }

    let finalOutput: number[][][] = [];
    finalOutput.push(freeSquares);
    finalOutput.push([startPosition, endPosition]);

    // [freeSquares, [startPosition, endPosition]]
    return finalOutput;
  }

  function isValid(
    freeSquares: number[][],
    positionToCheck: number[]
  ): boolean {
    if (checkMatrix(freeSquares, [positionToCheck[0], positionToCheck[1]])) {
      // console.log(`${[positionToCheck[0], positionToCheck[1]]} is free`);
      return true;
    } else {
      return false;
    }
  }

  function checkEdgeCases(input: number[][][]): number {
    let freeSquares: number[][] = input[0];
    let startPosition: number[] = input[1][0];
    let endPosition: number[] = input[1][1];
    console.log("freeSquares:", freeSquares);
    // console.log("startPosition:", startPosition);
    // console.log("endPosition:", endPosition);

    // EDGE CASES
    // Is the assasin on a blocked square etc
    if (!checkMatrix(freeSquares, startPosition)) {
      console.log("Assasin is on a blocked square");
      return 1;
    }

    // Is the final square blocked?
    if (!checkMatrix(freeSquares, endPosition)) {
      console.log("Final Square is blocked");
      return 2;
    }


    // // Is the assasin already at the end (and the end is free)?
    // if ((startPosition[0] === endPosition[0]) && (startPosition[1] === endPosition[1]) && checkMatrix(freeSquares, endPosition)) {
    //     console.log('Assasin is already on the final square (and the final square is free)')
    //     return true
    // }

    return 0;
  }

  // Count the number of Assassins, this is important as iut need to be insured that there is only 1 
  function countAssassins(B: string[]): number {
     let assassin_count: number = 0 
     B.forEach((el, index) =>
     el.split("").forEach((el2, index2) => {
       if (el2 === "A") {
         assassin_count += 1
       }
     })
   );

    return assassin_count
  }


  interface Path {
    position: number[];
    direction: string;
  }

  let currentPath: Path[] = [];
  let result: Path[] = [];
  let possibleRoute: boolean = false;

  // This function uses a backtracking algorithm to find a possible path
  function findPath(input: number[][][]): Path[] {
    let freeSquares: number[][] = input[0];
    let startPosition: number[] = input[1][0];
    let endPosition: number[] = input[1][1];

    // console.log('freeSquares:', freeSquares)
    // console.log('startPosition:', startPosition)
    // console.log('endPosition:', endPosition)

    let currentPositionObject: Path = {
      position: startPosition,
      direction: "",
    };

    // console.log('currentPosition:', currentPositionObject.position)

    // if at the endPosition, return path
    // if (
    //   currentPositionObject.position[0] === endPosition[0] &&
    //   currentPositionObject.position[1] === endPosition[1]
    // ) {
    //   console.log("at end position");
    //   result = currentPath
    //   possibleRoute = true;
    //   console.log('result:', currentPath)
    //   return result;
      
    // }

    // remove current position from free squares (to avoid going back over it)
    let index = freeSquares.findIndex(
      (arr) =>
        JSON.stringify(arr) === JSON.stringify(currentPositionObject.position)
    );
    // console.log('index', index)
    if (index !== -1) {
      freeSquares.splice(index, 1);
      // console.log(`Removed ${JSON.stringify(currentPositionObject.position)}. Updated freeSquares:`, freeSquares);
    } else {
      console.log(
        `${JSON.stringify(
          currentPositionObject.position
        )} not found in freeSquares.`
      );
    }

    // Iterate through all possible directions
    let nextPosition: number[] = [];
    for (let i = 0; i < 4; i++) {
      const directions: string[] = ["down", "left", "right", "up"];
      let dy: number[] = [1, 0, 0, -1];
      let dx: number[] = [0, -1, 1, 0];

      nextPosition = [
        currentPositionObject.position[0] + dy[i],
        currentPositionObject.position[1] + dx[i],
      ];

      // check if next position is valid, if it is recursively call the findPath
      if (isValid(freeSquares, nextPosition)) {
        // console.log(`${nextPosition} is valid`);
        let nextPositionObject: Path = {
          position: nextPosition,
          direction: directions[i],
        };
        currentPath.push({ ...nextPositionObject });
        findPath([freeSquares, [nextPosition, endPosition]]);
        // console.log("backtrack");
        currentPath = currentPath.slice(0, -1);

        if (nextPosition[0] === endPosition[0] &&
             nextPosition[1] === endPosition[1]) {
          // Path found, exit the function
          result = currentPath
          console.log('result:', result)
          possibleRoute = true
          return result;
        }
      }
    }

    // Mark the current position as free
    freeSquares.push({ ...currentPositionObject.position });
    // console.log(`Added ${JSON.stringify(currentPositionObject.position)}. Updated freeSquares:`, freeSquares);

    if (currentPath.length === 0 && possibleRoute === false) {
      console.log("There Are No Possible Routes");
      return []
    }
    
    return result;
  }


  // This function checks if a value is in a matrix, this is an essential operation to this programme
  function checkMatrix(matrix: number[][], value: number[]): boolean {
    let targetSubarray = value;
    const includesSubarray = matrix.some(
      (subarray) =>
        subarray.length === targetSubarray.length &&
        subarray.every((value, index) => value === targetSubarray[index])
    );
    return includesSubarray;
  }

  const free_squares: number[][][] = freeSquares(initial_input)
  const edge_cases_check: number = checkEdgeCases(free_squares)
  const assassin_count: number = countAssassins(initial_input)

  if (edge_cases_check === 1) {
    console.log('The Assasin is on a blocked Square')
    return false
  } else if (edge_cases_check === 2) {
    console.log('The Final Square is blocked')
    return false
  } else if (assassin_count === 0) {
    console.log("There aren't any Assasins")
    return false
  } else if (assassin_count > 1) {
    console.log("There are too many Asssassins. There can only be 1")
    return false
  } else if ((edge_cases_check === 0) && (assassin_count === 1)) {
    const result = findPath(free_squares)
    if (result.length > 0) {
      const result2: number[][] = result.map(el => el.position);
      return result2
    } else {
      return false
    }
  } else {
    console.log("Unkown Error")
    return false
  }

}




function App() {

  // Set Height and Width using Dials 

  const [heightValue, setHeightValue] = useState(5);
  const handleHeightDialChange = (newValue: number) => {
    setHeightValue(newValue);
  };

  const [widthValue, setWidthValue] = useState(5);
  const handleWidthDialChange = (newValue: number) => {
    setWidthValue(newValue);
  };

  // -------------------------------------------------
  // Receive info from Board Child component

  interface SquareInfo {
    value: string;
    colour: string;
    // className: string;
  }

  const initialSquares = Array(widthValue * heightValue).fill('');
  const [boardState, setBoardStateFromChild] = useState(initialSquares);

  const handleStateChange = (childState: SquareInfo[]) => {
    setBoardStateFromChild(childState);
  };

  // -------------------------------------------------
  // Run programme
  const [route, setRoute] = useState<boolean | number[][]>([]);

  const onRunProgramme = () => {
    // console.log(boardState)
    let stringData: string[] = []
    for (let i = 0; i < heightValue; i++) {
      let row: string = ''
      for (let j = 0; j < widthValue; j++) {
        if (boardState[(i * widthValue) + j] === '') {
          row += '.'
        } else {
          row += boardState[(i * widthValue) + j]
        }
      }
    stringData.push(row)
    }
    console.log('matrix:', stringData)
    // console.log(backtrackingAlgorithm(stringData))
    // const route = backtrackingAlgorithm(stringData)

    setRoute(backtrackingAlgorithm(stringData))
    console.log('route:', route)
  };

  const onReset = () => {
    console.log('test')
    window.location.reload();
  }

  const [isRulesPopupOpen, setIsRulesPopupOpen] = useState(false);
  const handleRulesPopupClick = () => {
    setIsRulesPopupOpen(!isRulesPopupOpen);
  };


  // -------------------------------------------------

  return (
    <div className="App">
      {/* <ParticlesBg color="#ff0000" num={200} type="circle" bg={true} /> */}
      <ParticlesBg type="circle" num={5} bg={true} />
      <div className="pad">
        <header className="App-header">
          <h3>Interactive Board Game Puzzle</h3>
        </header>
        {/* <div>I received this question in a coding test for a company, I was left confused at the time but after reading into the problem after the test, the solution became apparent: Backtracking Algorithm</div> */}
        <div>Setup the board in line with the <b className="clickable-element underline" onClick={handleRulesPopupClick}><u>rules<HyperlinkLogo/></u></b> and let the programme determine if there is a possible solution</div>
          {isRulesPopupOpen && (
          <div className="overlay">
            <div className="popup">
                <h1>Rules</h1>
                <ul className="styled-list">
                  <div>An Assassin (marked by <b>A</b>) is trying to get to the castle. The castle is the bottom right corner of the board, marked green.</div>
                  <div>However guards and spotters are there to stop him. A guard (marked by <b>X</b>) blocks a square so an Assassin cannot pass through it. A spotter has good vision and so the Assassin cannot pass through the line of vision of a spotter. A spotter can look in one of 4 directions:</div>
                  <div>Up (marked by <b>^</b>)</div>
                  <div>Right (marked by <b>&gt;</b>)</div>
                  <div>Down (marked by <b>v</b>)</div>
                  <div>Right (marked by <b>&lt;</b>)</div>
                  <div>If a guard is standing in the line of vision of a spotter, the Assassin can pass round the back of the guard because the spotter's vision is blocked.</div>
                  <div>There can only be 1 Assassin.</div>
                  <div><b>Setup the board in different ways and let the programme calculate if it is possible to get to the castle.</b></div>
                </ul>
                <button onClick={handleRulesPopupClick}>Close</button>
            </div>
          </div>
          )}
      </div>
      <div className="pad">
        <div><b>Choose Size of Board</b></div>
        <div>Width:</div>
        <Dial dialValue={widthValue} onDialChange={handleWidthDialChange}/>
        <div>Height:</div>
        <Dial dialValue={heightValue} onDialChange={handleHeightDialChange}/>
      </div>
      <div className="board-container pad">
      <div className="pad">Click on the squares on the board to change them:</div>
        {!route 
        ? 
        <div>
          <h3><b>There is no possible route</b></h3> 
          <Board rows={heightValue} columns={widthValue} onStateChange={handleStateChange} route={route}/>
        </div> 
        : 
        <Board rows={heightValue} columns={widthValue} onStateChange={handleStateChange} route={route}/>}
        <div>
          <button onClick={onRunProgramme}>Run</button>
          <button onClick={onReset}>Reset</button>
        </div>
      </div>
      <div className="pad">
        <div>Because this solution uses a backtracking algorithm, it doesn't necessarily find the most efficient route, it just tries to find any route.</div>
        <div>To find the shortest path, Dijkstra's or A * algorithm could be applied.</div>
      </div>
    </div>
  );
}

export default App;
