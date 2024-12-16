import axios from 'axios';

const cors = require('cors');
app.use(cors());

const API_BASE_URL = 'http://localhost:8000'; // FastAPI backend URL

// Tarif arama fonksiyonu
export const searchRecipes = async (ingredients) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/search`, {
      ingredients: ingredients,
    });
    return response.data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Favori tarifleri getirme fonksiyonu
export const getFavoriteRecipes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/favorites`);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

// Favori tarif durumunu değiştirme fonksiyonu
export const toggleFavoriteRecipe = async (recipeId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/favorites/toggle`, {
      recipeId: recipeId,
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};
