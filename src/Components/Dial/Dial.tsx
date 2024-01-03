import React, { ChangeEvent } from 'react';

interface DialProps {
    dialValue: number;
    onDialChange: (newValue: number) => void;
  }

const Dial: React.FC<DialProps> = ({ dialValue, onDialChange }) => {

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = Math.min(10, Math.max(0, parseInt(event.target.value, 10)));
        // console.log(newValue)
        onDialChange(newValue);
    };

    // const handleIncrement = () => {
    //     onDialChange(Math.min(100, dialValue + 1));
    // };
    
    // const handleDecrement = () => {
    //     onDialChange(Math.max(0, dialValue - 1));
    // };

  return (
    <div>
      <div>
        {/* <button onClick={handleDecrement}>-</button> */}
        <input
          type="number"
          value={dialValue}
          onChange={handleInputChange}
        />
        {/* <button onClick={handleIncrement}>+</button> */}
      </div>
      {/* <div>
        {dialValue}
      </div> */}
    </div>
  );
};

export default Dial;