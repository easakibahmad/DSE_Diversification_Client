import SectionTitle from "../../Components/SectionTitle";
// import img1 from "../../assets/turtle.jpeg";
// import img2 from "../../assets/mean.png";
// import img3 from "../../assets/pullback.jpg";
// import img4 from "../../assets/swing.jpg";

const InvestingBasics = () => {
  return (
    <div className="my-8 text-white">
      <SectionTitle heading="Getting Started with Investing: The Basics You Need to Know"></SectionTitle>
      <div className="grid lg:grid-cols-2 gap-10 mx-16 my-8">
        <div className="card  shadow-xl image-full bg-black">
          {/* <figure>
            <img src={img1} alt="Shoes" />
          </figure> */}
          <div className="card-body">
            <h2 className="card-title">
              <span className="font-bold text-yellow-500">Turtle</span>
              Trading Strategy
            </h2>
            <ol className="list-decimal pl-6 space-y-2 ">
              <li className="mb-2">
                Focus on price instead of relying on information from TV or
                newspaper commentators when making trading decisions.
              </li>{" "}
              <li className="mb-2">
                Allow some flexibility in setting the parameters of buy and sell
                signals.
              </li>{" "}
              <li className="mb-2">
                {" "}
                Test different parameters for different markets to find what
                works best from the personal perspective.
              </li>{" "}
              <li className="mb-2">Plan exit as well as entry.</li>{" "}
              <li>Know when to take profits and when to cut losses.</li>{" "}
              <li className="mb-2">
                Take larger positions in less volatile markets and reduce
                exposure in the most volatile markets.
              </li>{" "}
              <li className="mb-2">
                Do not risk more than 2% of the total account in a single trade.
              </li>
            </ol>
          </div>
        </div>
        <div className="card  bg-black shadow-xl image-full">
          {/* <figure>
            <img src={img2} alt="Shoes" />
          </figure> */}
          <div className="card-body">
            <h2 className="card-title">
              <span className="font-bold text-yellow-500">Mean</span>
              Reversion Trading Strategy
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li className="mb-2">
                Mean reversion in finance suggests that various related
                phenomena, such as asset price and return volatility, eventually
                return to their long-term average levels.
              </li>{" "}
              <li className="mb-2">
                Mean reversion trading attempts to take advantage of extreme
                changes in the price of a particular security, with the
                assumption that the security will revert to its previous state.
              </li>{" "}
              <li className="mb-2">
                Technical analysis reversal tools include Moving Averages,
                Relative Strength Index (RSI), Bollinger Bands, and Stochastic
                Oscillators.
              </li>
            </ol>
          </div>
        </div>
        <div className="card  bg-black shadow-xl image-full">
          {/* <figure>
            <img src={img3} alt="Shoes" />
          </figure> */}
          <div className="card-body">
            <h2 className="card-title">
              <span className="font-bold text-yellow-500">Pullback</span>
               Trading Strategy
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li className="mb-2">
                Identify the Trend:Use tools such as moving averages, trend
                lines, and chart patterns to identify overall trends in assets.
              </li>
              <li className="mb-2">
                Wait for a pullback: Once a trend is identified, wait for a
                temporary price drop against it, indicating a possible reversal
                or correction.
              </li>
              <li className="mb-2">
                Confirmation Signals: Look for confirmation through candlestick
                patterns, technical indicators, or other signals that indicate
                the decline is likely to be temporary.
              </li>
              <li className="mb-2">
                Entry and Stop Loss: Enter after confirming the pullback and aim
                for a favorable entry point.Set a stop loss order to limit
                potential losses.
              </li>
              <li className="mb-2">
                Follow Trends: Use techniques such as technical indicators,
                target prices, or trend line analysis to take advantage of trend
                resumptions to determine when to exit a trade.
              </li>
            </ol>
          </div>
        </div>
        <div className="card  bg-black shadow-xl image-full">
          {/* <figure>
            <img src={img4} alt="Shoes" />
          </figure> */}
          <div className="card-body">
            <h2 className="card-title">
              <span className="font-bold text-yellow-500">Swing</span>
              Trading Strategy
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li className="mb-2">
                Trade Direction: The decision whether to take a long or short
                position based on market movements and technical levels.
              </li>
              <li className="mb-2">
                Entry Point: The decision where to enter the market to optimize
                trading potential.
              </li>
              <li className="mb-2">
                Take Profit Price: Identification of the target price to take
                profit from the trade.
              </li>
              <li className="mb-2">
                Stop Loss Price: Setting a price level to reduce losses if the
                trade does not go as expected.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestingBasics;
