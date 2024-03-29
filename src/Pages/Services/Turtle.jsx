import { useEffect, useState } from "react";
import Papa from "papaparse";
import "../../Styles/Turtle.css";
import "../../Styles/ServiceSelectionInput.css";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import TurtleModal from "../../Components/TurtleModal";
import toast, { Toaster } from "react-hot-toast";
import PullbackModal from "../../Components/PullbackModal";
import MeanReversionModal from "../../Components/MeanReversionModal";
import SwingModal from "../../Components/SwingModal";
// import FWFD from "../../data/FWFD.csv";
// import SIMT from "../../data/SIMT.csv";
// import PLIC from "../../data/PLIC.csv";
// import RPBK from "../../data/RPBK.csv";

const allowedExtensions = ["csv"];

const Turtle = () => {
  const [initialCapital, setInitialCapital] = useState(100000); // Default initial capital

  const [value, setValue] = useState("");
  const [investmentType, setInvestmentType] = useState("Engineering");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");

  const [iCapital, setICapital] = useState(0);
  const [eCapital, setECapital] = useState(0);
  const [turtlePositionLogs, setTurtlePositionLogs] = useState([]);
  const [pullbackPositionLogs, setPullbackPositionLogs] = useState([]);
  const [meanReversionPositionLogs, setMeanReversionPositionLogs] = useState(
    []
  );
  const [swingPositionLogs, setSwingPositionLogs] = useState([]);

  const [stockData, setStockData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("data.json"); // Replace with the actual path to your data.json file
        const data = await response.json();
        setStockData(data); // Assuming the structure of your JSON
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log(stockData);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (/^\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue);
      setInitialCapital(parseFloat(inputValue));
    }
  };

  const handleDropDownValueChange = (event) => {
    const selectedValue = event.target.value;
    setInvestmentType(selectedValue);
    console.log(selectedValue);
  };

  // take csv file as an input
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

  // csv file parsing
  const handleParse = () => {
    if (!file) return alert("Enter your csv file");

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

      setData(transformedData);
      // console.log(JSON.stringify(data, null, 2));

      toast.success("Data parsed successfully");
    };
    reader.readAsText(file);
  };

  const applyTurtleTrading = () => {
    // const initial_capital = 100000;
    // Process data similar to Python code
    const df_1d = {
      Close_1_shift: data.map((entry) => entry.Price),
      TR: data.map((entry) => Math.abs(entry.High - entry.Low)),
      N: [],
      upper_bound: [],
      lower_bound: [],
      Price: data.map((entry) => entry.Price),
      Open: data.map((entry) => entry.Open),
      Date: data.map((entry) => entry.Date),
    };

    df_1d["TR"] = df_1d["TR"].map((tr, index) =>
      Math.max(
        tr,
        Math.abs(df_1d["Close_1_shift"][index] - data[index].High),
        Math.abs(df_1d["Close_1_shift"][index] - data[index].Low)
      )
    );

    let n_array = df_1d["TR"].slice();
    n_array[20] =
      df_1d["TR"].slice(0, 20).reduce((sum, tr) => sum + tr, 0) / 20;

    for (let i = 21; i < df_1d["TR"].length; i++) {
      n_array[i] = (19.0 * n_array[i - 1] + df_1d["TR"][i]) / 20.0;
    }

    df_1d["N"] = n_array;

    for (let i = 0; i < df_1d["TR"].length; i++) {
      df_1d["upper_bound"].push(
        i > 0
          ? Math.max(...data.slice(0, i).map((entry) => entry.High))
          : undefined
      );
      df_1d["lower_bound"].push(
        i > 0
          ? Math.min(...data.slice(0, i).map((entry) => entry.Low))
          : undefined
      );
    }

    let capital = initialCapital;
    let stocks = 0;
    let fees = 0.001;
    let positions = [];
    let success_history = [];
    let failure_history = [];
    let stop_loss = 0; // Declare stop_loss outside the loop

    console.log("-".repeat(50));
    console.log(`Initial capital:`, capital);
    setICapital(capital);

    console.log("-".repeat(50));

    for (let i = 21; i < data.length; i++) {
      if (
        df_1d["Close_1_shift"][i] > df_1d["upper_bound"][i] &&
        positions.length === 0
      ) {
        const price = Math.round((data[i].Price + data[i].Open) / 2.0);
        const purchase_cap_amount = capital * (1.0 - fees);
        stocks += parseFloat((purchase_cap_amount / price).toFixed(4));
        capital = 0.0;
        stop_loss = Math.round(price - 2.0 * df_1d["N"][i]);
        positions.push({ time: i, date: data[i].Date, price });

        const newPositionLog = `Open position at ${price} buy ${stocks} date ${data[i].Date} Stop loss at ${stop_loss}`;
        setTurtlePositionLogs((prevLogs) => [...prevLogs, newPositionLog]);

        console.log(
          "Open position at",
          price,
          "buy",
          stocks,
          "date",
          data[i].Date,
          "Stop loss at",
          stop_loss
        );
      } else if (
        positions.length > 0 &&
        (df_1d["Close_1_shift"][i] < df_1d["lower_bound"][i] ||
          df_1d["Close_1_shift"][i] < stop_loss ||
          i === data.length - 1)
      ) {
        const price = Math.round((data[i].Price + data[i].Open) / 2.0);
        capital = Math.round(stocks * price * (1 - fees));
        stocks = 0.0;

        const newPositionLog = `Close position at ${price} capital ${capital} date ${data[i].Date}`;
        setTurtlePositionLogs((prevLogs) => [...prevLogs, newPositionLog]);

        console.log(
          "Close position at",
          price,
          "capital",
          capital,
          "date",
          data[i].Date
        );

        if (positions[positions.length - 1].price < price) {
          for (const p of positions) {
            success_history.push({
              date: [p.date, data[i].Date],
              price: [p.price, price],
            });
          }
        } else {
          for (const p of positions) {
            failure_history.push({
              date: [p.date, data[i].Date],
              price: [p.price, price],
            });
          }
        }

        positions.length = 0;
      }
    }

    // const success_rate =
    //   (success_history.length /
    //     (failure_history.length + success_history.length)) *
    //   100;

    console.log("-".repeat(50));
    // console.log(`Success rate:`, success_rate);
    console.log(`Capital at the end:`, Math.round(capital, 2));
    setECapital(Math.round(capital, 2));
    console.log("-".repeat(50));
    // console.log(turtlePositionLogs)

    console.log(`Summary of % change in positions:`);
    for (const h of [failure_history, success_history]) {
      for (const position of h) {
        const percent_change = parseFloat(
          (
            ((position.price[1] - position.price[0]) / position.price[0]) *
            100.0
          ).toFixed(2)
        );
        console.log("Percent change in position:", percent_change);
      }
    }
  };

  const applyPullbackTrading = () => {
    const pullbackWindow = 10;
    const entryThreshold = 0.02;
    const exitThreshold = 0.01;

    // Initialize variables
    let capital = initialCapital;
    setICapital(capital);
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
        capital -= Math.round(stocks * price);
        positions.push({ time: i, date: data[i].Date, price });
        buyPointsX.push(data[i].Date);
        buyPointsY.push(price);
        inPosition = true; // Set flag to indicate in a position
        entryPrice = price; // Set entry price
        const newPositionLog = `Enter pullback position at ${price}, buy ${stocks}, date ${data[i].Date}`;
        setPullbackPositionLogs((prevLogs) => [...prevLogs, newPositionLog]);
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
        capital += Math.round(stocks * price * (1 - fees));
        stocks = 0;
        sellPointsX.push(data[i].Date);
        sellPointsY.push(price);
        const newPositionLog = `Exit pullback position at ${price}, capital ${capital}, date ${data[i].Date}`;
        setPullbackPositionLogs((prevLogs) => [...prevLogs, newPositionLog]);
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
    const finalCapital = Math.round(
      capital + Math.abs(stocks) * data[data.length - 1].Price
    );
    setECapital(finalCapital);

    console.log("-".repeat(50));
    console.log(`Final capital: ${Math.round(finalCapital, 2)}`);
    console.log("-".repeat(50));
  };

  function calculateZScore(arr) {
    const mean = arr.reduce((sum, value) => sum + value, 0) / arr.length;
    const variance =
      arr.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      arr.length;
    const stdDev = Math.sqrt(variance);

    return arr.map((value) => (value - mean) / stdDev);
  }

  function calculateRSI(data, window = 14) {
    const dailyReturns = [];
    const gains = [];
    const losses = [];
    const avgGains = [];
    const avgLosses = [];
    const rs = [];
    const rsi = [];

    // Calculate daily price changes
    for (let i = 1; i < data.length; i++) {
      dailyReturns.push(data[i].Price - data[i - 1].Price);
    }

    // Calculate gains and losses
    for (let i = 0; i < dailyReturns.length; i++) {
      gains.push(Math.max(dailyReturns[i], 0));
      losses.push(-Math.min(dailyReturns[i], 0));
    }

    // Calculate average gains and losses over the specified window
    for (let i = 0; i < gains.length; i++) {
      const startIdx = Math.max(0, i - window + 1);
      const endIdx = i + 1;

      const avgGain =
        gains.slice(startIdx, endIdx).reduce((sum, gain) => sum + gain, 0) /
        window;
      const avgLoss =
        losses.slice(startIdx, endIdx).reduce((sum, loss) => sum + loss, 0) /
        window;

      avgGains.push(avgGain);
      avgLosses.push(avgLoss);
    }

    // Calculate relative strength (RS)
    for (let i = 0; i < avgGains.length; i++) {
      rs.push(avgGains[i] / avgLosses[i]);
    }

    // Calculate relative strength index (RSI)
    for (let i = 0; i < rs.length; i++) {
      rsi.push(100 - 100 / (1 + rs[i]));
    }

    return rsi;
  }

  function calculateStochastic(data, kWindow = 14, dWindow = 3) {
    const kValues = [];
    const dValues = [];

    for (let i = 0; i < data.length; i++) {
      const currentPrice = data[i].Price;
      const low14 = Math.min(
        ...data
          .slice(Math.max(0, i - kWindow + 1), i + 1)
          .map((item) => item.Low)
      );
      const high14 = Math.max(
        ...data
          .slice(Math.max(0, i - kWindow + 1), i + 1)
          .map((item) => item.High)
      );

      // Calculate %K
      const percentK = ((currentPrice - low14) / (high14 - low14)) * 100;
      kValues.push(percentK);

      // Calculate %D
      if (i >= kWindow - 1) {
        const avgPercentK =
          kValues
            .slice(i - kWindow + 1, i + 1)
            .reduce((sum, value) => sum + value, 0) / kWindow;
        dValues.push(avgPercentK);

        // Calculate smoothed %D
        if (i >= kWindow + dWindow - 1) {
          const avgPercentD =
            dValues
              .slice(i - dWindow + 1, i + 1)
              .reduce((sum, value) => sum + value, 0) / dWindow;
          dValues[dValues.length - 1] = avgPercentD;
        }
      } else {
        dValues.push(null); // %D is not available until there are enough %K values
      }
    }

    return { percentK: kValues, percentD: dValues };
  }

  const applyMeanReversionTrading = () => {
    const longWindow = 50;
    const entryZScoreThreshold = -1.5;
    const entryRSIThreshold = 30;
    const entryStochasticThreshold = 20;
    const exitZScoreThreshold = 1.5;
    const exitRSIThreshold = 70;
    const exitStochasticThreshold = 80;
    const fees = 0.001;

    // Extract Price values from data
    const prices = data.map((item) => item.Price);

    // Calculate Z-score, RSI, and Stochastic indicators
    const zScoreValues = calculateZScore( prices );
    
    console.log( zScoreValues );
    
    const rsiValues = calculateRSI(prices);
    const stochasticValues = calculateStochastic(data);

    let capital = initialCapital;
    setICapital(capital);
    let stocks = 0;
    const positions = [];
    const buyPointsX = [];
    const buyPointsY = [];
    const sellPointsX = [];
    const sellPointsY = [];

    console.log("-".repeat(50));
    console.log(`Initial capital: ${capital}`);
    console.log("-".repeat(50));

    let inPosition = false;

    for (let i = longWindow; i < data.length; i++) {
      if (
        (zScoreValues[i] < entryZScoreThreshold ||
          rsiValues[i] < entryRSIThreshold ||
          stochasticValues.percentK[i] < entryStochasticThreshold) &&
        !inPosition
      ) {
        const price = data[i].Price;
        const purchaseCapAmount = capital * (1.0 - fees);
        stocks += Math.floor(purchaseCapAmount / price);
        capital -= stocks * price;
        positions.push({ time: i, date: data[i].Date, price });
        buyPointsX.push(data[i].Date);
        buyPointsY.push(price);
        inPosition = true;

        const newPositionLog = `Enter position at ${price} buy ${stocks} date ${data[i].Date}`;
        setMeanReversionPositionLogs((prevLogs) => [
          ...prevLogs,
          newPositionLog,
        ]);
        console.log(
          "Enter position at",
          price,
          "buy",
          stocks,
          "date",
          data[i].Date
        );
      } else if (
        (zScoreValues[i] > exitZScoreThreshold ||
          rsiValues[i] > exitRSIThreshold ||
          stochasticValues.percentK[i] > exitStochasticThreshold) &&
        inPosition
      ) {
        const price = data[i].Price;
        capital += Math.round(stocks * price * (1 - fees));
        stocks = 0;
        sellPointsX.push(data[i].Date);
        sellPointsY.push(price);

        const newPositionLog = `Exit position at ${price} buy ${Math.round(
          capital
        )} date ${data[i].Date}`;
        setMeanReversionPositionLogs((prevLogs) => [
          ...prevLogs,
          newPositionLog,
        ]);
        console.log(
          "Exit position at",
          price,
          "capital",
          capital,
          "date",
          data[i].Date
        );
        inPosition = false;
      }
    }

    const finalCapital =
      capital + Math.abs(stocks) * data[data.length - 1].Price;

    console.log("-".repeat(50));
    console.log(`Final capital: ${Math.round(finalCapital, 2)}`);
    setECapital(Math.round(finalCapital, 2));
    console.log("-".repeat(50));
  };

  // Function to calculate Exponential Moving Average (EMA)
  function calculateEMA(prices, period) {
    const multiplier = 2 / (period + 1);
    let ema =
      prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  const applySwingTradingStrategy = () => {
    const shortEmaPeriod = 9;
    const midEmaPeriod = 13;
    const longEmaPeriod = 50;

    let capital = initialCapital; // Initial capital
    setICapital(capital);
    let stocks = 0; // The initial amount of stocks
    const fees = 0.001; // Fees as 0.1%
    const positions = []; // List to keep current positions
    const buyPointsX = []; // X-coordinates for buy points
    const buyPointsY = []; // Y-coordinates for buy points
    const sellPointsX = []; // X-coordinates for sell points
    const sellPointsY = []; // Y-coordinates for sell points

    console.log("-".repeat(50));
    console.log(`Initial capital for : ${capital}`);
    console.log("-".repeat(50));

    // Calculate exponential moving averages
    for (let i = longEmaPeriod; i < data.length; i++) {
      const shortEma = calculateEMA(
        data.slice(0, i + 1).map((item) => item.Price),
        shortEmaPeriod
      );
      const midEma = calculateEMA(
        data.slice(0, i + 1).map((item) => item.Price),
        midEmaPeriod
      );
      const longEma = calculateEMA(
        data.slice(0, i + 1).map((item) => item.Price),
        longEmaPeriod
      );

      data[i].Short_EMA = shortEma;
      data[i].Mid_EMA = midEma;
      data[i].Long_EMA = longEma;
    }

    // The simulation loop
    let inPosition = false; // Flag to track if currently in a position
    let entryPrice = 0; // Initialize entry price
    let stopLoss = 0; // Initialize stop loss

    for (let i = longEmaPeriod; i < data.length; i++) {
      const shortEma = data[i].Short_EMA;
      const midEma = data[i].Mid_EMA;

      // Long Entry Condition
      if (shortEma > midEma && midEma > data[i].Long_EMA && !inPosition) {
        const price = data[i].Price;
        const purchaseCapAmount = capital * (1.0 - fees);
        stocks += Math.round(Math.floor(purchaseCapAmount / price));
        capital -= Math.round(stocks * price);
        positions.push({ time: i, date: data[i].Date, price });
        buyPointsX.push(data[i].Date);
        buyPointsY.push(price);
        inPosition = true; // Set flag to indicate in a position
        entryPrice = price; // Set entry price
        stopLoss = entryPrice - 0.05 * entryPrice; // Set stop loss
        const newPositionLog = `Long Enter position at ${price} buy ${stocks} date ${data[i].Date}`;
        setSwingPositionLogs((prevLogs) => [...prevLogs, newPositionLog]);
        console.log(
          `Long Enter position at ${price}, buy ${stocks}, date ${data[i].Date}`
        );
      }

      // Short Entry Condition
      else if (shortEma < midEma && !inPosition) {
        const price = data[i].Price;
        const purchaseCapAmount = capital * (1.0 - fees);
        stocks -= Math.floor(purchaseCapAmount / price);
        capital += stocks * price;
        positions.push({ time: i, date: data[i].Date, price });
        buyPointsX.push(data[i].Date);
        buyPointsY.push(price);
        inPosition = true; // Set flag to indicate in a position
        entryPrice = price; // Set entry price
        stopLoss = entryPrice + 0.05 * entryPrice; // Set stop loss
        const newPositionLog = `Short Enter position at ${price} buy ${stocks} date ${data[i].Date}`;
        setSwingPositionLogs((prevLogs) => [...prevLogs, newPositionLog]);
        console.log(
          `Short Enter position at ${price}, short ${stocks}, date ${data[i].Date}`
        );
      }

      // Exit Condition
      else if (shortEma < midEma && inPosition) {
        const price = data[i].Price;
        capital += Math.abs(stocks) * price * (1 - fees);
        stocks = 0;
        sellPointsX.push(data[i].Date);
        sellPointsY.push(price);

        const newPositionLog = `Exit position at ${price}, capital ${Math.round(
          capital
        )}, date ${data[i].Date}, stopLoss ${Math.round(stopLoss)}`;
        setSwingPositionLogs((prevLogs) => [...prevLogs, newPositionLog]);
        console.log(
          `Exit position at ${price}, capital ${capital}, date ${data[i].Date}, stopLoss ${stopLoss}`
        );
        inPosition = false; // Set flag to indicate position is closed

        if (stocks > 0 || stocks < 0) {
          stopLoss = 0; // Reset stop loss for long position
        }
      }
    }

    // Calculate the final capital
    const finalCapital =
      capital + Math.abs(stocks) * data[data.length - 1].Price;
    setECapital(Math.round(finalCapital, 2));

    console.log("-".repeat(50));
    console.log(`Capital at the end for : ${Math.round(finalCapital, 2)}`);
    console.log("-".repeat(50));
  };

  return (
    <div className="grid md:grid-cols-2 px-4 pb-12">
      {/* input part started  */}
      <div className="grid container md:w-3/4 grid-cols-1 gap-8 mt-6 mx-4">
        {/* dropdown input  */}
        <div>
          <label className="flex flex-col justify-start">
            <span className="text-xl font-bold mb-2">Company Type:</span>
            <select
              className="text-black px-2  rounded outline-none py-1"
              value={investmentType}
              onChange={handleDropDownValueChange}
            >
              <option value="Engineering">Engineering</option>
              <option value="Food">Food</option>
              <option value="Cement">Cement</option>
              <option value="BankAndFinance">Bank & Finance</option>
              <option value="Service">Service</option>
              <option value="Garments">Garments</option>
              {/* Add more options as needed */}
            </select>
          </label>
        </div>
        {/* dropdown ended  */}
        {/* CSV File dropdown */}
        <div>
          <label className="flex flex-col justify-start">
            <span className="text-xl font-bold mb-2">Choose Company Data:</span>
            <select
              className="text-black px-2 py-1 rounded outline-none"
              // onChange={handleFileChange}
            >
              <option value="">RPBK</option>

              <option value="select">select</option>
              {/* Add more options as needed */}
            </select>
          </label>
        </div>
        {/* csv file dropdown ended  */}
        <div>
          <label className="flex flex-col justify-start">
            <span className=" text-xl font-bold mb-2">Initial Investment:</span>
            <input
              className="text-black px-2 py-1 rounded outline-none"
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="Enter your initial capital"
            />
          </label>
        </div>
        <div>
          <label
            htmlFor="csvInput"
            className="labelForCsv cursor-pointer"
            // style={{ display: "block" }}
          >
            {file ? `${file.name}` : "Choose CSV File"}
          </label>

          <input
            onChange={handleFileChange}
            id="csvInput"
            name="file"
            type="file"
          />
        </div>
        <button disabled={!file} onClick={handleParse}>
          <AwesomeButton
            type={!file ? "error" : "primary"}
            style={{ width: "100%" }}
            disabled={!file}
          >
            Parse Your Data
          </AwesomeButton>
        </button>
      </div>

      {/* input part ended */}
      <div className="container lg:w-4/5">
        <TurtleModal
          initialCapital={iCapital}
          endCapital={eCapital}
          turtlePositionLogs={turtlePositionLogs}
          fileName={file ? file.name : ""}
        ></TurtleModal>
        <PullbackModal
          initialCapital={iCapital}
          endCapital={eCapital}
          pullbackPositionLogs={pullbackPositionLogs}
          fileName={file ? file.name : ""}
        ></PullbackModal>
        <MeanReversionModal
          initialCapital={iCapital}
          endCapital={eCapital}
          meanReversionPositionLogs={meanReversionPositionLogs}
          fileName={file ? file.name : ""}
        ></MeanReversionModal>
        <SwingModal
          initialCapital={iCapital}
          endCapital={eCapital}
          swingPositionLogs={swingPositionLogs}
          fileName={file ? file.name : ""}
        ></SwingModal>
        <div className="grid grid-cols-1 my-auto gap-6">
          <button
            disabled={!file}
            onClick={() => {
              applyTurtleTrading();
              document.getElementById("turtle_modal").showModal();
            }}
            className="w-full"
          >
            <AwesomeButton
              type="primary"
              style={{ width: "100%" }}
              disabled={!file}
            >
              Apply Turtle Trading Strategy
            </AwesomeButton>
          </button>
          <button
            disabled={!file}
            onClick={() => {
              applyPullbackTrading();
              document.getElementById("pullback_modal").showModal();
            }}
          >
            <AwesomeButton
              type="primary"
              style={{ width: "100%" }}
              disabled={!file}
            >
              Apply Pullback Trading Strategy
            </AwesomeButton>
          </button>
          <button
            disabled={!file}
            onClick={() => {
              applyMeanReversionTrading();
              document.getElementById("mean_reversion_modal").showModal();
            }}
          >
            <AwesomeButton
              type="primary"
              style={{ width: "100%" }}
              disabled={!file}
            >
              Apply Mean Reversion Trading Strategy
            </AwesomeButton>
          </button>
          <button
            disabled={!file}
            onClick={() => {
              applySwingTradingStrategy();
              document.getElementById("swing_modal").showModal();
            }}
          >
            <AwesomeButton
              type={!file ? "error" : "primary"}
              style={{ width: "100%" }}
              disabled={!file}
            >
              Apply Swing Trading Strategy
            </AwesomeButton>
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
export default Turtle;
