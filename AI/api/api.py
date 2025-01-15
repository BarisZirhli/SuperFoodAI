import psycopg2
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI, HTTPException
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import string
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
import csv

turkish_stop_words = [
    "a",
    "acaba",
    "altı",
    "ama",
    "ancak",
    "bazen",
    "bazı",
    "belki",
    "ben",
    "benden",
    "beni",
    "benim",
    "bir",
    "biraz",
    "birçoğu",
    "biri",
    "birkaç",
    "biz",
    "bizden",
    "bize",
    "bizi",
    "bizim",
    "bu",
    "bunun",
    "bunu",
    "bunu",
    "her",
    "herhangi",
    "hem",
    "hep",
    "için",
    "işte",
    "kadar",
    "karşı",
    "kendi",
    "kendine",
    "ki",
    "mı",
    "mi",
    "çok",
    "çünkü",
    "de",
    "den",
    "daha",
    "diğer",
    "ile",
    "ilgili",
    "çok",
    "gibi",
    "hem",
    "henüz",
    "hep",
    "herhangi",
    "hiç",
    "iç",
    "şu",
    "şu",
    "şöyle",
    "tüm",
    "tümü",
    "ya",
    "yani",
    "yok",
    "ve",
    "veya",
    "üzere",
]

nltk.download("stopwords")
nltk.download("punkt")
nltk.download("wordnet")

stop_words = list(set(turkish_stop_words))
lemmatizer = WordNetLemmatizer()


def preprocess_text(text):
    text = text.lower()
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = " ".join(
        [lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words]
    )

    return text


app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_connection():
    try:
        connection = psycopg2.connect(
            dbname="SuperFoodDb",
            user="postgres",
            password="1234",
            host="localhost",
            port="5432",
        )
        print("Successfully connected to the database!")
        return connection
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None


vectorizer = TfidfVectorizer(
    stop_words=turkish_stop_words, ngram_range=(1, 2), max_features=1000
)


def calculate_bmi(weight, height):
    height_in_meters = height / 100
    bmi = weight / (height_in_meters**2)
    return bmi


def get_db_engine():
    try:
        engine = create_engine(
            "postgresql+psycopg2://postgres:1234@localhost:5432/SuperFoodDb"
        )
        print("Successfully connected to the database!")
        return engine
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None


@app.get("/search")
def get_recommendations(user_id: int, ingredients: str):
    if not ingredients:
        raise HTTPException(
            status_code=400, detail="Ingredients field cannot be empty!"
        )

    user_query = ingredients.strip()
    conn = get_db_engine()

    query_ratings = f'SELECT "UserId", "RecipeId", "Rating" FROM "Ratings"'

    df_ratings = pd.read_sql(query_ratings, conn)
    print(f"Df_ratings: {df_ratings}")
    print(df_ratings.columns)
    if df_ratings.empty:
        raise HTTPException(status_code=404, detail="User has no ratings yet")

    query_recipes = 'SELECT "id", "name", "instructions", "ingredients","cookTime", "calories", "imageUrl" FROM "Recipes"'
    df_recipes = pd.read_sql(query_recipes, conn)
    print(f" Df_recipes: {df_recipes}")
    query_user = f'SELECT "height", "weight" FROM "Users" WHERE "id" = {user_id}'
    user_info = pd.read_sql(query_user, conn)
    print(f"User info: {user_info}")

    if user_info.empty:
        raise HTTPException(status_code=404, detail="User information not found")

    height = user_info.iloc[0]["height"]
    weight = user_info.iloc[0]["weight"]

    # Calculate BMI
    bmi = calculate_bmi(weight, height)
    recipedf = pd.read_csv("../utils/recipes.csv", encoding="utf-8")

    # --- Content-Based Filtering ---
    tfidf_vectorizer = TfidfVectorizer(stop_words=turkish_stop_words)
    tfidf_matrix = tfidf_vectorizer.fit_transform(
        df_recipes["instructions"] + df_recipes["ingredients"] + recipedf["Keywords"]
    )
    print(f"Tf idf matrix: {tfidf_matrix}")
    query_vector = tfidf_vectorizer.transform([user_query])
    print(f"Query vector: {query_vector}")
    ingredient_similarities = cosine_similarity(query_vector, tfidf_matrix)
    print(f"Ingredients similarities: {ingredient_similarities}")

    df_recipes["content_similarity"] = ingredient_similarities[0]
    print(f"Ingredients similarity:  {ingredient_similarities[0]}")
    # --- Collaborative Filtering ---
    user_item_matrix = df_ratings.pivot(
        index="UserId", columns="RecipeId", values="Rating"
    ).fillna(0)

    print(f" User item matrix: {user_item_matrix}")
    user_similarity_matrix = cosine_similarity(user_item_matrix)

    print(user_similarity_matrix)
    user_similarity_df = pd.DataFrame(
        user_similarity_matrix,
        index=user_item_matrix.index,
        columns=user_item_matrix.index,
    )
    print(f"User similarity df : {user_similarity_df}")

    user_similarities = (
        user_similarity_df[user_id].drop(user_id).sort_values(ascending=False)
    )
    print(f"User similarities: {user_similarities}")

    similar_users = user_similarities.index[1:5]
    print(f"Similar users: {similar_users}")

    collaborative_recipes = []

    current_user_ratings = user_item_matrix.loc[user_id]

    for similar_user in similar_users:
        similar_user_ratings = user_item_matrix.loc[similar_user]
        for recipe_id, rating in similar_user_ratings.items():
            if (
                recipe_id not in current_user_ratings.index
                or current_user_ratings[recipe_id] == 0
            ):
                collaborative_recipes.append(recipe_id)
        print(f"Collaborative recipes: {collaborative_recipes}")
    recommendations = []

    if collaborative_recipes:
        for recipe_id in collaborative_recipes:
            query_recommend_recipes = f"""
                SELECT * FROM "Recipes" WHERE "id" = {recipe_id}
            """

    try:
        recipe_data = pd.read_sql(query_recommend_recipes, conn)

        if not recipe_data.empty:
            recommendations.append(recipe_data)
    except Exception as e:
        print(f"Error fetching data for RecipeId {recipe_id}: {e}")
    else:
        print("No collaborative recipes to recommend.")

    print("Recommendations:")
    for recipe in recommendations:
        print(recipe)
    filtered_recipes = df_recipes[df_recipes["id"].isin(collaborative_recipes)]

    if bmi < 18.5:
        filtered_recipes = filtered_recipes["calories"] > 400
    elif 18.5 <= bmi < 24.9:
        filtered_recipes = filtered_recipes[
            (filtered_recipes["calories"] > 300) & (filtered_recipes["calories"] < 700)
        ]
    elif 25 <= bmi < 29.9:
        filtered_recipes = filtered_recipes[filtered_recipes["calories"] < 500]
    else:
        filtered_recipes = filtered_recipes[filtered_recipes["calories"] < 400]

    filtered_recipes["final_similarity"] = (
        filtered_recipes["content_similarity"] + filtered_recipes["content_similarity"]
    ) / 2

    filtered_recipes = filtered_recipes.sort_values(
        by="final_similarity", ascending=False
    ).head(4)

    recommendations = [
        {
            "recipeId": int(row["id"]),
            "name": row["name"],
            "calories": row["calories"],
            "ingredients": row["ingredients"],
            "instructions": row["instructions"],
            "cookTime": row["cookTime"],
            "imageUrl": row.get("imageUrl", None),
        }
        for _, row in filtered_recipes.iterrows()
    ]
    print(f"Tavsiyeler bunlar: {recommendations}")
    return recommendations


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="local", port=8000, reload=True)
