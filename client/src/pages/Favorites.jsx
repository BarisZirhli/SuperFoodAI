import React, { useEffect, useState } from "react";
import { getFavoriteDetails, tokenToId } from "../API/api";
import FavoriteRecipeCard from "../components/FavoriteRecipeCard";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavoriteDetails();
        setFavorites(data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      }
    };

    fetchFavorites();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!favorites || favorites.length === 0) {
    return <p>No favorite recipes found.</p>;
  }

  return (
    <div className="favorites-container">
      <h1>Favorite Recipes</h1>
      <div className="recipe-list">
        {favorites.map((recipe) => (
          <FavoriteRecipeCard
            key={recipe.id}
            recipeId={recipe.id}
            title={recipe.name}
            calories={recipe.calories}
            cookTime={recipe.cookTime}
            ingredients={recipe.ingredients}
            instructions={recipe.instructions}
            image={recipe.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
