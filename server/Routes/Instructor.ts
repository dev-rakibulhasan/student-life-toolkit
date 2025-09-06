import { Router } from "express";
import {
  addNewInstructor,
  deleteInstructor,
  getAllInstructors,
  updateInstructor,
} from "../Controllers/Instructor.js";

const instructorRoute = Router();

instructorRoute.get("/all", getAllInstructors);
instructorRoute.post("/add", addNewInstructor);
instructorRoute.put("/update/:id", updateInstructor);
instructorRoute.delete("/delete/:id", deleteInstructor);

export default instructorRoute;
