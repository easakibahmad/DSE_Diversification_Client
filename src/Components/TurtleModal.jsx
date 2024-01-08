const TurtleModal = ({
  initialCapital,
  endCapital,
  fileName,
  turtlePositionLogs,
}) => {
  return (
    <>
      <dialog id="turtle_modal" className="modal   text-white">
        <div className="modal-box 	bg-sky-950">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-center font-bold text-xl mb-1">
              Turtle Trading Strategy Results ({fileName})
            </h2>
            <div className="modal-action -mt-1">
              <form method="dialog">
                <button className="text-xl font-bold  rounded-full bg-black  px-2 border-0">
                  X
                </button>
              </form>
            </div>
          </div>
          <hr />
          <h3 className="mt-2 text-2xl text-yellow-500 font-bold mb-2">
            Initial Capital: ${initialCapital}
          </h3>
          <h3 className="mb-4 text-2xl text-yellow-500 font-bold">
            Capital at the end: ${endCapital}
          </h3>
          <div className="grid grid-cols-1 gap-2 font-light">
            {turtlePositionLogs.map((data, index) => (
              <span key={index}>{data}</span>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default TurtleModal;
