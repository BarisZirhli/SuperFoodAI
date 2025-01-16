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

    if df_ratings.empty:
        raise HTTPException(status_code=404, detail="User has no ratings yet")

    query_recipes = 'SELECT "id", "name", "instructions", "ingredients","cookTime", "calories", "imageUrl" FROM "Recipes"'
    df_recipes = pd.read_sql(query_recipes, conn)

    # --- Content-Based Filtering ---
    tfidf_vectorizer = TfidfVectorizer(stop_words=turkish_stop_words)
    tfidf_matrix = tfidf_vectorizer.fit_transform(
        df_recipes["instructions"] + df_recipes["ingredients"]
    )
    query_vector = tfidf_vectorizer.transform([user_query])
    ingredient_similarities = cosine_similarity(query_vector, tfidf_matrix)

    df_recipes["content_similarity"] = ingredient_similarities[0]

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

    similar_users = user_similarities.index[1:5]
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

    # --- Eğer yeterli işbirliği veya kullanıcı benzerliği yoksa, sadece içerik filtrelemesi yap ---
    max_content_similarity = ingredient_similarities.max()
    similarity_threshold = 0.05  # Eşik değeri

    if not collaborative_recipes or max_content_similarity < similarity_threshold:
        # Eğer işbirlikçi öneriler yoksa veya içerik benzerliği düşükse
        filtered_recipes = df_recipes.copy()
    else:
        # Hem işbirlikçi hem içerik tabanlı öneri yap
        filtered_recipes = df_recipes[df_recipes["id"].isin(collaborative_recipes)]

    # --- BMI Filtreleme ---
    query_user = f'SELECT "height", "weight" FROM "Users" WHERE "id" = {user_id}'
    user_info = pd.read_sql(query_user, conn)

    if user_info.empty:
        raise HTTPException(status_code=404, detail="User information not found")

    height = user_info.iloc[0]["height"]
    weight = user_info.iloc[0]["weight"]
    bmi = calculate_bmi(weight, height)

    if bmi < 18.5:
        filtered_recipes = filtered_recipes[filtered_recipes["calories"] > 400]
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
    ).head(3)

    r = [
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
    return r
