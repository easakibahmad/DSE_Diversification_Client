import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";
import "animate.css";
import { AwesomeButton } from "react-awesome-button";

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
    <div className="navbar z-10 bg-opacity-30 pt-6 px-12 text-white shadow-2xl">
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
              <Link to="/investing-basics">Investing Basics</Link>
            </li>
            <li>
              <Link to="/basic-functionality">Investing Functionality</Link>
            </li>
            {/* <li>
              <a>DSE Stocks</a>
            </li> */}
            <li>
              <a>About Us</a>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          <span className="font-bold text-yellow-500">DSE</span>{" "}
          <span className="">Diversification</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/services">
              <AwesomeButton type="secondary">Our Services</AwesomeButton>
            </Link>
          </li>
          <li>
            <Link to="/investing-basics">
              <AwesomeButton type="secondary">Investing Basics </AwesomeButton>
            </Link>
          </li>
          <li>
            <Link to="/basic-functionality">
              <AwesomeButton type="secondary">
                Investing Functionality{" "}
              </AwesomeButton>
            </Link>
          </li>
          {/* <li>
            <Link>
              <AwesomeButton type="secondary">DSE Stocks</AwesomeButton>
            </Link>
          </li> */}
          <li>
            <Link>
              <AwesomeButton type="secondary">About Us</AwesomeButton>
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <>
            <Link onClick={handleLogOut}>
              <AwesomeButton type="secondary" style={{ width: "100%" }}>
                Logout
              </AwesomeButton>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <AwesomeButton type="secondary" style={{ width: "100%" }}>
                Login
              </AwesomeButton>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
