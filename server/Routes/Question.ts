import { Router } from "express";
import {
  createCustomQuestion,
  deleteQuestion,
  generatedQuestionsByAi,
  getAllQuestions,
  updateQuestion,
} from "../Controllers/Question.js";

const questionRouter = Router();

questionRouter.get("/all", getAllQuestions);
questionRouter.post("/generate-by-ai", generatedQuestionsByAi);
questionRouter.post("/create-custom", createCustomQuestion);
questionRouter.put("/update/:id", updateQuestion);
questionRouter.delete("/delete/:id", deleteQuestion);

export default questionRouter;
