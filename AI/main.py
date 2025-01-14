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

df = pd.read_csv("utils/recipes.csv").fillna("")  # Boş değerleri doldur
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


# @app.get("/search")
# def search_recipes(ingredients: str):
#     if not ingredients:
#         raise HTTPException(
#             status_code=400, detail="Ingredients field cannot be empty!"
#         )

#     user_query = ingredients.strip()

#     query_vector = vectorizer.transform([user_query])
#     similarities = cosine_similarity(query_vector, tfidf_matrix)

#     df["similarity"] = similarities[0]
#     results = df.sort_values(by="similarity", ascending=False).head(4)

#     recipes = [
#         {
#             "recipeId" :int(row["RecipeId"]),
#             "name": row["Name"],
#             "instructions": row["RecipeInstructions"],
#             "image_url": row["Images"],
#             "ingredients": row["RecipeIngredientParts"],
#             "calories": row["Calories"],
#         }
#         for _, row in results.iterrows()
#     ]

#     return recipes

@app.get("/search")
def get_recommendations(user_id: int, ingredients: str):
    if not ingredients:
        raise HTTPException(
            status_code=400, detail="Ingredients field cannot be empty!"
        )

    user_query = ingredients.strip()
    conn = get_db_connection()

    query_ratings = f'SELECT RecipeId,Rating FROM "Ratings" WHERE UserId = {user_id}'
    df_ratings = pd.read_sql_query(query_ratings, conn)

    if df_ratings.empty:
        raise HTTPException(status_code=404, detail="User has no ratings yet")

    query_recipes = "SELECT id, name, instructions, ingredients, calories FROM recipes"
    df_recipes = pd.read_sql_query(query_recipes, conn)

    query_user = f"SELECT height, weight FROM Users WHERE id = {user_id}"
    user_info = pd.read_sql_query(query_user, conn)

    conn.close()

    if user_info.empty:
        raise HTTPException(status_code=404, detail="User information not found")
    
    height = user_info.iloc[0]["height"]
    weight = user_info.iloc[0]["weight"]

    bmi = calculate_bmi(weight, height)

    tfidf_vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf_vectorizer.fit_transform(df_recipes["instructions"])

    query_vector = tfidf_vectorizer.transform([user_query])
    ingredient_similarities = cosine_similarity(query_vector, tfidf_matrix)

    df_recipes["content_similarity"] = ingredient_similarities[0]

    user_item_matrix = pd.read_sql_query("SELECT UserId, RecipeId, Rating FROM Ratings", conn)
    user_item_matrix = user_item_matrix.pivot(index='UserId', columns='RecipeId', values='Rating').fillna(0)

    user_similarity_matrix = cosine_similarity(user_item_matrix)

    user_similarity_df = pd.DataFrame(user_similarity_matrix, index=user_item_matrix.index, columns=user_item_matrix.index)

    user_similarities = user_similarity_df[user_id].sort_values(ascending=False)

    similar_users = user_similarities.index[1:4]  # En yakın 3 kullanıcıyı al
    collaborative_recipes = []

    for similar_user in similar_users:
        similar_user_ratings = user_item_matrix.loc[similar_user]
        for recipe_id, rating in similar_user_ratings.items():
            if rating >= 4 and recipe_id not in df_ratings['RecipeId'].values:
                collaborative_recipes.append(recipe_id)

    # --- Combine Content-Based and Collaborative Filtering ---

    filtered_recipes = df_recipes[df_recipes['RecipeId'].isin(collaborative_recipes)]

    if bmi < 18.5:
        filtered_recipes = filtered_recipes[filtered_recipes["calories"] > 400]
    elif 18.5 <= bmi < 24.9:
        filtered_recipes = filtered_recipes[(filtered_recipes["calories"] > 300) & (filtered_recipes["calories"] < 700)]
    elif 25 <= bmi < 29.9:
        filtered_recipes = filtered_recipes[filtered_recipes["calories"] < 500]
    else:
        filtered_recipes = filtered_recipes[filtered_recipes["calories"] < 400]

    filtered_recipes["final_similarity"] = (
        filtered_recipes["content_similarity"] + filtered_recipes["content_similarity"]
    ) / 2

    filtered_recipes = filtered_recipes.sort_values(by="final_similarity", ascending=False).head(4)

    recommendations = [
        {
            "recipeId": int(row["id"]),
            "name": row["name"],
            "calories": row["calories"],
            "ingredients": row["ingredients"],
            "instructions": row["instructions"],
            "image_url": row.get("imageUrl", None),
        }
        for _, row in filtered_recipes.iterrows()
    ]

    return recommendations



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="local", port=8000, reload=True)
