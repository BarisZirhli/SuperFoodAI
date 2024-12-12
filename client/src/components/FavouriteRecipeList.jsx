import React from "react";
import RecipeItem from "../RecipeItem";

const FavouriteRecipeList = ({ recipes }) => {
  return (
    <div className="recipe-list">
      {recipes.map((recipe, index) => (
        <RecipeItem
          key={index}
          title={recipe.title}
          frontContent={recipe.frontContent}
          backContent={recipe.backContent}
        />
      ))}
    </div>
  );
};

export default FavouriteRecipeList;
