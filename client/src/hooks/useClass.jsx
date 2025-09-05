import { useContext } from "react";
import { ClassContext } from "../contexts/ClassContext";

export const useClass = () => {
  return useContext(ClassContext);
};
