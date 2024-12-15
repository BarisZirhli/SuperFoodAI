import React from 'react';
import { Heart } from 'lucide-react';

interface RecipeCardProps {
  title: string;
  image: string;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, image, isFavorite = false, onFavoriteClick }) => {
  return (
    <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md relative">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <button 
        onClick={onFavoriteClick}
        className="absolute bottom-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
      >
        <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-400'}`} />
      </button>
    </div>
  );
};

export default RecipeCard;