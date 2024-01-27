import PropTypes from "prop-types";
import { createContext, useEffect, useState, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { userService } from "@services";
import { useColorScheme } from "@hooks";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [fetchUser, setLoggedInUser] = useState("");
  const loggedInUser = useMemo(() => fetchUser, [fetchUser]);
  const { isDark, setIsDark } = useColorScheme();
  const getUserRef = useRef();

  const toggleColorScheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    getUserRef.current = async () => {
      try {
        const { data } = await userService.authUser();
        setLoggedInUser(data);
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  useEffect(() => {
    if (getUserRef.current) {
      getUserRef.current();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const checkJwtExpiry = async () => {
        const token = JSON.parse(localStorage.getItem("usertoken"));
        if (token) {
          const { exp } = jwtDecode(token);
          if (exp * 1000 < Date.now()) {
            toast.error("Login session expired, sign in to get access");
            localStorage.removeItem("usertoken");
            window.location.replace("/");
          }
        }
      };
      checkJwtExpiry();
    }, 2 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        toggleColorScheme,
        isDark,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
