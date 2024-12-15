import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import SearchBar from '../components/search/SearchBar';
import RecipeGrid from '../components/recipe/RecipeGrid';
import { defaultRecipes } from '../utils/recipeData';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes] = useState(defaultRecipes);

  return (
    <Layout>
      <div className="space-y-8">
        <RecipeGrid recipes={recipes} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
    </Layout>
  );
};

export default Home;