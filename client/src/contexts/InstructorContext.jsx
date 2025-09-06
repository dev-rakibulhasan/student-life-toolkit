import React, { createContext, useContext, useReducer } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

export const InstructorContext = createContext();

const instructorReducer = (state, action) => {
  switch (action.type) {
    case "SET_INSTRUCTORS":
      return { ...state, instructors: action.payload };
    case "ADD_INSTRUCTOR":
      return { ...state, instructors: [...state.instructors, action.payload] };
    case "UPDATE_INSTRUCTOR":
      return {
        ...state,
        instructors: state.instructors.map((instructor) =>
          instructor._id === action.payload._id ? action.payload : instructor
        ),
      };
    case "DELETE_INSTRUCTOR":
      return {
        ...state,
        instructors: state.instructors.filter(
          (instructor) => instructor._id !== action.payload
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const InstructorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(instructorReducer, {
    instructors: [],
    loading: false,
  });
  const { user } = useAuth();

  const fetchInstructors = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.get(`/instructor/all?userId=${user._id}`);
      dispatch({ type: "SET_INSTRUCTORS", payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error fetching instructors:", error);
      return { success: false, error: error.response?.data?.message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createInstructor = async (instructorData) => {
    try {
      const res = await api.post("/instructor/add", instructorData);
      dispatch({ type: "ADD_INSTRUCTOR", payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error creating instructor:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateInstructor = async (id, instructorData) => {
    try {
      const res = await api.put(`/instructor/update/${id}`, instructorData);
      dispatch({ type: "UPDATE_INSTRUCTOR", payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error updating instructor:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteInstructor = async (id) => {
    try {
      await api.delete(`/instructor/delete/${id}`);
      dispatch({ type: "DELETE_INSTRUCTOR", payload: id });
      return { success: true };
    } catch (error) {
      console.error("Error deleting instructor:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  return (
    <InstructorContext.Provider
      value={{
        instructors: state.instructors,
        loading: state.loading,
        fetchInstructors,
        createInstructor,
        updateInstructor,
        deleteInstructor,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
};
