import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Shared/Navbar";
// import Footer from "../Shared/Footer";

const Main = () => {
  const location = useLocation();
  const checkCurrentLocation =
    location.pathname.includes("login") || location.pathname.includes("signup");
  return (
    <div>
      {checkCurrentLocation || <Navbar></Navbar>}
      <Outlet></Outlet>
      {/* {checkCurrentLocation || <Footer></Footer>} */}
    </div>
  );
};

export default Main;
