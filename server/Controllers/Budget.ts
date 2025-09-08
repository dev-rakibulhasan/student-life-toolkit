import { Request, Response } from "express";
import Budget from "../Models/Budget.js";

// Get all budgets for a user
export const getAllBudgets = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.query.userId;
  try {
    const budgets = await Budget.find({ user }).sort({ date: -1 });
    res.json(budgets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// Get budget summary
export const getBudgetSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.query.userId;
  try {
    const budgets = await Budget.find({ user });

    const incomeByCategory: any = {};
    const expenseByCategory: any = {};
    let totalIncome = 0;
    let totalExpense = 0;

    budgets.forEach((item) => {
      if (item.type === "income") {
        totalIncome += item.amount;
        incomeByCategory[item.category] =
          (incomeByCategory[item.category] || 0) + item.amount;
      } else {
        totalExpense += item.amount;
        expenseByCategory[item.category] =
          (expenseByCategory[item.category] || 0) + item.amount;
      }
    });

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeByCategory,
      expenseByCategory,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// Add a new budget item
export const addBudgetItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, category, amount, description, date, user } = req.body;

    const newBudget = new Budget({
      type,
      category,
      amount,
      description,
      date: date || Date.now(),
      user,
    });

    const savedBudget = await newBudget.save();
    res.json(savedBudget);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// Update budget
export const updateBudgetItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, category, amount, description, date, user } = req.body;

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user },
      { type, category, amount, description, date },
      { new: true }
    );

    if (!updatedBudget) {
      res.status(404).json({ message: "Budget item not found" });
      return;
    }

    res.json(updatedBudget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// Delete Budget
export const deleteBudgetItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedBudget = await Budget.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedBudget) {
      res.status(404).json({ message: "Budget item not found" });
      return;
    }

    res.json({ message: "Budget item deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
