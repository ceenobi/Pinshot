import { Suspense, lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Root } from "../components";
import { Login, Register } from "../pages";
import { Loading } from "../utils";
import Protectedroutes from "./Protectedroutes";
const Home = lazy(() => import("../pages/Home"));
const Pindetails = lazy(() => import("../pages/Pindetails"));
const Search = lazy(() => import("../pages/Search"));

const Paths = () => {
  const token = localStorage.getItem("usertoken");
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route
          index
          element={
            <Suspense fallback={<Loading text="PINTUBE" />}>
              <Protectedroutes isAuth={token}>
                <Home />
              </Protectedroutes>
            </Suspense>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="pin/:pinId"
          element={
            <Suspense fallback={<Loading text="PINTUBE" />}>
              <Protectedroutes isAuth={token}>
                <Pindetails />
              </Protectedroutes>
            </Suspense>
          }
        />
        <Route
          path="search"
          element={
            <Suspense fallback={<Loading text="PINTUBE" />}>
              <Protectedroutes isAuth={token}>
                <Search />
              </Protectedroutes>
            </Suspense>
          }
        />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default Paths;
