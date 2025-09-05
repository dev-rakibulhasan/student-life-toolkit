import React, { createContext, useContext, useReducer } from "react";
import axios from "axios";

const ClassContext = createContext();

const classReducer = (state, action) => {
  switch (action.type) {
    case "SET_CLASSES":
      return { ...state, classes: action.payload };
    case "ADD_CLASS":
      return { ...state, classes: [...state.classes, action.payload] };
    case "UPDATE_CLASS":
      return {
        ...state,
        classes: state.classes.map((cls) =>
          cls._id === action.payload._id ? action.payload : cls
        ),
      };
    case "DELETE_CLASS":
      return {
        ...state,
        classes: state.classes.filter((cls) => cls._id !== action.payload),
      };
    default:
      return state;
  }
};

export const ClassProvider = ({ children }) => {
  const [state, dispatch] = useReducer(classReducer, { classes: [] });

  const fetchClasses = async () => {
    try {
      const res = await axios.get("/api/classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "SET_CLASSES", payload: res.data });
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const addClass = async (classData) => {
    try {
      const res = await axios.post("/api/classes", classData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "ADD_CLASS", payload: res.data });
      return { success: true };
    } catch (error) {
      console.error("Error adding class:", error);
      return { success: false, error: error.response.data.message };
    }
  };

  const updateClass = async (id, classData) => {
    try {
      const res = await axios.put(`/api/classes/${id}`, classData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "UPDATE_CLASS", payload: res.data });
      return { success: true };
    } catch (error) {
      console.error("Error updating class:", error);
      return { success: false, error: error.response.data.message };
    }
  };

  const deleteClass = async (id) => {
    try {
      await axios.delete(`/api/classes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "DELETE_CLASS", payload: id });
      return { success: true };
    } catch (error) {
      console.error("Error deleting class:", error);
      return { success: false, error: error.response.data.message };
    }
  };

  return (
    <ClassContext.Provider
      value={{
        classes: state.classes,
        fetchClasses,
        addClass,
        updateClass,
        deleteClass,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
