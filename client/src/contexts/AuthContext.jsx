import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          const { data } = await getCurrentUser(token);
          setUser(data.user);
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const { data } = await loginUser(credentials);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      return {
        success: data.success,
        role: data.user.role,
        message: data.message,
      };
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await registerUser(userData);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      return {
        success: data.success,
        role: data.user.role,
        message: data.message,
      };
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
