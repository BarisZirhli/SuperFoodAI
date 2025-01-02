import axios from "axios";

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

export const fetchRecipes = async (query) => {
  try {
    const response = await axios.get("http://localhost:8000/search", {
      params: { ingredients: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const addFavoriteRecipes = async (userId, recipeId) => {
  try {
    const response = await api.post("/api/favorite/like", {
      userId: userId,
      recipeId: recipeId,
    });
    console.log(userId, recipeId);
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      throw new Error(error.message || "Network error occurred.");
    }
  }
};

export const tokenToId = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    const { data: tokenResponse } = await api.get("/api/auth/tokenToId", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Token response:", tokenResponse);
    return tokenResponse;
  } catch (error) {
    console.error("Error fetching token to ID:", error);
    throw new Error("Failed to fetch token to ID");
  }
};

export const getFavorites = async () => {
  try {
    const { response } = await api.get("/api/auth/tokenToId", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    console.log(response.userId);
    const { data: favorites } = await api.get(`/api/favorites/${userId}`);

    return favorites;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("Network error occurred.");
  }
};

export const signout = async () => {
  try {
    await api.post("/api/auth/signout");
    localStorage.removeItem("authToken");
    return { message: "Signed out successfully" };
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("Network error occurred.");
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete("/api/auth/delete-account");

    localStorage.removeItem("authToken");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("Network error occurred.");
  }
};

export default api;
