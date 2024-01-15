import SectionTitle from "../../Components/SectionTitle";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import "../../Styles/Turtle.css";
import "../../Styles/ServiceSelectionInput.css";
const InvestingFunctionality = () => {
  const allowedExtensions = ["csv"];

  const [data, setData] = useState([]);
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const [rsi, setRsi] = useState([]);
  const [zScore, setZScore] = useState([]);

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

  function calculateEMA(prices, period) {
    const multiplier = 2 / (period + 1);
    let ema =
      prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  function handleZscore() {
    const prices = data.map((item) => item.Price);

    // Calculate Z-score, RSI, and Stochastic indicators
    const zScoreValues = calculateZScore(prices);
    setZScore(zScoreValues);
    // console.log(zScore);
  }

  function handleRSI() {
    const rsiValues = calculateRSI(data);
    setRsi(rsiValues);
    // console.log(rsi);
  }

  useEffect(() => {
    // This block will run every time the 'zScore' state is updated
    // console.log("Z-Score updated:", zScore);
  }, [zScore]);

  useEffect(() => {
    // This block will run every time the 'rsi' state is updated
    // console.log("RSI updated:", rsi);
    // Handle or display RSI values as needed
  }, [rsi]);

  console.log(zScore, rsi);
  return (
    <div className="my-8 text-white mx-10">
      <SectionTitle heading="Investing Basics: Key Functionality Unveiled"></SectionTitle>
      <div className="container md:w-1/2 gap-6">
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
      <div className="grid grid-cols-2 gap-10 mt-12 lg:w-1/2 mx-auto">
        <button  onClick={handleRSI}>
          <AwesomeButton style={{ width: "100%" }}>Calculate Z-Score</AwesomeButton>
        </button>
        <button onClick={handleRSI}>
          <AwesomeButton style={{ width: "100%" }}>
            Calculate RSI
          </AwesomeButton>
        </button>
        <button onClick={handleRSI} >
          <AwesomeButton style={{ width: "100%" }}>
            Calculate Stochastic
          </AwesomeButton>
        </button>
        <button onClick={handleRSI}>
          <AwesomeButton style={{ width: "100%" }}>Calculate EMA</AwesomeButton>
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default InvestingFunctionality;
