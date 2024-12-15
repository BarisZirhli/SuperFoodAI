import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-black">
          SuperFoodAI
        </Link>
        <Link
          to="/favourites"
          className="bg-lime-400 px-4 py-2 rounded-full text-black font-semibold hover:bg-lime-500 transition-colors"
        >
          Favourites
        </Link>
      </div>
    </header>
  );
};

export default Header;