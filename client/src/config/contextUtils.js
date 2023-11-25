import { useContext } from "react";
import { StateContext } from "./contextStore";

export const useStateContext = () => useContext(StateContext);
