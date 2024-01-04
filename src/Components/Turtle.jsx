// import { useState } from "react";
// import Papa from "papaparse";
// import "../Styles/Turtle.css";

// const allowedExtensions = ["csv"];

// const Turtle = () => {
//   const [data, setData] = useState([]);
//   const [error, setError] = useState("");
//   const [file, setFile] = useState("");

//   const handleFileChange = (e) => {
//     setError("");
//     if (e.target.files.length) {
//       const inputFile = e.target.files[0];
//       const fileExtension = inputFile?.type.split("/")[1];
//       if (!allowedExtensions.includes(fileExtension)) {
//         setError("Please input a csv file");
//         return;
//       }
//       setFile(inputFile);
//     }
//   };

//   // parse csv
//   const handleParse = () => {
//     if (!file) return alert("Enter a valid file");

//     const reader = new FileReader();

//     reader.onload = async ({ target }) => {
//       const csv = Papa.parse(target.result, {
//         header: true,
//       });
//       const parsedData = csv?.data;
//       const rows = Object.keys(parsedData[0]);

//       const columns = Object.values(parsedData[0]);
//       const res = rows.reduce((acc, e, i) => {
//         return [...acc, [[e], columns[i]]];
//       }, []);
//       console.log(res);
//       setData(res);
//     };
//     reader.readAsText(file);
//   };

//   console.log(data);
//   return (
//     <div>
//       <div className="container">
//         <label
//           htmlFor="csvInput"
//           className="labelForCsv"
//           style={{ display: "block" }}
//         >
//           Enter CSV File
//         </label>
//         <input
//           onChange={handleFileChange}
//           id="csvInput"
//           name="file"
//           type="File"
//         />
//         <div>
//           <button onClick={handleParse}>Parse</button>
//         </div>
//         <div style={{ marginTop: "3rem" }}>
//           {error
//             ? error
//             : data.map((e, i) => (
//                 <div key={i} className="item">
//                   {e[0]}:{e[1]}
//                 </div>
//               ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Turtle;
import { useState } from "react";
import Papa from "papaparse";
import "../Styles/Turtle.css";

const allowedExtensions = ["csv"];

const Turtle = () => {
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

      console.log(dataArray);
      setData(dataArray);
    };

    reader.readAsText(file);
  };

  console.log(data);

  return (
    <div>
      <div className="container">
        <label
          htmlFor="csvInput"
          className="labelForCsv"
          style={{ display: "block" }}
        >
          Enter CSV File
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
