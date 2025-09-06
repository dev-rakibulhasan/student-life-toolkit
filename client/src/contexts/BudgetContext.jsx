import React, { createContext, useContext, useReducer } from "react";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

export const BudgetContext = createContext();

const budgetReducer = (state, action) => {
  switch (action.type) {
    case "SET_BUDGET_ITEMS":
      return { ...state, budgetItems: action.payload };
    case "ADD_BUDGET_ITEM":
      return { ...state, budgetItems: [action.payload, ...state.budgetItems] };
    case "UPDATE_BUDGET_ITEM":
      return {
        ...state,
        budgetItems: state.budgetItems.map((item) =>
          item._id === action.payload._id ? action.payload : item
        ),
      };
    case "DELETE_BUDGET_ITEM":
      return {
        ...state,
        budgetItems: state.budgetItems.filter(
          (item) => item._id !== action.payload
        ),
      };
    case "SET_SUMMARY":
      return { ...state, summary: action.payload };
    default:
      return state;
  }
};

export const BudgetProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(budgetReducer, {
    budgetItems: [],
    summary: null,
  });

  const fetchBudgetItems = async () => {
    try {
      const res = await api.get(`/budget/all?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "SET_BUDGET_ITEMS", payload: res.data });
    } catch (error) {
      console.error("Error fetching budget items:", error);
    }
  };

  const fetchBudgetSummary = async () => {
    try {
      const res = await api.get(`/budget/summary?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "SET_SUMMARY", payload: res.data });
    } catch (error) {
      console.error("Error fetching budget summary:", error);
    }
  };

  const addBudgetItem = async (budgetData) => {
    try {
      const res = await api.post("/budget/add", budgetData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "ADD_BUDGET_ITEM", payload: res.data });
      await fetchBudgetSummary();
      return { success: true };
    } catch (error) {
      console.error("Error adding budget item:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateBudgetItem = async (id, budgetData) => {
    try {
      const res = await api.put(`/budget/update/${id}`, budgetData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "UPDATE_BUDGET_ITEM", payload: res.data });
      await fetchBudgetSummary();
      return { success: true };
    } catch (error) {
      console.error("Error updating budget item:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteBudgetItem = async (id) => {
    try {
      await api.delete(`/budget/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "DELETE_BUDGET_ITEM", payload: id });
      await fetchBudgetSummary();
      return { success: true };
    } catch (error) {
      console.error("Error deleting budget item:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        budgetItems: state.budgetItems,
        summary: state.summary,
        fetchBudgetItems,
        fetchBudgetSummary,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
