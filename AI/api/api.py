import os
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

    # Fetch user ratings
    query_ratings = f'SELECT "UserId", "RecipeId", "Rating" FROM "Ratings"'
    df_ratings = pd.read_sql(query_ratings, conn)
    if df_ratings.empty:
        raise HTTPException(status_code=404, detail="User has no ratings yet")

    # Fetch recipe details
    query_recipes = 'SELECT "id", "name", "instructions", "ingredients","cookTime", "calories", "imageUrl" FROM "Recipes"'
    df_recipes = pd.read_sql(query_recipes, conn)

    # Fetch user information
    query_user = f'SELECT "height", "weight" FROM "Users" WHERE "id" = {user_id}'
    user_info = pd.read_sql(query_user, conn)

    if user_info.empty:
        raise HTTPException(status_code=404, detail="User information not found")

    height = user_info.iloc[0]["height"]
    weight = user_info.iloc[0]["weight"]

    # Calculate BMI
    bmi = calculate_bmi(weight, height)
    file_path = r"C:\Users\casper\Desktop\4th Grade - Fall\Graduation Project 1\project\SuperFoodAI-new\AI\api\recipes.csv"
    if os.path.exists(file_path):
        recipedf = pd.read_csv(file_path, encoding="utf-8")
        # print(recipedf)
    else:
        print(f"File not found: {file_path}")
        recipedf = pd.DataFrame()

    # --- Content-Based Filtering ---
    tfidf_vectorizer = TfidfVectorizer(stop_words=turkish_stop_words)
    tfidf_matrix = tfidf_vectorizer.fit_transform(
        df_recipes["instructions"] + df_recipes["ingredients"]
    )
    query_vector = tfidf_vectorizer.transform([user_query])
    ingredient_similarities = cosine_similarity(query_vector, tfidf_matrix)
    if ingredient_similarities.max() < 0.1:
        raise HTTPException(status_code=404, detail="No similar recipes found")

    df_recipes["content_similarity"] = ingredient_similarities[0]
    content_results = df_recipes.sort_values(
        by="content_similarity", ascending=False
    ).head(4)

    # --- Collaborative Filtering ---
    df_ratings = df_ratings.groupby(["UserId", "RecipeId"], as_index=False).agg(
        {"Rating": "mean"}
    )
    user_item_matrix = df_ratings.pivot(
        index="UserId", columns="RecipeId", values="Rating"
    ).fillna(0)

    user_similarity_matrix = cosine_similarity(user_item_matrix)
    user_similarity_df = pd.DataFrame(
        user_similarity_matrix,
        index=user_item_matrix.index,
        columns=user_item_matrix.index,
    )

    user_similarities = (
        user_similarity_df[user_id].drop(user_id).sort_values(ascending=False)
    )

    user_similarity_threshold = 0.1 
    if user_similarities.mean() < user_similarity_threshold:
        return [
            {
                "recipeId": int(row["id"]),
                "name": row["name"],
                "calories": row["calories"],
                "ingredients": row["ingredients"],
                "instructions": row["instructions"],
                "cookTime": row["cookTime"],
                "imageUrl": row.get("imageUrl", None),
            }
            for _, row in content_results.iterrows()
        ]

    similar_users = user_similarities.index[:5]

    collaborative_recipes = []
    current_user_ratings = user_item_matrix.loc[user_id]

    for similar_user in similar_users:
        similar_user_ratings = user_item_matrix.loc[similar_user]
        for recipe_id in similar_user_ratings.items():
            if (
                recipe_id not in current_user_ratings.index
                or current_user_ratings[recipe_id] == 0
            ):
                collaborative_recipes.append(recipe_id)

    collaborative_recipes = list(set(collaborative_recipes))  # Unique recipe IDs
    collaborative_results = df_recipes[df_recipes["id"].isin(collaborative_recipes)]

    # Apply BMI-based filtering
    if bmi < 18.5:
        collaborative_results = collaborative_results[
            collaborative_results["calories"] > 400
        ]
    elif 18.5 <= bmi < 24.9:
        collaborative_results = collaborative_results[
            (collaborative_results["calories"] > 300)
            & (collaborative_results["calories"] < 700)
        ]
    elif 25 <= bmi < 29.9:
        collaborative_results = collaborative_results[
            collaborative_results["calories"] < 500
        ]
    else:
        collaborative_results = collaborative_results[
            collaborative_results["calories"] < 400
        ]

    # Combine and rank recommendations
    combined_results = pd.concat(
        [content_results, collaborative_results]
    ).drop_duplicates(subset="id")
    print(combined_results)
    combined_results["final_similarity"] = combined_results["content_similarity"]
    combined_results = combined_results.sort_values(
        by="final_similarity", ascending=False
    ).head(4)

    # Format results for response
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
        for _, row in combined_results.iterrows()
    ]

    return recommendations


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)