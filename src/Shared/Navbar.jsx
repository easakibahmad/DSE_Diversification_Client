import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";
import "animate.css";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut()
      .then(() => {
        Swal.fire({
          title: "You have been logged out successfully",
          showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
          },
          hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
          },
        });
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="navbar z-10 bg-opacity-30 text-white shadow-2xl">
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
              <Link to="/services">Our Services</Link>
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
        <Link to="/" className="btn btn-ghost text-xl">DSE Diversification</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/services">Our Services</Link>
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
        {user ? (
          <>
            <Link onClick={handleLogOut} className="btn">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
