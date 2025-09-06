import { useContext } from "react";
import { InstructorContext } from "../contexts/InstructorContext";

const useInstructor = () => useContext(InstructorContext);
export default useInstructor;
