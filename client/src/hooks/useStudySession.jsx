import { useContext } from "react";
import { StudySessionContext } from "../contexts/StudySessionContext";

const useStudySession = () => useContext(StudySessionContext);
export default useStudySession;
