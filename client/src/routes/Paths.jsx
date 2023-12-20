import { Suspense, lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {
  AccVerification,
  CreatePin,
  ForgotPassword,
  Home,
  Login,
  Pindetails,
  Profile,
  Register,
  ResetPassword,
  Search,
  Trending,
} from "../pages";
import { Loading } from "../utils";
import Protectedroutes from "./Protectedroutes";
const Root = lazy(() => import("../components/Root"));

const Paths = () => {
  const token = localStorage.getItem("usertoken");
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <Suspense fallback={<Loading text="PINTUBE" />}>
            <Root />
          </Suspense>
        }
      >
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
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:id/:token" element={<ResetPassword />} />
        <Route
          path="pin/:pinId"
          element={
            <Protectedroutes isAuth={token}>
              <Pindetails />
            </Protectedroutes>
          }
        />
        <Route
          path="search"
          element={
            <Protectedroutes isAuth={token}>
              <Search />
            </Protectedroutes>
          }
        />
        <Route
          path="profile/:userName"
          element={
            <Protectedroutes isAuth={token}>
              <Profile />
            </Protectedroutes>
          }
        />
        <Route
          path="create"
          element={
            <Protectedroutes isAuth={token}>
              <CreatePin />
            </Protectedroutes>
          }
        />
        <Route
          path="trending"
          element={
            <Protectedroutes isAuth={token}>
              <Trending />
            </Protectedroutes>
          }
        />
        <Route
          path="verify-account/:userId/:token"
          element={
            <Protectedroutes isAuth={token}>
              <AccVerification />
            </Protectedroutes>
          }
        />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default Paths;
