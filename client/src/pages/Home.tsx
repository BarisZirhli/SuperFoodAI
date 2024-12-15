import React, { useState } from 'react';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes] = useState([
    {
      id: 1,
      title: 'Fırında Sebzeli Karnıbahar',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
      isFavorite: false
    },
    {
      id: 2,
      title: 'Fırında Fesleğenli Tavuk ve Sebze Çeşnisi',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435',
      isFavorite: true
    },
    {
      id: 3,
      title: 'Bal ve Fesleğenli Tavuklu Kabak Makarna',
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
      isFavorite: false
    },
    {
      id: 4,
      title: 'Tavuklu ve Soya Soslu Mantar Dolması',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      isFavorite: false
    }
  ]);

  return (
    <Layout>
      <div className="space-y-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              image={recipe.image}
              isFavorite={recipe.isFavorite}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;