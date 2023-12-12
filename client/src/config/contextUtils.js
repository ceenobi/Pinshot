import { useContext } from "react";
import { AuthContext } from "./contextStore";

export const useAuthContext = () => useContext(AuthContext);
