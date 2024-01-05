// export default Turtle;
import { useState } from "react";
import Papa from "papaparse";
import "../../Styles/Turtle.css";
import "../../Styles/ServiceSelectionInput.css";

const allowedExtensions = ["csv"];

const Turtle = () => {
  // input part started
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
  // input part ended

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");

  const handleFileChange = (e) => {
    setError("");
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a CSV file");
        return;
      }
      setFile(inputFile);
    }
  };

  // parse CSV
  const handleParse = () => {
    if (!file) return alert("Enter a valid file");

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, {
        header: true,
      });

      const parsedData = csv?.data;

      // Transform each row into an array of objects
      const dataArray = parsedData.map((row) => {
        return Object.keys(row).map((key) => ({
          [key]: row[key],
        }));
      });
      console.log(JSON.stringify(dataArray));
      // dataArray.map((data) => console.log(JSON.stringify(data)));
      setData(dataArray);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      {/* input part started  */}
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
            <span className=" text-xl font-bold">Initial Investment:</span>
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
          <span className=" text-xl font-bold">Your Initial Investment: </span>
          <span className="text-2xl font-bold text-green-700 bg-white px-4 py-1 rounded-md">{`$${
            value || 0
          }`}</span>
        </p>
      </div>
      {/* input part ended */}
      <div className="container">
        <label
          htmlFor="csvInput"
          className="labelForCsv cursor-pointer"
          style={{ display: "block" }}
        >
          {file ? `${file.name}` : "Choose CSV File"}
        </label>

        <input
          onChange={handleFileChange}
          id="csvInput"
          name="file"
          type="file"
        />
        <div>
          <button onClick={handleParse}>Parse</button>
        </div>
        <div style={{ marginTop: "3rem" }}>
          {error
            ? error
            : data.map((row, rowIndex) => (
                <div key={rowIndex} className="item">
                  {row.map((column, columnIndex) => (
                    <span key={columnIndex}>
                      {Object.keys(column)[0]}: {Object.values(column)[0]}
                      <br />
                    </span>
                  ))}
                  <hr />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Turtle;
