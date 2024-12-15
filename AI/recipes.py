import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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
    print(f"Instructions: {row['RecipeInstructions']}")
    print(f"Image URL: {row['Images']}")
    print(f"Ingredients: {row['RecipeIngredientParts']}")
    print(f"Calories: {row['Calories']}")
    print("-" * 50)