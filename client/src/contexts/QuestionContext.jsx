import React, { createContext, useReducer } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

export const QuestionContext = createContext();

const questionReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };
    case "ADD_QUESTION":
      return { ...state, questions: [action.payload, ...state.questions] };
    case "ADD_QUESTIONS":
      return { ...state, questions: [...action.payload, ...state.questions] };
    case "DELETE_QUESTION":
      return {
        ...state,
        questions: state.questions.filter((q) => q._id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "UPDATE_QUESTION":
      return {
        ...state,
        questions: state.questions.map((q) =>
          q._id === action.payload._id ? action.payload : q
        ),
      };
    default:
      return state;
  }
};

export const QuestionProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(questionReducer, {
    questions: [],
    loading: false,
  });

  const generateQuestions = async (params) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.post("/question/generate-by-ai", params, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "ADD_QUESTIONS", payload: res.data });
      return { success: true, questions: res.data };
    } catch (error) {
      console.error("Error generating questions:", error);
      return { success: false, error: error.response?.data?.message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchQuestions = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await api.get(
        `/question/all?${queryParams}&userId=${user._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch({ type: "SET_QUESTIONS", payload: res.data });
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const addQuestion = async (questionData) => {
    try {
      const res = await api.post("/question/create-custom", questionData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "ADD_QUESTION", payload: res.data });
      return { success: true };
    } catch (error) {
      console.error("Error adding question:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };
  const updateQuestion = async (id, questionData) => {
    try {
      const res = await api.put(`/question/update/${id}`, questionData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "UPDATE_QUESTION", payload: res.data });
      return { success: true, question: res.data };
    } catch (error) {
      console.error("Error updating question:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update question",
      };
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await api.delete(`/question/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "DELETE_QUESTION", payload: id });
      return { success: true };
    } catch (error) {
      console.error("Error deleting question:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        questions: state.questions,
        loading: state.loading,
        generateQuestions,
        fetchQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
