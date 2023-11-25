// import React, { lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Root } from "../components";
import { Home, Login, Register } from "../pages";
import Protectedroutes from "./Protectedroutes";

const Paths = () => {
  const token = localStorage.getItem("usertoken");
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route
          index
          element={
            <Protectedroutes isAuth={token}>
              <Home />
            </Protectedroutes>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default Paths;
