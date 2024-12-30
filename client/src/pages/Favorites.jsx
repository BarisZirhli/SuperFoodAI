import React from "react";
import FavoriteRecipeCar from "../components/FavoriteRecipeCard";

const Favorites = () => {
  // const favoriteRecipes = [
  //   {
  //     name: "Fırında Kabak ve Patlıcan Graten",
  //     img: "https://via.placeholder.com/150", // Görseller için URL ekleyin
  //   },
  //   {
  //     name: "Fırında Sebzeli Karnıbahar",
  //     img: "https://via.placeholder.com/150",
  //   },
  //   {
  //     name: "Biber Salatası",
  //     img: "https://via.placeholder.com/150",
  //   },
  //   {
  //     name: "Etli Sebze Güveci",
  //     img: "https://via.placeholder.com/150",
  //   },
  // ];

  return (
    <div className="container mt-4">
      <header className="text-center bg-success text-white py-3 rounded">
        <h1>SuperFoodAI</h1>
      </header>

      <div className="mt-4">
        <FavoriteRecipe recipes={favoriteRecipes} />
      </div>
    </div>
  );
};

export default Favorites;
