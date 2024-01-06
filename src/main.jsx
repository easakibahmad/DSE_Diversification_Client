import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./Routes/routes";
import AuthProvider from "./Provider/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <div className="bg-gradient-to-r  from-black flex flex-col min-h-screen">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </React.StrictMode>
);
