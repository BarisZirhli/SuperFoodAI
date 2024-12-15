import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // FastAPI backend URL

export const searchRecipes = async (ingredients: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/search`, {
      ingredients: ingredients
    });
    return response.data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

export const getFavoriteRecipes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/favorites`);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const toggleFavoriteRecipe = async (recipeId: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/favorites/toggle`, {
      recipeId
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};