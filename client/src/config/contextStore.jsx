import PropTypes from "prop-types";
import { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { userService } from "../services";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await userService.authUser();
        setLoggedInUser((prevUser) => {
          if (prevUser !== data) {
            return data;
          }
          return prevUser;
        });
      } catch (error) {
        console.error(error);
      }
    }
    getUser();
  }, []);

  const checkJwtExpiry = useCallback(async () => {
    const token = JSON.parse(localStorage.getItem("usertoken"));
    if (token) {
      const { exp } = jwtDecode(token);
      if (exp * 1000 < Date.now()) {
        localStorage.removeItem("userinfo");
        location.replace("/");
        toast.error("Token expired, sign in to get access");
      }
    }
  }, []);

  useEffect(() => {
    checkJwtExpiry();
  }, [checkJwtExpiry]);

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
