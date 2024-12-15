import React, { useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import SearchBar from './SearchBar';

const RecipeSearch = () => {
  const [query, setQuery] = useState(''); // Input değerini tutmak için state
  const [results, setResults] = useState([]); // Sonuçları tutmak için state

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/search', {
        ingredients: query, // Backend'e gönderilen data
      });
      setResults(response.data); // Gelen sonuçları state'e ata
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <button
        onClick={handleSearch}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Search
      </button>

      {/* Arama sonuçlarını listele */}
      <div className="mt-6">
        {results.map((recipe) => (
          <div key={recipe.id} className="p-4 border-b">
            <h3 className="font-bold">{recipe.name}</h3>
            <p>{recipe.ingredients}</p>
            <img src={recipe.image_url} alt={recipe.name} className="w-32 h-32 object-cover mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeSearch;
