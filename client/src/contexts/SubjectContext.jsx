import React, { createContext, useContext, useReducer } from "react";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

export const SubjectContext = createContext();

const subjectReducer = (state, action) => {
  switch (action.type) {
    case "SET_SUBJECTS":
      return { ...state, subjects: action.payload };
    case "ADD_SUBJECT":
      return { ...state, subjects: [...state.subjects, action.payload] };
    case "UPDATE_SUBJECT":
      return {
        ...state,
        subjects: state.subjects.map((subject) =>
          subject._id === action.payload._id ? action.payload : subject
        ),
      };
    case "DELETE_SUBJECT":
      return {
        ...state,
        subjects: state.subjects.filter(
          (subject) => subject._id !== action.payload
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const SubjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(subjectReducer, {
    subjects: [],
    loading: false,
  });
  const { user } = useAuth();

  const fetchSubjects = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.get(`/subject/all?userId=${user._id}`);
      dispatch({ type: "SET_SUBJECTS", payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return { success: false, error: error.response?.data?.message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createSubject = async (subjectData) => {
    try {
      const res = await api.post("/subject/add", subjectData);
      dispatch({ type: "ADD_SUBJECT", payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error creating subject:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateSubject = async (id, subjectData) => {
    try {
      const res = await api.put(`/subject/update/${id}`, subjectData);
      console.log(res);
      dispatch({ type: "UPDATE_SUBJECT", payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error updating subject:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteSubject = async (id) => {
    try {
      await api.delete(`/subject/delete/${id}`);
      dispatch({ type: "DELETE_SUBJECT", payload: id });
      return { success: true };
    } catch (error) {
      console.error("Error deleting subject:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  return (
    <SubjectContext.Provider
      value={{
        subjects: state.subjects,
        loading: state.loading,
        fetchSubjects,
        createSubject,
        updateSubject,
        deleteSubject,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};
