import React from 'react';
import './App.css';
import Board from './Components/Board/Board';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Interactive Board Game Puzzle
      </header>
      <div>I received this question in a coding test for a company, I was left confused at the time but after reading into the problem after the test, the solution became apparent: Backtracking Algorithm</div>
      <div>Create a board game setup in line with the rules below and let the computer decide two things: 1 - can the assasin get to the goal, 2 - what is the shortes route to the goal </div>
      < Board />
    </div>
  );
}

export default App;
