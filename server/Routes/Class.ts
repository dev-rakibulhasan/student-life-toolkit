import { Router } from "express";
import {
  addNewClass,
  deleteClass,
  getAllClasses,
  updateClass,
} from "../Controllers/Class.js";

const classRouter = Router();

classRouter.get("/all", getAllClasses);
classRouter.post("/add", addNewClass);
classRouter.put("/update/:id", updateClass);
classRouter.delete("/delete/:id", deleteClass);

export default classRouter;
