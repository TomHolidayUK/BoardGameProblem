import React from 'react';
import "./Square.css";

interface SquareProps {
    value: string | null;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

export default Square;