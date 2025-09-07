import { Router } from "express";
import {
  createNewStudySession,
  deleteStudySession,
  getAllStudySessions,
  getStudySessionStats,
} from "../Controllers/StudySession.js";

const studySessionRouter = Router();

studySessionRouter.get("/all", getAllStudySessions);
studySessionRouter.get("/stats", getStudySessionStats);
studySessionRouter.post("/add", createNewStudySession);
studySessionRouter.delete("/delete/:id", deleteStudySession);

export default studySessionRouter;
