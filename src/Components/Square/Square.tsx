import React from 'react';
import "./Square.css";

interface SquareProps {
    value: string | null;
    colour: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }

const Square: React.FC<SquareProps> = ({ value, colour, onClick }) => {
  return (
    <button className="square" style={{ backgroundColor: colour }} onClick={onClick}>
      {value}
    </button>
  );
}

export default Square;