import React, { useState } from "react";
import "../css/RecipeItem.css"; // CSS dosyasını bağlayın

const RecipeItem = ({ recipe }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`recipe-card ${isFlipped ? "flipped" : ""}`}
      onClick={handleFlip}
    >
      <div className="card-front">
        <img src={recipe.image} alt={recipe.title} />
        <h3>{recipe.title}</h3>
      </div>
      <div className="card-back">
        <p>{recipe.description}</p>
      </div>
    </div>
  );
};

export default RecipeItem;
