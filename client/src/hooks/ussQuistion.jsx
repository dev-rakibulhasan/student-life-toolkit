import { useContext } from "react";
import { QuestionContext } from "../contexts/QuestionContext";

const useQuestion = () => useContext(QuestionContext);
export default useQuestion;
