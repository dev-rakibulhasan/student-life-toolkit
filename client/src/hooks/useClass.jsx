import { useContext } from "react";
import { ClassContext } from "../contexts/ClassContext";

const useClass = () => {
  return useContext(ClassContext);
};
export default useClass;
