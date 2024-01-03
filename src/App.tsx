import React, { useState } from 'react';
import './App.css';
import Board from './Components/Board/Board';
import Dial from './Components/Dial/Dial';

function App() {

  const [heightValue, setHeightValue] = useState(5);
  const handleHeightDialChange = (newValue: number) => {
    setHeightValue(newValue);
  };

  const [widthValue, setWidthValue] = useState(5);
  const handleWidthDialChange = (newValue: number) => {
    setWidthValue(newValue);
  };

  return (
    <div className="App">
      <header className="App-header">
        <b>Interactive Board Game Puzzle</b>
      </header>
      <div>I received this question in a coding test for a company, I was left confused at the time but after reading into the problem after the test, the solution became apparent: Backtracking Algorithm</div>
      <div>Create a board game setup in line with the rules below and let the computer decide two things: 1 - can the assasin get to the goal, 2 - what is the shortest route to the goal </div>
      <div><b>Setup Board</b></div>
      <div>Choose Size of Board</div>
      <div>Width:</div>
      <Dial dialValue={widthValue} onDialChange={handleWidthDialChange}/>
      <div>Height:</div>
      <Dial dialValue={heightValue} onDialChange={handleHeightDialChange}/>
      <div>Click on the squares on the board to change their value</div>
      <div>You need at least 1 Assassin: A</div>
      <div className="board-container">
        <Board rows={heightValue} columns={widthValue}/>
      </div>
    </div>
  );
}

export default App;
