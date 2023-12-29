const Navbar = () => {
  return (
    <div className="navbar z-10 bg-opacity-30 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white fixed">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu  menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gradient-to-r from-indigo-500 font-bold rounded w-52"
          >
            <li>
              <a>Our Services</a>
            </li>
            <li>
              <a>Investing Basics</a>
            </li>
            <li>
              <a>DSE Stocks</a>
            </li>
            <li>
              <a>About Us</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">DSE Diversification</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Our Services</a>
          </li>
          <li>
            <a>Investing Basics</a>
          </li>
          <li>
            <a>DSE Stocks</a>
          </li>
          <li>
            <a>About Us</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn">Signup Now</a>
      </div>
    </div>
  );
};

export default Navbar;
