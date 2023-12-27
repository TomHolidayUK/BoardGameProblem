import React from "react";
import "./Board.css";

function Board() {
  const boardWidth: number = 6;
  const boardHeight: number = 3;

  return (
    <div>
      Hello
      <div className="board-container">
        <div className="board-outline"> </div>
      </div>
    </div>
  );
}

export default Board;
