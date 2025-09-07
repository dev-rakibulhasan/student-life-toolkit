import React, { createContext, useContext, useReducer } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

export const StudyTaskContext = createContext();

const studyTaskReducer = (state, action) => {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
      };
    case "SET_STATS":
      return { ...state, stats: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: action.payload };
    default:
      return state;
  }
};

export const StudyTaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(studyTaskReducer, {
    tasks: [],
    stats: null,
    loading: false,
    filters: {
      subject: "All",
      priority: "All",
      status: "All",
    },
  });
  const { user } = useAuth();
  const fetchTasks = async (filters = {}) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await api.get(
        `/study-task/all?${queryParams}&userId=${user._id}`
      );
      dispatch({ type: "SET_TASKS", payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return { success: false, error: error.response?.data?.message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get(`/study-task/stats?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({ type: "SET_STATS", payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const createTask = async (taskData) => {
    try {
      const res = await api.post("/study-task/add", taskData);
      dispatch({ type: "ADD_TASK", payload: res.data });
      await fetchStats();
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error creating task:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const res = await api.put(`/study-task/update/${id}`, taskData);
      dispatch({ type: "UPDATE_TASK", payload: res.data });
      console.log(res);
      await fetchStats();
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error updating task:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await api.patch(`/study-task/toggle/${id}`, {});
      dispatch({ type: "UPDATE_TASK", payload: res.data });
      await fetchStats();
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error toggling task:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/study-task/update/${id}`);
      dispatch({ type: "DELETE_TASK", payload: id });
      await fetchStats();
      return { success: true };
    } catch (error) {
      console.error("Error deleting task:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateFilters = (newFilters) => {
    dispatch({ type: "SET_FILTERS", payload: newFilters });
  };

  return (
    <StudyTaskContext.Provider
      value={{
        tasks: state.tasks,
        stats: state.stats,
        loading: state.loading,
        filters: state.filters,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        updateFilters,
      }}
    >
      {children}
    </StudyTaskContext.Provider>
  );
};
