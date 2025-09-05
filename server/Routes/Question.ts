import { Router } from "express";
import {
  createCustomQuestion,
  deletedQuestion,
  generatedQuestionsByAi,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
} from "../Controllers/Question.js";

const questionRouter = Router();

questionRouter.get("/all", getAllQuestions);
questionRouter.get("/single/:id", getSingleQuestion);
questionRouter.post("/generate-by-ai", generatedQuestionsByAi);
questionRouter.post("/create-custom", createCustomQuestion);
questionRouter.put("/update/:id", updateQuestion);
questionRouter.delete("/delete/:id", deletedQuestion);

export default questionRouter;
