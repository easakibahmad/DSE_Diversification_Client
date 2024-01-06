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
  // const handleParse = () => {
  //   if (!file) return alert("Enter a valid file");

  //   const reader = new FileReader();

  //   reader.onload = async ({ target }) => {
  //     const csv = Papa.parse(target.result, {
  //       header: true,
  //     });

  //     const parsedData = csv?.data;

  //     // Transform each row into an array of objects
  //     const dataArray = parsedData.map((row) => {
  //       return Object.keys(row).map((key) => ({
  //         [key]: row[key],
  //       }));
  //     });
  //     console.log(dataArray);
  //     // dataArray.map((data) => console.log(JSON.stringify(data)));
  //     setData(dataArray);
  //   };

  //   reader.readAsText(file);
  // };

  const handleParse = () => {
    if (!file) return alert("Enter a valid file");

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, {
        header: true,
      });

      const parsedData = csv?.data;

      // Transform data into the desired format
      const transformedData = parsedData.map((row) => {
        const {
          Date,
          Price,
          Open,
          High,
          Low,
          Vol,
          "Change %": ChangePercentage,
        } = row;

        return {
          Date,
          Price: parseFloat(Price),
          Open: parseFloat(Open),
          High: parseFloat(High),
          Low: parseFloat(Low),
          Vol,
          ChangePercentage,
        };
      });

      // transformedData.map((data) => console.log(JSON.stringify(data)));
      setData(transformedData);

      // turtle logic applying started
    };

    reader.readAsText(file);
  };

  const applyTurtleTrading = () => {
    const initialCapital = 80000;

    // Create the "Close_1_shift" column with the previous day's "Price" value
    for (let i = 1; i < data.length; i++) {
      data[i]["Close_1_shift"] = data[i - 1]["Price"];
    }

    // True Range calculation
    for (let i = 0; i < data.length; i++) {
      const high = data[i]["High"];
      const low = data[i]["Low"];
      const close1Shift = data[i]["Close_1_shift"];

      // Handling the first iteration separately
      if (i === 0) {
        data[i]["Close_1_shift"] = data[i]["Price"]; // Set Close_1_shift to the current day's Price for the first row
        data[i]["TR"] = 0; // Set TR to 0 for the first row
      } else {
        // Check if any of the values (high, low, close1Shift) are undefined or NaN
        if (
          high !== undefined &&
          low !== undefined &&
          close1Shift !== undefined &&
          !isNaN(high) &&
          !isNaN(low) &&
          !isNaN(close1Shift)
        ) {
          data[i]["TR"] = Math.max(
            high - low,
            Math.max(Math.abs(close1Shift - high), Math.abs(close1Shift - low))
          );
        } else {
          data[i]["TR"] = 0; // Set TR to 0 if any of the values are undefined or NaN
        }
      }

      // Check if the "Date" field is empty
      if (!data[i]["Date"]) {
        data[i]["Date"] = "Unknown"; // Set a default value if "Date" is empty
      }
    }

    // Log "Close_1_shift" and "TR" values
    // for (let i = 0; i < data.length; i++) {
    //   const close1Shift = data[i]["Close_1_shift"];
    //   const tr = data[i]["TR"];

    //   console.log(
    //     `Date: ${data[i]["Date"]}, Close_1_shift: ${close1Shift}, TR: ${tr}`
    //   );
    // }

    // The N value from Turtle Algorithm
    const nArray = new Array(data.length).fill(0);
    nArray[20] =
      data.slice(0, 20).reduce((sum, row) => sum + row["TR"], 0) / 20;

    for (let i = 21; i < data.length; i++) {
      nArray[i] = (19.0 * nArray[i - 1] + data[i]["TR"]) / 20.0;
    }
    for (let i = 0; i < data.length; i++) {
      data[i]["N"] = nArray[i];
    }

    // console.log(nArray)

    // Compute upper and lower bounds based on Turtle Algorithm
    for (let i = 1; i < data.length; i++) {
      data[i]["upper_bound"] = Math.max(
        ...data.slice(i - 19, i).map((row) => row["High"])
      );
      data[i]["lower_bound"] = Math.min(
        ...data.slice(i - 9, i).map((row) => row["Low"])
      );
      //     console.log(
      //   `Iteration ${i}: upper_bound = ${data[i]["upper_bound"]}, lower_bound = ${data[i]["lower_bound"]}`
      // );
    }

    // Simulation loop
    let capital = initialCapital / 4.0;
    let stocks = 0;
    const fees = 0.001;
    const positions = [];
    const successHistory = [];
    const failureHistory = [];
    let stopLoss = 0.0;

    console.log(`Initial capital:`, capital);

    for (let i = 21; i < data.length; i++) {
      // Check for open position
      // console.log(data[i]["Close_1_shift"], data[i]["lower_bound"]);
      console.log(data);

      if (
        data[i]["Close_1_shift"] > data[i]["upper_bound"] &&
        positions.length === 0
      ) {
        console.log(data[i]["Close_1_shift"], data[i]["upper_bound"]);

        const price = (data[i]["Price"] + data[i]["Open"]) / 2.0;
        console.log(price);
        const purchaseCapAmount = capital * (1.0 - fees);
        stocks += Math.round(purchaseCapAmount / price, 4);
        capital = 0.0;
        stopLoss = price - 2.0 * data[i]["N"];
        positions.push({ time: i, date: data[i]["Date"], price });

        console.log(
          "Open position at",
          price,
          "buy",
          stocks,
          "date",
          data[i]["Date"],
          "Stop loss at",
          stopLoss
        );
      }

      // Check to close position
      else if (
        positions.length > 0 &&
        (data[i]["Close_1_shift"] < data[i]["lower_bound"] ||
          data[i]["Close_1_shift"] < stopLoss ||
          i === data.length - 1)
      ) {
        const price = (data[i]["Price"] + data[i]["Open"]) / 2.0;
        capital = stocks * price * (1 - fees);
        stopLoss = 0.0;
        stocks = 0.0;

        console.log(
          "Close position at",
          price,
          "capital",
          capital,
          "date",
          data[i]["Date"]
        );

        if (positions[positions.length - 1].price < price) {
          for (const p of positions) {
            successHistory.push({
              date: [p.date, data[i]["Date"]],
              price: [p.price, price],
            });
          }
        } else {
          for (const p of positions) {
            failureHistory.push({
              date: [p.date, data[i]["Date"]],
              price: [p.price, price],
            });
          }
        }
        positions.length = 0;
      }
    }

    // Calculate and print success rate
    const totalPositions = successHistory.length + failureHistory.length;
    const successRate =
      totalPositions > 0 ? successHistory.length / totalPositions : 0;

    console.log("-".repeat(50));
    console.log(`Success rate:`, successRate);
    console.log(`Capital at the end:`, capital);
    console.log("-".repeat(50));
  };

  const applyPullbackTrading = () => {
    const initialCapital = 100000;
    const pullbackWindow = 10;
    const entryThreshold = 0.02;
    const exitThreshold = 0.01;

    // Initialize variables
    let capital = initialCapital;
    let stocks = 0;
    const fees = 0.001;
    const positions = [];
    // const successHistory = [];
    // const failureHistory = [];
    const buyPointsX = [];
    const buyPointsY = [];
    const sellPointsX = [];
    const sellPointsY = [];

    console.log("-".repeat(50));
    console.log(`Initial capital: ${capital}`);
    console.log("-".repeat(50));

    // The simulation loop
    let inPosition = false; // Flag to track if currently in a position
    let entryPrice = 0; // Initialize entry price

    for (let i = pullbackWindow; i < data.length; i++) {
      const currentPrice = data[i].Price;
      const high = Math.max(
        ...data.slice(i - pullbackWindow, i).map((item) => item.High)
      );

      // Calculate the price change from the most recent high
      const priceChange = (currentPrice - high) / high;

      // Check for entering a pullback position
      if (priceChange < -entryThreshold && !inPosition) {
        const price = currentPrice;
        const purchaseCapAmount = capital * (1.0 - fees);
        stocks += Math.floor(purchaseCapAmount / price);
        capital -= stocks * price;
        positions.push({ time: i, date: data[i].Date, price });
        buyPointsX.push(data[i].Date);
        buyPointsY.push(price);
        inPosition = true; // Set flag to indicate in a position
        entryPrice = price; // Set entry price
        console.log(
          "Enter pullback position at",
          price,
          "buy",
          stocks,
          "date",
          data[i].Date
        );
      }

      // Check for exiting a pullback position
      else if (priceChange > exitThreshold && inPosition) {
        const price = currentPrice;
        capital += stocks * price * (1 - fees);
        stocks = 0;
        sellPointsX.push(data[i].Date);
        sellPointsY.push(price);
        console.log(
          "Exit pullback position at",
          price,
          "capital",
          capital,
          "date",
          data[i].Date
        );
        inPosition = false; // Set flag to indicate position is closed
        console.log("Entry Price:", entryPrice); // Log entry price
      }
    }

    // Calculate the final capital
    const finalCapital =
      capital + Math.abs(stocks) * data[data.length - 1].Price;

    console.log("-".repeat(50));
    console.log(`Final capital: ${Math.round(finalCapital, 2)}`);
    console.log("-".repeat(50));
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
          <button onClick={applyTurtleTrading}>Turtle</button>
          <button onClick={applyPullbackTrading}>Pullback</button>
        </div>
        {/* <div style={{ marginTop: "3rem" }}>
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
        </div> */}
      </div>
    </div>
  );
};

export default Turtle;
