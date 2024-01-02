import { Suspense, lazy, createRef } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
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
  Explore,
} from "@pages";
import { Loading } from "@utils";
import Protectedroutes from "./Protectedroutes";
import { Error } from "@components";
const Root = lazy(() => import("@components/Root"));

const token = localStorage.getItem("usertoken");

const AppRoutes = () => {
  const routes = [
    {
      path: "/",
      name: "Home",
      element: (
        <Protectedroutes isAuth={token}>
          <Home />
        </Protectedroutes>
      ),
      nodeRef: createRef(),
    },
    {
      path: "explore",
      name: "Explore",
      element: (
        <Protectedroutes isAuth={token}>
          <Explore />
        </Protectedroutes>
      ),
      nodeRef: createRef(),
    },
    {
      path: "trending",
      name: "Trending",
      element: (
        <Protectedroutes isAuth={token}>
          <Trending />
        </Protectedroutes>
      ),
      nodeRef: createRef(),
    },
    {
      path: "pin/:pinId",
      name: "Pin details",
      element: (
        <Protectedroutes isAuth={token}>
          <Pindetails />
        </Protectedroutes>
      ),
      nodeRef: createRef(),
    },
    {
      path: "search",
      name: "Search",
      element: (
        <Protectedroutes isAuth={token}>
          <Search />
        </Protectedroutes>
      ),
      nodeRef: createRef(),
    },
    {
      path: "profile/:userName",
      name: "User profile",
      element: (
        <Protectedroutes isAuth={token}>
          <Profile />
        </Protectedroutes>
      ),
      nodeRef: createRef(),
    },
    {
      path: "create",
      name: "Create pin",
      element: (
        <Protectedroutes isAuth={token}>
          <CreatePin />
        </Protectedroutes>
      ),
      nodeRef: createRef(),
    },
    {
      path: "verify-account/:userId/:token",
      name: "Verify account",
      element: (
        <Protectedroutes isAuth={token}>
          <AccVerification />
        </Protectedroutes>
      ),
      nodeRef: createRef(),
    },
    {
      path: "login",
      name: "Login",
      element: <Login />,
      nodeRef: createRef(),
    },
    {
      path: "register",
      name: "Register",
      element: <Register />,
      nodeRef: createRef(),
    },
    {
      path: "forgot-password",
      name: "Forgot password",
      element: <ForgotPassword />,
      nodeRef: createRef(),
    },
    {
      path: "reset-password/:id/:token",
      name: "Reset password",
      element: <ResetPassword />,
      nodeRef: createRef(),
    },
  ];

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root routes={routes} />,
      errorElement: <Error />,
      children: routes.map((route) => ({
        index: route.path === "/",
        path: route.path === "/" ? undefined : route.path,
        element: route.element,
      })),
    },
  ]);

  return (
    <Suspense fallback={<Loading text="PINSHOT" />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AppRoutes;
