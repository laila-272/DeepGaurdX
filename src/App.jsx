import { useState } from "react";
import { FileProvider } from "./Filecontext";
import "./App.css";
import Chat from "./Chat.jsx";
import Layout from "./Layout";
import Report from "./Report.jsx";
import Sidebar from "./sidebar.jsx";
// import Sidebar from "./Sidebar.jsx";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import Home from "./Home.jsx";
import Forgotpass from "./Forgotpass.jsx";
// import Library from "./Library.jsx";
import Setpass from "./Setpass.jsx";
import Signup from "./Signup.jsx";
import Code from "./Code.jsx";
import PassCode from "./PassCode.jsx";
import AuthLayout from "./Authlayout.jsx";
import Passsuccess from "./Passsuccess.jsx";
import Login from "./Login.jsx";
// import { FileContextProvider } from "./Filecontext";
import Updateprofile from "./Updateprofile.jsx";
import { Navigate } from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Signup" />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Code",
    element: <Code />,
  },
  {
    path: "/Updateprofile",
    element: <Updateprofile />,
  },
  {
    path: "/Forgotpass",
    element: <Forgotpass />,
  },
  {
path: "/PassCode",
element: <PassCode />,
  },
  {
    path: "/Set",
    element: <Setpass />,
  },
  {
    path: "/Report",
    element: <Report />,
  },
  {
    path: "/Passsuccess",
    element: <Passsuccess />,
  },

  {
    path: "/Auth",
    element: <AuthLayout />,
    
  },
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "/home", element: <Home /> },
      // { path: "library", element: <Library /> },
      { path: "Chat", element: <Chat /> },
    ],
  },
]);

function App() {
  return (
    <FileProvider>
      <RouterProvider router={router} />
    </FileProvider>
  );
}

export default App;
