from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

<<<<<<< HEAD
# Initialize the FastAPI application
app = FastAPI()

# CORS settings: Allows requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend URL can be specified here
=======
# FastAPI uygulamasını başlat
app = FastAPI()

# CORS ayarları: React frontendinden istek yapılmasını sağlar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend URL'si burada belirtilebilir
>>>>>>> 2560b4e (Updated ai module)
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# Load the dataset
df = pd.read_csv("recipes.csv").fillna("")
df['combined_text'] = df['Name'] + " " + df['Description'] + " " + df['Keywords']

# TF-IDF vectorization
=======
# Veri setini yükle
df = pd.read_csv("recipes.csv").fillna("")
df['combined_text'] = df['Name'] + " " + df['Description'] + " " + df['Keywords']

# TF-IDF vektörizasyonu
>>>>>>> 2560b4e (Updated ai module)
vectorizer = TfidfVectorizer(stop_words="turkish")
tfidf_matrix = vectorizer.fit_transform(df['combined_text'])

@app.get("/search/")
def search_recipes(query: str = Query(..., description="Search query")):
    """
<<<<<<< HEAD
    Returns the most relevant recipes based on the user's search query.
    """
    # Vectorize the user query
    query_vector = vectorizer.transform([query])

    # Calculate cosine similarity
    similarities = cosine_similarity(query_vector, tfidf_matrix)
    df['similarity'] = similarities[0]

    # Sort by the highest similarity score
    results = df.sort_values(by='similarity', ascending=False).head(5)

    # Return the necessary columns in JSON format
=======
    Kullanıcının arama sorgusuna göre en alakalı yemekleri döner.
    """
    # Kullanıcı sorgusunu vektörleştir
    query_vector = vectorizer.transform([query])

    # Cosine benzerliğini hesapla
    similarities = cosine_similarity(query_vector, tfidf_matrix)
    df['similarity'] = similarities[0]

    # En yüksek benzerlik skoruna göre sırala
    results = df.sort_values(by='similarity', ascending=False).head(5)

    # Gerekli kolonları JSON formatında döndür
>>>>>>> 2560b4e (Updated ai module)
    recipes = []
    for _, row in results.iterrows():
        recipes.append({
            "name": row["Name"],
            "instructions": row["Description"],
            "image": row["Images"],
            "ingredients": row["RecipeIng"],
            "calories": row["Calories"]
        })
<<<<<<< HEAD
    return {"recipes": recipes}
=======
    return {"recipes": recipes}
>>>>>>> 2560b4e (Updated ai module)
