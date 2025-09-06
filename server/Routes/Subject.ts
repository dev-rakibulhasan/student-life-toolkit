import { Router } from "express";
import {
  createNewSubject,
  deleteSubject,
  getAllSubjects,
  updateSubject,
} from "../Controllers/Subject.js";

const subjectRouter = Router();

subjectRouter.get("/all", getAllSubjects);
subjectRouter.post("/add", createNewSubject);
subjectRouter.put("/update/:id", updateSubject);
subjectRouter.delete("/delete/:id", deleteSubject);

export default subjectRouter;
