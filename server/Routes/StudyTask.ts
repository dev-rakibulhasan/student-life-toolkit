import { Router } from "express";
import {
  addNewStudyTask,
  deleteStudyTask,
  getAllStudyTasks,
  getStudyTaskStates,
  toggleTaskCompletion,
  updateStudyTask,
} from "../Controllers/StudyTask.js";

const studyTaskRouter = Router();

studyTaskRouter.get("/all", getAllStudyTasks);
studyTaskRouter.get("/stats", getStudyTaskStates);
studyTaskRouter.post("/add", addNewStudyTask);
studyTaskRouter.put("/update/:id", updateStudyTask);
studyTaskRouter.patch("/toggle/:id", toggleTaskCompletion);
studyTaskRouter.delete("/delete/:id", deleteStudyTask);

export default studyTaskRouter;
