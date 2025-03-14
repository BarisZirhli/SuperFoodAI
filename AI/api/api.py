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
import re
from difflib import get_close_matches

turkish_stop_words = [
    "a", "acaba", "altı", "ama", "ancak",
    "bazen", "bazı", "belki", "ben", "benden",
    "beni", "benim", "bir", "biraz", "birçoğu", 
    "biri", "birkaç", "biz", "bizden", "bize",
    "bizi", "bizim", "bu", "bunun", "bunu",
    "bunu", "her", "herhangi", "hem", "hep", 
    "için", "işte", "kadar", "karşı", "kendi",
    "kendine", "ki", "mı", "mi", "çok",
    "çünkü", "de", "den", "daha", "diğer",
    "ile", "ilgili", "çok", "gibi", "hem",
    "henüz", "hep", "herhangi", "hiç", "iç",
    "şu", "şu", "şöyle", "tüm", "tümü",
    "ya", "yani", "yok", "ve","veya","üzere",
]

nltk.download("stopwords")
nltk.download("punkt")
nltk.download("wordnet")

stop_words = list(set(turkish_stop_words))
lemmatizer = WordNetLemmatizer()

food_related_words = []
try:
    with open(r"SuperFoodAI-new/AI/utils/nlpWords.txt", "r", encoding="utf-8") as file:
        food_related_words = [line.strip().lower() for line in file if line.strip()]
except FileNotFoundError:
    print("Hata: 'nlpWords.txt' dosyası bulunamadı.")
    exit()
food_related_words = list(set(food_related_words))


# preprocessing 
def preprocess_text(text):
    phrases = [phrase.strip() for phrase in text.split(",")]

    results = []
    for phrase in phrases:
        original_phrase = phrase.lower()
        phrase = re.sub(r"\d+", "", original_phrase)
        phrase = phrase.translate(str.maketrans("", "", string.punctuation)) 

        words = phrase.split()
        processed_words = [
            lemmatizer.lemmatize(word) for word in words if word not in stop_words
        ]

        close_matches = get_close_matches(" ".join(processed_words), food_related_words, n=3, cutoff=0.7)

        if not close_matches:
            results.append(f"'{original_phrase}' yanlış yazılmış ancak yiyeceklerle ilgili öneri bulunamadı.")
        else:
            suggestion_text = f"'{original_phrase}' yanlış yazılmış. Yiyeceklerle ilgili öneriler: {', '.join(close_matches)}"
            results.append(suggestion_text)

    return "".join(results[0])

# word = "limonlu turto,peynir rulalaro, bastırma"
# print(preprocess_text(word))

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

    user_query = preprocess_text(ingredients)
    print(f"User query: {user_query}");
    print("{preprocess_text(user_query)}")
    conn = get_db_engine()

    # Fetch user ratings
    query_ratings = f'SELECT "UserId", "RecipeId", "Rating" FROM "Ratings"'
    df_ratings = pd.read_sql(query_ratings, conn)
    print(f"Df_ratings: {df_ratings}")
    if df_ratings.empty:
        raise HTTPException(status_code=404, detail="User has no ratings yet")

    # Fetch recipe details
    query_recipes = 'SELECT "id", "name", "instructions", "ingredients","cookTime", "calories", "imageUrl", "avgRate" FROM "Recipes"'
    df_recipes = pd.read_sql(query_recipes, conn)
    print(f" Df_recipes: {df_recipes}")
    # Fetch user information
    query_user = f'SELECT "height", "weight" FROM "Users" WHERE "id" = {user_id}'
    user_info = pd.read_sql(query_user, conn)
    print(f"User info: {user_info}")

    if user_info.empty:
        raise HTTPException(status_code=404, detail="User information not found")

    height = user_info.iloc[0]["height"]
    weight = user_info.iloc[0]["weight"]

    # Calculate BMI
    bmi = calculate_bmi(weight, height)
    print(f"BMI: {bmi}")
    file_path = r"/SuperFoodAI-new/AI/api/recipes.csv"
    if os.path.exists(file_path):
        recipedf = pd.read_csv(file_path, encoding="utf-8")

    else:
        print(f"File not found: {file_path}")
        recipedf = pd.DataFrame()

    # --- Content-Based Filtering ---
    tfidf_vectorizer = TfidfVectorizer(stop_words=turkish_stop_words)
    tfidf_matrix = tfidf_vectorizer.fit_transform(
        df_recipes["instructions"] + df_recipes["ingredients"] + recipedf["Keywords"]
    )

    print(f"recipedf : {recipedf['Keywords']}")
    print(f"Tf idf matrix: {tfidf_matrix}")

    query_vector = tfidf_vectorizer.transform([user_query])
    print(f"Query vector: {query_vector}")

    ingredient_similarities = cosine_similarity(query_vector, tfidf_matrix)
    print(f"Ingredients similarities vector: {ingredient_similarities}")

    if ingredient_similarities.max() < 0.1:
        raise HTTPException(status_code=404, detail="No similar recipes found")
    print(f"Ingredients similarities: {ingredient_similarities}")

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
    print(f" User item matrix: {user_item_matrix}")

    user_similarity_matrix = cosine_similarity(user_item_matrix)

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
                "avgRate": row["avgRate"],
            }
            for _, row in content_results.iterrows()
        ]

    similar_users = user_similarities.index[:5]
    print(f"Similar users: {similar_users}")

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
        print(f"Collaborative recipes: {collaborative_recipes}")

    collaborative_recipes = list(set(collaborative_recipes))

    # Apply BMI-based filtering
    if bmi < 18.5:
        collaborative_results = df_recipes[df_recipes["calories"] > 400]
    elif 18.5 <= bmi < 24.9:
        collaborative_results = df_recipes[
            (df_recipes["calories"] > 300) & (df_recipes["calories"] < 700)
        ]
    elif 25 <= bmi < 29.9:
        collaborative_results = df_recipes[df_recipes["calories"] < 500]
    else:
        collaborative_results = df_recipes[df_recipes["calories"] < 400]

    combined_results = pd.concat(
        [content_results, collaborative_results]
    ).drop_duplicates(subset="id")

    query_favorite = (
        f'SELECT "RecipeId" FROM "FavoriteRecipes" WHERE "UserId" = {user_id}'
    )
    df_favorite_recipes = pd.read_sql(query_favorite, conn)

    favorite_recipe_ids = df_favorite_recipes["RecipeId"].tolist()

    combined_results = combined_results[
        ~combined_results["id"].isin(favorite_recipe_ids)
    ]

    combined_results["final_similarity"] = combined_results["content_similarity"]
    combined_results = combined_results.sort_values(
        by="final_similarity", ascending=False
    )

    top_four_recommendations = combined_results.head(4)

    recommendations = [
        {
            "recipeId": int(row["id"]),
            "name": row["name"],
            "calories": row["calories"],
            "ingredients": row["ingredients"],
            "instructions": row["instructions"],
            "cookTime": row["cookTime"],
            "imageUrl": row.get("imageUrl", None),
            "avgRate": row["avgRate"],
        }
        for _, row in top_four_recommendations.iterrows()
    ]
    print(f"Recommendations : {recommendations}")
    if "favorite_recipe_id" in ingredients:
        favorite_recipe_id = int(ingredients.split(":")[1])
        query_add_favorite = f"""
        INSERT INTO "FavoriteRecipes" ("UserId", "RecipeId")
        VALUES ({user_id}, {favorite_recipe_id})
        """
        try:
            pd.read_sql(query_add_favorite, conn)
        except Exception as e:
            print(f"Error adding favorite: {e}")
    return recommendations


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
