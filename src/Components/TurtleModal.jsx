
const TurtleModal = ( { initialCapital, endCapital, fileName} ) =>
{
  return (
    <>
      <dialog id="turtle_modal" className="modal   text-white">
        <div className="modal-box bg-blue-950	">
          <h2 className="text-center font-bold pb-1 text-xl">
            Turtle Trading Strategy Results ({fileName})
          </h2>
          <hr />
          <h3 className="mt-2">Initial Capital: {initialCapital}</h3>
          <h3 className="mt-2">Capital at the end: {endCapital}</h3>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default TurtleModal;
