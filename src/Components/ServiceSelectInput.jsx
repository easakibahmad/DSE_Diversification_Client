import { useState } from "react";
import Turtle from "./Turtle";

const ServiceSelectInput = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [value, setValue] = useState("");

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (/^\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 mt-6 mx-4">
      <p className="text-xl font-bold">Choose a trading strategy:</p>
      <form className="grid grid-cols-4">
        <label>
          <input
            type="radio"
            value="Turtle Trading Strategy"
            checked={selectedOption === "Turtle Trading Strategy"}
            onChange={handleOptionChange}
          />
          Turtle Trading Strategy
        </label>
        <label>
          <input
            type="radio"
            value="Mean Reversion Trading Strategy"
            checked={selectedOption === "Mean Reversion Trading Strategy"}
            onChange={handleOptionChange}
          />
          Mean Reversion Trading Strategy
        </label>
        <label>
          <input
            type="radio"
            value="Pullback Trading Strategy"
            checked={selectedOption === "Pullback Trading Strategy"}
            onChange={handleOptionChange}
          />
          Pullback Trading Strategy
        </label>
        <label>
          <input
            type="radio"
            value="Swing Trading Strategy"
            checked={selectedOption === "Swing Trading Strategy"}
            onChange={handleOptionChange}
          />
          Swing Trading Strategy
        </label>
      </form>
      <div>
        <label>
          Enter a positive number:
          <input
            className="text-black ml-2 px-2 py-1 rounded outline-none"
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="Enter a number"
          />
        </label>
        <p>
          {value > 0
            ? `Valid input: ${value}`
            : "Please enter a positive number."}
        </p>
      </div>
      <p>{`Selected trading strategy: ${selectedOption || "None"}`}</p>
      {selectedOption === "Turtle Trading Strategy" && value? (
        <Turtle></Turtle>
      ) : (
        `${selectedOption}`
      )}
    </div>
  );
};

export default ServiceSelectInput;
