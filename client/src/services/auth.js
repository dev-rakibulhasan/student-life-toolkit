import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response;
};

export const getCurrentUser = async (token) => {
  const response = await api.get("/auth/verify", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
