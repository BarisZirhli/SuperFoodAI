import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import RecipeGrid from '../components/recipe/RecipeGrid';
import { favoriteRecipes } from '../utils/recipeData';

const Favorites = () => {
  const [favorites] = useState(favoriteRecipes);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Favourite Foods</h1>
          <span className="text-white bg-black/20 px-4 py-1 rounded-full">
            See All ({favorites.length})
          </span>
        </div>
        <RecipeGrid recipes={favorites} />
      </div>
    </Layout>
  );
};

export default Favorites;