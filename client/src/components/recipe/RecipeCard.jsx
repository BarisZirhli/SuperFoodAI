import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const RecipeCard = ({ title, image, isFavorite = false, onFavoriteClick, recipe }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-[400px] w-full perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md h-full">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteClick?.();
              }}
              className="absolute bottom-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Malzemeler</h4>
                <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                  {recipe?.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Yapılış</h4>
                <p className="text-sm text-gray-600">{recipe?.instructions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;