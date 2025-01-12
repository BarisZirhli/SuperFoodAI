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
from scipy.stats import pearsonr

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


def get_db_connection():
    try:
        connection = psycopg2.connect(
            dbname="SuperFoodDb",
            user="postgres",
            password="mitaka",
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

    # Kullanıcıya ait rating verilerini sorgula (favori yemekler)

    query_ratings = f'SELECT "UserId", "RecipeId", "Rating" FROM "Ratings"'

    df_ratings = pd.read_sql(query_ratings, conn)
    print(f"Df_ratings: {df_ratings}")
    print(df_ratings.columns)
    # Eğer kullanıcının favori yemekleri yoksa hata döndürelim
    if df_ratings.empty:
        raise HTTPException(status_code=404, detail="User has no ratings yet")

    # Yemek tariflerini almak için veri çekme
    query_recipes = 'SELECT "id", "name", "instructions", "ingredients", "calories", "imageUrl" FROM "Recipes"'
    df_recipes = pd.read_sql(query_recipes, conn)
    print(f" Df_recipes: {df_recipes}")
    # Kullanıcı bilgilerini almak (height, weight)
    query_user = f'SELECT "height", "weight" FROM "Users" WHERE "id" = {user_id}'
    user_info = pd.read_sql(query_user, conn)
    print(f"User info: {user_info}")

    # Kullanıcı bilgilerini kontrol et
    if user_info.empty:
        raise HTTPException(status_code=404, detail="User information not found")

    height = user_info.iloc[0]["height"]
    weight = user_info.iloc[0]["weight"]

    # BMI hesapla
    bmi = calculate_bmi(weight, height)
    print(f"BMI: {bmi}")

    # --- Content-Based Filtering ---

    # Yemeklerin içerik benzerliğini hesaplamak için TF-IDF
    tfidf_vectorizer = TfidfVectorizer(stop_words=turkish_stop_words)
    tfidf_matrix = tfidf_vectorizer.fit_transform(
        df_recipes["instructions"] + df_recipes["ingredients"]
    )
    print(f"Tf idf matrix: {tfidf_matrix}")
    # Kullanıcı sorgusuna göre içerik benzerliği hesapla (ingredients bazlı)
    query_vector = tfidf_vectorizer.transform([user_query])
    print(f"Query vector: {query_vector}")
    ingredient_similarities = cosine_similarity(query_vector, tfidf_matrix)
    print(f"Ingredients similarities: {ingredient_similarities}")
    # Content similarity'yi DataFrame'e ekle
    df_recipes["content_similarity"] = ingredient_similarities[0]
    print(f"Ingredients similarity:  {ingredient_similarities[0]}")
    # --- Collaborative Filtering ---
    user_item_matrix = df_ratings.pivot(
        index="UserId", columns="RecipeId", values="Rating"
    ).fillna(0)

    print(f" User item matrix: {user_item_matrix}")
    # Kullanıcılar arası benzerlik matrisini hesaplama
    user_similarity_matrix = cosine_similarity(user_item_matrix)

    print(user_similarity_matrix)
    # Kullanıcı benzerliklerini DataFrame'e dönüştürme
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
    # Benzer kullanıcılardan önerilen yemekleri al

    similar_users = user_similarities.index[1:5]
    print(f"Similar users: {similar_users}")

    collaborative_recipes = []

    # Mevcut kullanıcının tarifleri
    current_user_ratings = user_item_matrix.loc[user_id]

    # Benzer kullanıcıların tariflerini kontrol et
    for similar_user in similar_users:
        similar_user_ratings = user_item_matrix.loc[similar_user]
        for recipe_id, rating in similar_user_ratings.items():  # Correct way to iterate
            # Kullanıcının zaten değerlendirdiği tarifleri atla
            if (
                recipe_id not in current_user_ratings.index
                or current_user_ratings[recipe_id] == 0
            ):
                collaborative_recipes.append(recipe_id)
        print(f"Collaborative recipes: {collaborative_recipes}")
    recommendations = []

    # Eğer collaborative_recipes boşsa, işlem yapma
    if collaborative_recipes:
        for recipe_id in collaborative_recipes:
            # SQL sorgusunu oluştur
            query_recommend_recipes = f"""
                SELECT * FROM "Recipes" WHERE "id" = {recipe_id}
            """

    try:
        # SQL sorgusunu çalıştır ve sonucu pandas DataFrame olarak al
        recipe_data = pd.read_sql(query_recommend_recipes, conn)

        # Eğer veri varsa, veriyi ekle
        if not recipe_data.empty:
            recommendations.append(recipe_data)
    except Exception as e:
        print(f"Error fetching data for RecipeId {recipe_id}: {e}")
    else:
        print("No collaborative recipes to recommend.")

    # Sonuçları yazdırma
    print("Recommendations:")
    for recipe in recommendations:
        print(recipe)
    filtered_recipes = df_recipes[df_recipes["id"].isin(collaborative_recipes)]

    if bmi < 18.5:
        # Zayıf (BMI < 18.5) için daha yüksek kalorili yemekler önerilebilir
        filtered_recipes = filtered_recipes["calories"] > 400
    elif 18.5 <= bmi < 24.9:
        # Normal kilolu (BMI 18.5 - 24.9) için orta kalorili yemekler önerilebilir
        filtered_recipes = filtered_recipes[
            (filtered_recipes["calories"] > 300) & (filtered_recipes["calories"] < 700)
        ]
    elif 25 <= bmi < 29.9:
        # Fazla kilolu (BMI 25 - 29.9) için daha düşük kalorili yemekler önerilebilir
        filtered_recipes = filtered_recipes[filtered_recipes["calories"] < 500]
    else:
        # Obez (BMI > 30) için daha düşük kalorili yemekler önerilebilir
        filtered_recipes = filtered_recipes[filtered_recipes["calories"] < 400]

    # Content ve collaborative filtering'i birleştirerek sıralama yap
    filtered_recipes["final_similarity"] = (
        filtered_recipes["content_similarity"] + filtered_recipes["content_similarity"]
    ) / 2

    # Sonuçları sıralayarak en iyi 4 yemeği al
    filtered_recipes = filtered_recipes.sort_values(
        by="final_similarity", ascending=False
    ).head(4)

    # Formatta sonucu hazırlama
    recommendations = [
        {
            "recipeId": int(row["id"]),
            "name": row["name"],
            "calories": row["calories"],
            "ingredients": row["ingredients"],
            "instructions": row["instructions"],
            "imageUrl": row.get("imageUrl", None),
        }
        for _, row in filtered_recipes.iterrows()
    ]
    print(f"Tavsiyeler bunlar: {recommendations}")
    return recommendations


# @app.get("/recommendations")
# def get_recommendations(user_id: int):
#     # PostgreSQL bağlantısını aç
#     conn = get_db_connection()

#     # Kullanıcıya ait rating verilerini sorgula (favori yemekler)
#     query_ratings = f"SELECT RecipeId, Rating FROM Ratings WHERE UserId = {user_id} ORDER BY Rating DESC"
#     df_ratings = pd.read_sql(query_ratings, conn)

#     # Eğer kullanıcının favori yemekleri yoksa hata döndürelim
#     if df_ratings.empty:
#         raise HTTPException(status_code=404, detail="User has no ratings yet")

#     # Yemek tariflerini almak için veri çekme
#     query_recipes = "SELECT id, name, ingredients, instructions, calories FROM Recipes"
#     df_recipes = pd.read_sql(query_recipes, conn)

#     # Kullanıcı bilgilerini almak (height, weight)
#     query_user = f"SELECT height, weight FROM Users WHERE id = {user_id}"
#     user_info = pd.read_sql(query_user, conn)

#     conn.close()

#     # Kullanıcı bilgilerini kontrol et
#     if user_info.empty:
#         raise HTTPException(status_code=404, detail="User information not found")

#     height = user_info.iloc[0]["height"]
#     weight = user_info.iloc[0]["weight"]

#     # BMI hesapla
#     bmi = calculate_bmi(weight, height)

#     # Yemeklerin içerik benzerliğini hesaplamak için TF-IDF
#     tfidf_vectorizer = TfidfVectorizer(stop_words=turkish_stop_words)
#     tfidf_matrix = tfidf_vectorizer.fit_transform(df_recipes["instructions"])

#     # Kullanıcı tarafından favori yemeklerin içerik benzerliğini hesapla
#     user_recipes = df_recipes[df_recipes['RecipeId'].isin(df_ratings['RecipeId'])]
#     query_vector = tfidf_vectorizer.transform(user_recipes["instructions"])
#     content_similarities = cosine_similarity(query_vector, tfidf_matrix)

#     # --- Collaborative Filtering Section ---

#     # Kullanıcılar arası benzerliği hesaplamak için user-item matrix oluşturma
#     user_item_matrix = pd.read_sql("SELECT UserId, RecipeId, Rating FROM Ratings", conn)
#     user_item_matrix = user_item_matrix.pivot(index='UserId', columns='RecipeId', values='Rating').fillna(0)

#     # Kullanıcılar arası benzerlik matrisini hesaplama
#     user_similarity_matrix = cosine_similarity(user_item_matrix)

#     # Kullanıcı benzerliklerini DataFrame'e dönüştürme
#     user_similarity_df = pd.DataFrame(user_similarity_matrix, index=user_item_matrix.index, columns=user_item_matrix.index)

#     # Kullanıcı benzerliklerini al
#     user_similarities = user_similarity_df[user_id].sort_values(ascending=False)

#     # Benzer kullanıcılardan önerilen yemekleri al
#     similar_users = user_similarities.index[1:4]  # En yakın 3 kullanıcıyı al
#     recommended_recipes = []

#     for similar_user in similar_users:
#         similar_user_ratings = user_item_matrix.loc[similar_user]
#         for recipe_id, rating in similar_user_ratings.items():
#             if rating >= 4 and recipe_id not in df_ratings['RecipeId'].values:
#                 recommended_recipes.append(recipe_id)

#     # --- Combine Collaborative Filtering and Content-Based Filtering ---

#     # Filtrelenen yemekler
#     filtered_recipes = df_recipes[df_recipes['RecipeId'].isin(recommended_recipes)]

#     # Kullanıcının BMI'ye göre yemek filtreleme (örneğin, aşırı kalori önermemek)
#     if bmi < 18.5:
#         # Zayıf (BMI < 18.5) için daha yüksek kalorili yemekler önerilebilir
#         filtered_recipes = filtered_recipes[filtered_recipes["calories"] > 400]
#     elif 18.5 <= bmi < 24.9:
#         # Normal kilolu (BMI 18.5 - 24.9) için orta kalorili yemekler önerilebilir
#         filtered_recipes = filtered_recipes[(filtered_recipes["calories"] > 300) & (filtered_recipes["calories"] < 700)]
#     elif 25 <= bmi < 29.9:
#         # Fazla kilolu (BMI 25 - 29.9) için daha düşük kalorili yemekler önerilebilir
#         filtered_recipes = filtered_recipes[filtered_recipes["calories"] < 500]
#     else:
#         # Obez (BMI > 30) için daha düşük kalorili yemekler önerilebilir
#         filtered_recipes = filtered_recipes[filtered_recipes["calories"] < 400]

#     # Önerilecek yemekleri sıralama (benzerlik ve filtrelemeyi birleştir)
#     filtered_recipes["similarity"] = content_similarities.mean(axis=0)
#     filtered_recipes = filtered_recipes.sort_values(by="similarity", ascending=False).head(4)

#     # Sonuçları döndürelim
#     recommendations = [
#         {   "recipeId" :int(row["RecipeId"]),
#             "name": row["Name"],
#             "instructions": row["RecipeInstructions"],
#             "image_url": row["Images"],
#             "ingredients": row["RecipeIngredientParts"],
#             "calories": row["Calories"],
#          } for _, row in filtered_recipes.iterrows()]

# return cursor.fetchAll()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="local", port=8000, reload=True)
