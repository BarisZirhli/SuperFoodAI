import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";

const RecipeGrid = ({ searchQuery }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!searchQuery) {
        setRecipes([]); 
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/search?query=${searchQuery}`);
        const data = await response.json();
        setRecipes(data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchQuery]);

  return (
    <div className="p-4">
      {/* Yükleme Durumu */}
      {loading && <p className="text-center text-gray-600">Loading recipes...</p>}

      {/* Tarif Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              title={recipe.name}
              image={recipe.image_url}
              recipe={{
                ingredients: recipe.ingredients.split(", "),
                instructions: recipe.instructions,
                calories: recipe.calories,
              }}
            />
          ))
        ) : (
          !loading && <p className="text-center col-span-full">No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeGrid;