import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

<<<<<<< HEAD
# Load the dataset
df = pd.read_csv('recipes.csv')

# Fill empty values with an empty string
df = df.fillna("")

# User-provided text input
user_query = "I want to drink a low-calorie chicken soup"

# Combine key columns (Name, Description, Keywords)
# Merge relevant text columns to compare with the user query
df['combined_text'] = df['Name'] + " " + df['Description'] + " " + df['Keywords']

# TF-IDF vectorization
# Convert text data into numerical vectors using the TF-IDF method
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df['combined_text'])

# Vectorize the user query
# Convert the user's query into TF-IDF format
query_vector = vectorizer.transform([user_query])

# Calculate cosine similarity
# Compare the user's query with the recipe dataset to find similarity
similarities = cosine_similarity(query_vector, tfidf_matrix)

# Find the top matches
# Sort recipes by similarity score and get the top 5 results
df['similarity'] = similarities[0]
results = df.sort_values(by='similarity', ascending=False).head(5)

# Return relevant columns (instructions, image, ingredients, calories)
for index, row in results.iterrows():
    print(f"Recipe Name: {row['Name']}")
=======
# Veri setini yükle
df = pd.read_csv('recipes.csv')

# Boş değerleri doldur
df = df.fillna("")

# Kullanıcıdan gelecek olan text
user_query = "düşük kalorili tavuk çorbası içmek istiyorum"

# Anahtar sütunları birleştir (Name, Description, Keywords)
df['combined_text'] = df['Name'] + " " + df['Description'] + " " + df['Keywords']

# TF-IDF vektörizasyonu
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df['combined_text'])

# Kullanıcı query'sini vektörleştir
query_vector = vectorizer.transform([user_query])

# Cosine similarity hesapla
similarities = cosine_similarity(query_vector, tfidf_matrix)

# En yüksek eşleşmeyi bul
df['similarity'] = similarities[0]
results = df.sort_values(by='similarity', ascending=False).head(5)

# Gerekli kolonları döndür (instructions, image, ingredients, calories)
for index, row in results.iterrows():
    print(f"Yemek Adı: {row['Name']}")
>>>>>>> 2560b4e (Updated ai module)
    print(f"Instructions: {row['RecipeInstructions']}")
    print(f"Image URL: {row['Images']}")
    print(f"Ingredients: {row['RecipeIngredientParts']}")
    print(f"Calories: {row['Calories']}")
    print("-" * 50)
