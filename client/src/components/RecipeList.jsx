import axios from "axios";
import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import { Container, Row, Col } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/RecipeList.css";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:8000/search", {
        params: { ingredients: query },
      });
      setRecipes(response.data);
    } catch (err) {
      console.error("An error occurred", err);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchRecipes();
    } else {
      setRecipes([]);
    }
  }, [query]);

  return (
    <div className="recipeListContainer">
      {loading && <p style={{ textAlign: "center" }}>Yükleniyor...</p>}
      {error && <p>{error}</p>}
      <Container>
        <Row>
          {recipes.map((recipe) => (
            <Col xs={12} sm={6} md={3} lg={3} key={recipe.name}>
              <RecipeCard
                className="recipeCard"
                title={recipe.name}
                calories={recipe.calories}
                ingredients={recipe.ingredients}
                instructions={recipe.instructions}
                image={
                  Array.isArray(recipe.image_url)
                    ? recipe.image_url[0]
                    : recipe.image_url
                }
              />
            </Col>
          ))}
        </Row>
      </Container>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Tavuk göğsü, mantar, kabak, domates, fesleğen, bal, soya sosu, sarımsak ve taze otlar ile yapılabilecek lezzetli yemek tarifleri oluştur.."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            position: "fixed",
            bottom: "15px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "15px 40px 15px 15px",
            fontSize: "16px",
            width: "60%",
            color: "black",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "50px",
            outline: "none",
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
    </div>
  );
}

export default RecipeList;