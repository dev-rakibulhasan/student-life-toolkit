import { useContext } from "react";
import { BudgetContext } from "../contexts/BudgetContext";

const useBudget = () => useContext(BudgetContext);
export default useBudget;
