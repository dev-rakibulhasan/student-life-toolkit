import { Router } from "express";
import {
  addNewClass,
  deleteClass,
  getAllClasses,
  updateClass,
} from "../Controllers/Class.js";

const classRouter = Router();

classRouter.get("/", getAllClasses);
classRouter.post("/", addNewClass);
classRouter.put("/:id", updateClass);
classRouter.delete("/:id", deleteClass);

export default classRouter;
