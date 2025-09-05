import { Router } from "express";
import {
  addBudgetItem,
  deleteBudgetItem,
  getAllBudgets,
  getBudgetSummary,
  updateBudgetItem,
} from "../Controllers/Budget.js";

const budgetRouter = Router();

budgetRouter.get("/all", getAllBudgets);
budgetRouter.get("/summary", getBudgetSummary);
budgetRouter.post("/add", addBudgetItem);
budgetRouter.put("/update/:id", updateBudgetItem);
budgetRouter.delete("/delete/:id", deleteBudgetItem);

export default budgetRouter;
