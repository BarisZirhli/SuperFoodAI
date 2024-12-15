import React, { useState } from 'react';
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';

const Favorites: React.FC = () => {
  const [favorites] = useState([
    {
      id: 1,
      title: 'Fırında Kabak ve Patlıcan Graten',
      image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
      isFavorite: true
    },
    {
      id: 2,
      title: 'Fırında Sebzeli Karnıbahar',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
      isFavorite: true
    },
    {
      id: 3,
      title: 'Biber Salatası',
      image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf',
      isFavorite: true
    },
    {
      id: 4,
      title: 'Etli Sebze Güveci',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      isFavorite: true
    }
  ]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Favourite Foods</h1>
          <span className="text-white bg-black/20 px-4 py-1 rounded-full">
            See All ({favorites.length})
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((recipe) => (
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

export default Favorites;