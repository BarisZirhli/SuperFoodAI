import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Home.css";
import { fetchRecipes } from "../API/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    } else {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRecipesData = async () => {
      if (query) {
        setLoading(true);
        setError("");
        try {
          const fetchedRecipes = await fetchRecipes(query);
          setRecipes(fetchedRecipes);
        } catch (err) {
          console.error("An error occurred", err);
          setError("An error occurred while fetching recipes.");
        } finally {
          setLoading(false);
        }
      } else {
        setRecipes([]);
      }
    };

    fetchRecipesData();
  }, [query]);

  return (
    <div className="recipeListContainer">
      {loading && <p style={{ textAlign: "center" }}>Yükleniyor...</p>}
      {error && <p>{error}</p>}
      <Container>
      <Row className="justify-content-center">
          {recipes.map((recipe) => (
            <Col xs={12} sm={6} md={3} lg={3} key={recipe.name}>
              <RecipeCard
                className="recipeCard"
                recipeId={recipe.recipeId}
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
export default Home;
