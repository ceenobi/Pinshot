import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import { userService } from "../services";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await userService.authUser();
        setLoggedInUser(data);
      } catch (error) {
        console.error(error);
      }
    }
    getUser();
  }, []);

  console.log("user", loggedInUser);
  return (
    <StateContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
