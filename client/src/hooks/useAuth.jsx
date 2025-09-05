import { useContext } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";

export const useAuth = () => {
  return useContext(AuthContext);
};
