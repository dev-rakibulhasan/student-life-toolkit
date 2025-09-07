import { Router } from "express";
import {
  addNewInstructor,
  deleteInstructor,
  getAllInstructors,
  updateInstructor,
} from "../Controllers/Instructor.js";

const instructorRouter = Router();

instructorRouter.get("/all", getAllInstructors);
instructorRouter.post("/add", addNewInstructor);
instructorRouter.put("/update/:id", updateInstructor);
instructorRouter.delete("/delete/:id", deleteInstructor);

export default instructorRouter;
