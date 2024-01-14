import React from "react";

const MeanReversionModal = ({
  initialCapital,
  endCapital,
  fileName,
  meanReversionPositionLogs,
}) => {
  return (
    <>
      <dialog id="mean_reversion_modal" className="modal   text-white">
        <div className="modal-box 	bg-sky-950">
          <div className="sticky top-0 z-50  bg-white text-sky-950 pt-2">
            <div className="flex justify-between items-center mb-1 ">
              <h2 className="text-center font-bold text-md mb-1 pl-2">
                Mean Reversion Trading Strategy Results ({fileName})
              </h2>
              <div className="modal-action -mt-1 pr-2">
                <form method="dialog">
                  <button className="text-xl font-bold  rounded-full bg-sky-950 text-white  px-2 border-0">
                    X
                  </button>
                </form>
              </div>
            </div>
            <div className="h-1 w-full bg-red-700"></div>
          </div>
          <h3 className="mt-2 text-2xl text-yellow-500 font-bold mb-8">
            Initial capital: ${initialCapital}
          </h3>
          <h3 className="mb-4 text-2xl text-yellow-500 font-bold">
            See more details:
          </h3>
          <div className="grid grid-cols-1 gap-2 font-light">
            {meanReversionPositionLogs?.map((data, index) => (
              <React.Fragment key={index}>
                <span>{data}</span>
                {index % 2 === 1 && <div className="mb-8" />}
              </React.Fragment>
            ))}
          </div>
          <h3 className="mt-3 text-2xl text-yellow-500 font-bold">
            Capital at the end: ${endCapital}
          </h3>
        </div>
      </dialog>
    </>
  );
};

export default MeanReversionModal;
