import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import "../css/RecipeCard.css";
import { FaHeart } from "react-icons/fa";
import { deleteFavoriteRecipe } from "../API/api";
import "../css/FavoriteRecipeCard.css";

import {
  parseIngredients,
  parseInstructions,
  parseImageUrls
} from "../utils/regex";

function FavoriteRecipeCard({
  recipeId,
  title,
  calories,
  cookTime,
  ingredients,
  instructions,
  image
}) {
  const [flipped, setFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(null);

  const handleCardClick = () => {
    setFlipped((prev) => !prev);
  };

  const handleHeartClick = async (e) => {
    e.stopPropagation();

    try {
      const response = await deleteFavoriteRecipe(recipeId);
      setMessage(
        response && response.message
          ? response.message
          : "Recipe removed from favorites!"
      );
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while removing the recipe.");
    }
  };

  const ingredientList = parseIngredients(ingredients);
  const instructionList = parseInstructions(instructions);
  const imageUrls = parseImageUrls(image);
  const firstImage = imageUrls[0];

  return (
    <div style={{ perspective: "1000px" }}>
      <div
        onClick={handleCardClick}
        style={{
          width: "16rem",
          height: "30rem",
          borderRadius: "10px",
          cursor: "pointer",
          display: "grid",
          gap: "20px",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >
        <Card
          className="card"
          style={{
            height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: "10px",
            display: "grid",
            gap: "20px"
          }}
        >
          <Card.Img
            variant="top"
            src={firstImage}
            alt={title}
            style={{
              height: "250px",
              objectFit: "cover",
              borderRadius: "10px 10px 0 0"
            }}
          />
          <Card.Body className="cardBody">
            <Card.Title className="cardTitle">{title}</Card.Title>
            <Card.Text className="caloriesCard">
              <strong>Calories:</strong> {calories} kcal
            </Card.Text>

            {/* Rating Section */}
            <div className="d-flex justify-content-center mb-5">
              <div className="rating">
                {[5, 4, 3, 2, 1].map((value) => (
                  <React.Fragment key={value}>
                    <input
                      type="radio"
                      name="rating"
                      value={value}
                      id={`rating-${value}`}
                      onChange={() => setRating(value)}
                      checked={rating == value}
                    />
                    <label htmlFor={`rating-${value}`}>☆</label>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <Button
              style={{
                all: "unset",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                position: "absolute",
                bottom: "6.5px",
                left: "44%",
                justifyContent: "center"
              }}
              onClick={handleHeartClick}
              aria-label="Remove from favorites"
            >
              <FaHeart style={{ fontSize: "50px", color: "red" }} />
            </Button>
          </Card.Body>
        </Card>

        <Card
          className="text-center"
          style={{
            height: "100%",
            backfaceVisibility: "hidden",
            position: "absolute",
            top: "0",
            transform: "rotateY(180deg)",
            borderRadius: "10px",
            overflowY: "auto",
            paddingBottom: "10px"
          }}
        >
          <Card.Body>
            <Card.Title>Ingredients</Card.Title>
            <ul style={{ textAlign: "left" }}>
              {ingredientList.map((ingredient, index) => (
                <li key={index} style={{ listStyleType: "none" }}>
                  {ingredient}
                </li>
              ))}
            </ul>

            <Card.Title>Instructions</Card.Title>
            <ol style={{ textAlign: "left" }}>
              {instructionList.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </Card.Body>
        </Card>
      </div>

      {/* Message Display */}
      {message && <Alert variant="info">{message}</Alert>}
    </div>
  );
}

export default FavoriteRecipeCard;
