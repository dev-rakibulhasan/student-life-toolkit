import React, { createContext, useContext, useReducer } from "react";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

export const StudySessionContext = createContext();

const studySessionReducer = (state, action) => {
  switch (action.type) {
    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };
    case "ADD_SESSION":
      return { ...state, sessions: [action.payload, ...state.sessions] };
    case "DELETE_SESSION":
      return {
        ...state,
        sessions: state.sessions.filter(
          (session) => session._id !== action.payload
        ),
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

export const StudySessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(studySessionReducer, {
    sessions: [],
    stats: null,
    loading: false,
    filters: {
      subject: "All",
      timeFilter: "lifetime",
    },
  });
  const { user } = useAuth();
  const fetchSessions = async (filters = {}) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await api.get(
        `/study-session/all?${queryParams}&userId=${user._id}`
      );
      dispatch({ type: "SET_SESSIONS", payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      return { success: false, error: error.response?.data?.message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchStats = async (timeFilter = "lifetime") => {
    try {
      const res = await api.get(
        `/study-session/stats?timeFilter=${timeFilter}&userId=${user._id}`
      );
      dispatch({ type: "SET_STATS", payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const createSession = async (sessionData) => {
    try {
      const res = await api.post("/study-session/add", sessionData);
      dispatch({ type: "ADD_SESSION", payload: res.data });
      await fetchStats(state.filters.timeFilter);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error creating study session:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteSession = async (id) => {
    try {
      await api.delete(`/study-session/delete/${id}`);
      dispatch({ type: "DELETE_SESSION", payload: id });
      await fetchStats(state.filters.timeFilter);
      return { success: true };
    } catch (error) {
      console.error("Error deleting study session:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateFilters = (newFilters) => {
    dispatch({ type: "SET_FILTERS", payload: newFilters });
  };

  return (
    <StudySessionContext.Provider
      value={{
        sessions: state.sessions,
        stats: state.stats,
        loading: state.loading,
        filters: state.filters,
        fetchSessions,
        fetchStats,
        createSession,
        deleteSession,
        updateFilters,
      }}
    >
      {children}
    </StudySessionContext.Provider>
  );
};
