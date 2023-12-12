import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
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
