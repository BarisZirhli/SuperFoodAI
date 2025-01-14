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

export const fetchRecipesWithUser = async (query) => {
  try {
    // Kullanıcı token'ını çözümleyip userId alıyoruz
    const token = await tokenToId();
    const user_id = token.userId;

    // API çağrısı
    const response = await axios.get("http://localhost:8000/search", {
      params: { ingredients: query, user_id: user_id },
    });
    console.log(response.data);

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response.status == 422 && error.response.status === 400) {
      alert("Geçersiz prompt! Lütfen farklı bir giriş yapmayı deneyin.");
    } else {
      console.error("Error fetching recipes:", error);
      alert("Tarifler alınırken bir hata oluştu. Daha sonra tekrar deneyin.");
    }

    return [];
  }
};

export const addFavoriteRecipes = async (recipeId) => {
  try {
    const token = await tokenToId();
    const userId = token.userId;
    const response = await api.post("/api/favorite/addFavorite", {
      userId: userId,
      recipeId: recipeId,
    });
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      throw new Error(error.message || "Network error occurred.");
    }
  }
};

export const addRating = async (recipeId, rating) => {
  try {
    const token = await tokenToId();
    const userId = token.userId;
    const response = await api.post("/api/rating/addRating", {
      userId: userId,
      recipeId: recipeId,
      ratingScore: rating,
    });
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      throw new Error(`${error.message}`);
    }
  }
};

export const getFavorites = async () => {
  try {
    const { data: response } = await api.get("/api/auth/tokenToId", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    const userId = response.userId;

    console.log(userId);

    const { data: favorites } = await api.get(`/api/favorites/${userId}`);

    return favorites;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("Network error occurred.");
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
    throw new Error(`${error}`);
  }
};

export const getFavoriteDetails = async () => {
  try {
    const token = await tokenToId();
    const userId = token.userId;
    console.log(userId);
    const response = await api.get(
      `/api/favorite/getFavoriteDetails/${userId}`
    );
    return response.data.reverse();
  } catch (err) {
    console.error("Error fetching favorites:", err);
    throw new Error(`${err}`);
  }
};

export const deleteFavoriteRecipe = async (recipeId) => {
  try {
    const token = await tokenToId();
    const userId = token.userId;
    const response = await api.delete(
      `/api/favorite/removeFavorite/${userId}/${recipeId}`,
      {
        userId: userId,
        recipeId: recipeId,
      }
    );
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

export const getRating = async (recipeId) => {
  try {
    const token = await tokenToId();
    const userId = token.userId;

    const response = await api.get(`/api/rating/getRating/${userId}/${recipeId}`);
    
    if (response.data && response.data.message === "No ratings found for the user.") {
      console.log("No ratings found for this user and recipe.");
      return null;
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching favorite rating:", error.response.data);
      return error.response.data;
    }
    console.error("Network error occurred:", error);
    throw new Error("An error occurred while fetching the rating.");
  }
};


export const signout = async () => {
  try {
    await api.post("/api/auth/signout");
    localStorage.clear();
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