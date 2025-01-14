import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Home.css";
import { fetchRecipesWithUser } from "../API/api";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
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
          const fetchedRecipes = await fetchRecipesWithUser(query);
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

  const handleSearch = () => {
    setQuery(searchInput);
  };

  return (
    <div className="recipeListContainer">
      {loading && <p style={{ textAlign: "center" }}>Yükleniyor...</p>}
      {error && <p>{error}</p>}
      <Container>
        <Row className="justify-content-center">
          {recipes.map((recipe) => (
            <Col xs={12} sm={6} md={4} lg={3} key={recipe.name}>
              <RecipeCard
                className="recipeCard"
                recipeId={recipe.recipeId}
                title={recipe.name}
                calories={recipe.calories}
                ingredients={recipe.ingredients}
                instructions={recipe.instructions}
                cookTime = {recipe.cookTime}
                image={recipe.imageUrl}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <div
        style={{
          position: "absolute",
          bottom: "7%",
          left: "77.8%",
          color: "black",
          zIndex: "100",
        }}
      >
        <button
          onClick={handleSearch}
          style={{
            background: "none",
            border: "none",
            padding: "0",
            cursor: "pointer",
          }}
        >
          <CiSearch className="fs-4 text-dark fw-bolder" />
        </button>
      </div>
      <input
        type="text"
        placeholder="Tavuk göğsü, mantar, kabak, domates, fesleğen, bal, soya sosu, sarımsak ve taze otlar ile yapılabilecek lezzetli yemek tarifleri oluştur.."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        style={{
          position: "fixed",
          bottom: "35px",
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
  );
}
export default Home;
