import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Signup from "../Pages/Signup/Signup";
import Services from "../Pages/Services/Services";
import InvestingBasics from "../Pages/Services/InvestingBasics";
import InvestingFunctionality from "../Pages/Services/InvestingFunctionality";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
      {
        path: "services",
        element: (
            <Services></Services>
        ),
      },
      {
        path: "investing-basics",
        element: (
            <InvestingBasics></InvestingBasics>
        ),
      },
      {
        path: "basic-functionality",
        element: (
            <InvestingFunctionality></InvestingFunctionality>
        ),
      },
    ],
  },
]);
