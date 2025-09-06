import { useContext } from "react";
import { SubjectContext } from "../contexts/SubjectContext";

const useSubject = () => {
  return useContext(SubjectContext);
};
export default useSubject;
