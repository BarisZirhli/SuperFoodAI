import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = async (formData) => {
  try {
    const response = await api.post("/api/auth/signup", formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("Network error occurred.");
  }
};

export const login = async (formData) => {
    try {
      const response = await api.post("/api/auth/login", formData);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw new Error("Network error occurred.");
    }
  };

export default api;
