import React from "react";
import RecipeItem from "../components/RecipeItem";

const RecipeList = ({ recipes }) => {
  const recipe = recipes[0];

  return (
    <div className="recipe-list">
      {recipe && <RecipeItem recipe={recipe} />}
    </div>
  );
};

export default RecipeList;
