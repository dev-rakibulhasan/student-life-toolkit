import { useContext } from "react";
import { StudyTaskContext } from "../contexts/StudyTaskContext";

const useStudyTask = () => useContext(StudyTaskContext);
export default useStudyTask;
