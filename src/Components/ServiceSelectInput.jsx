import { useState } from "react";
import "../Styles/ServiceSelectionInput.css";

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
    <div className="grid grid-cols-1 gap-8 mt-6 mx-4">
      <p className="text-xl font-bold">Choose a trading strategy:</p>
      <form className="grid grid-cols-4">
        <label className="slabel">
          <input
            type="radio"
            value="Turtle Trading Strategy"
            checked={selectedOption === "Turtle Trading Strategy"}
            onChange={handleOptionChange}
          />
          Turtle Trading Strategy
        </label>
        <label className="slabel">
          <input
            type="radio"
            value="Mean Reversion Trading Strategy"
            checked={selectedOption === "Mean Reversion Trading Strategy"}
            onChange={handleOptionChange}
          />
          Mean Reversion Trading Strategy
        </label>
        <label className="slabel">
          <input
            type="radio"
            value="Pullback Trading Strategy"
            checked={selectedOption === "Pullback Trading Strategy"}
            onChange={handleOptionChange}
          />
          Pullback Trading Strategy
        </label>
        <label className="slabel">
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
          <span className=" text-xl font-bold">Initial Capital:</span>
          <input
            className="text-black ml-2 px-2 py-1 rounded outline-none"
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="Enter your initial capital"
          />
        </label>
      </div>
      <p>
        <span className=" text-xl font-bold">You selected: </span>
        <span className="text-2xl font-bold text-green-700 bg-white px-4 py-1 rounded-md">
          {" "}
          {`${selectedOption || "None"}`}
        </span>
      </p>
      <p>
        <span className=" text-xl font-bold">Your initial capital: </span>
        <span className="text-2xl font-bold text-green-700 bg-white px-4 py-1 rounded-md">{`$${
          value || 0
        }`}</span>
      </p>
    </div>
  );
};

export default ServiceSelectInput;
