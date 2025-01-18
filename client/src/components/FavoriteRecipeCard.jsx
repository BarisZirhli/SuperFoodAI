import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import "../css/RecipeCard.css";
import { FaHeart } from "react-icons/fa";
import { deleteFavoriteRecipe } from "../API/api";
import "../css/FavoriteRecipeCard.css";
import { addRating, getRating } from "../API/api";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import {
  parseIngredients,
  parseInstructions,
  parseImageUrls,
  convertCookingTime,
} from "../utils/regex";

function FavoriteRecipeCard({
  recipeId,
  title,
  calories,
  cookTime,
  ingredients,
  instructions,
  image,
  avgRate,
  rate,
}) {
  const [flipped, setFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const handleRatingChange = async (e) => {
    e.stopPropagation();
    const numericRating = e.target.value;
    setSelectedRating(Number(numericRating));
    console.log(numericRating);
    console.log(recipeId);
    const response = await addRating(recipeId, numericRating);
    console.log(`Response: ${response}`);
    console.log(`Seçilen puan: ${numericRating}`);
  };

  const handleCardClick = () => {
    setFlipped((prev) => !prev);
  };

  const handleHeartClick = async (e) => {
    e.stopPropagation();

    console.log("Heart button clicked! Recipe ID:", recipeId);
    try {
      const response = await deleteFavoriteRecipe(recipeId);
      if (response && response.message) {
        setMessage(response.message);
      } else {
        setMessage("Recipe removed from favorites!");
      }
    } catch (error) {
      console.error(`${error}`);
      setMessage("An error occurred while removing the recipe.");
    }
  };

  const ingredientList = parseIngredients(ingredients);
  const instructionList = parseInstructions(instructions);
  const imageUrls = parseImageUrls(image);
  const firstImage = imageUrls[0];
  const cookTimes = convertCookingTime(cookTime);
  return (
    <div style={{ perspective: "1000px" }}>
      <div
        onClick={handleCardClick}
        style={{
          width: "20rem",
          height: "30rem",
          borderRadius: "10px",
          cursor: "pointer",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <Card
          className="text-center"
          style={{
            height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: "10px",
            display: "grid",
            gap: "10px",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          <Card.Img
            variant="top"
            src={firstImage}
            alt={title}
            style={{
              height: "230px",
              objectFit: "cover",
              borderRadius: "10px 10px 0 0",
            }}
          />
          <Card.Body>
            <Card.Title className="cardTitle">{title}</Card.Title>
            <Card.Text className="caloriesCard">
              <strong>Calories:</strong> {calories} kcal
            </Card.Text>
           {/* Rating Section */}
           <div className="d-flex justify-content-center mb-5">
              <div className="text-center mb-2">
                <div className="rating d-flex">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span key={index}>
                      {index < avgRate ? (
                        <FaStar color="gold" size={20} />
                      ) : (
                        <CiStar color="gray" size={20} />
                      )}
                    </span>
                  )).reverse()}
                </div>
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
                justifyContent: "center",
              }}
              onClick={handleHeartClick}
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
            paddingBottom: "10px",
          }}
        >
          <Card.Body className="card-body">
            <Card.Title>Ingredients</Card.Title>
            <ul style={{ textAlign: "left" }}>
              {ingredientList.map((ingredient, index) => (
                <li
                  style={{
                    listStyleType: "none",
                  }}
                  key={index}
                >
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
            <p className="mt-4">
              <b>Cook Time: </b>
              {cookTimes}
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default FavoriteRecipeCard;