import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv('recipes.csv')

df = df.fillna("")

user_query = "düşük kalorili tavuk çorbası içmek istiyorum"

df['combined_text'] = df['Name'] + " " + df['Description'] + " " + df['Keywords']

vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df['combined_text'])

query_vector = vectorizer.transform([user_query])

similarities = cosine_similarity(query_vector, tfidf_matrix)

df['similarity'] = similarities[0]
results = df.sort_values(by='similarity', ascending=False).head(5)

for index, row in results.iterrows():
    print(f"Yemek Adı: {row['Name']}")
    print(f"Instructions: {row['RecipeInstructions']}")
    print(f"Image URL: {row['Images']}")
    print(f"Ingredients: {row['RecipeIngredientParts']}")
    print(f"Calories: {row['Calories']}")
    print("-" * 50)