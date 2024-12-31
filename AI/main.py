from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()


origins = [
    "http://localhost:5173",  # Frontend (React) origin
    "http://127.0.0.1:5173",  # Another common localhost address
    "http://localhost:3000",  # Frontend (React) origin
    "http://127.0.0.1:3000",  # Another common localhost address
]

# Add the CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from the origins list
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

df = pd.read_csv("recipes.csv").fillna("")  # Boş değerleri doldur
df["combined_text"] = (
    df["Name"] + " " + df["RecipeIngredientParts"] + " " + df["Keywords"]
)

vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df["combined_text"])


favorite_recipes = set()


class SearchRequest(BaseModel):
    ingredients: str


class ToggleFavoriteRequest(BaseModel):
    recipeId: str


@app.get("/search")
def search_recipes(ingredients: str):
    if not ingredients:
        raise HTTPException(
            status_code=400, detail="Ingredients field cannot be empty!"
        )

    user_query = ingredients.strip()

    # Simulate a vectorizer and matrix for the purpose of the example
    query_vector = vectorizer.transform([user_query])
    similarities = cosine_similarity(query_vector, tfidf_matrix)

    df["similarity"] = similarities[0]
    results = df.sort_values(by="similarity", ascending=False).head(4)

    recipes = [
        {
            "recipeId" :int(row["RecipeId"]),
            "name": row["Name"],
            "instructions": row["RecipeInstructions"],
            "image_url": row["Images"],
            "ingredients": row["RecipeIngredientParts"],
            "calories": row["Calories"],
        }
        for _, row in results.iterrows()
    ]

    return recipes


@app.get("/favorites")
def get_favorite_recipes():
    if not favorite_recipes:
        return []
    favorites = []
    for recipe_id in favorite_recipes:
        recipe = df.loc[df["id"] == int(recipe_id)].iloc[0]
        favorites.append(
            {
                "id": str(recipe["id"]),
                "name": recipe["Name"],
                "instructions": recipe["RecipeInstructions"],
                "image_url": recipe["Images"],
                "ingredients": recipe["RecipeIngredientParts"],
                "calories": recipe["Calories"],
            }
        )
    return favorites


@app.post("/favorites/toggle")
def toggle_favorite_recipe(request: ToggleFavoriteRequest):
    recipe_id = request.recipeId.strip()

    if not recipe_id:
        raise HTTPException(status_code=400, detail="Recipe ID cannot be empty!")

    if recipe_id in favorite_recipes:
        favorite_recipes.remove(recipe_id)
        return {"message": "Recipe removed from favorites", "status": "removed"}
    else:
        favorite_recipes.add(recipe_id)
        return {"message": "Recipe added to favorites", "status": "added"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="local", port=8000, reload=True)
