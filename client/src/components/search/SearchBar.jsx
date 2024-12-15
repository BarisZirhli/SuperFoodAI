import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto bg-white rounded-full shadow-lg">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tavuk göğsü, mantar, kabak, domates, fesleğen, bal, soya sosu, sarımsak ve taze otlar ile yapılabilecek lezzetli yemek tarifleri oluştur"
        className="w-full py-4 px-6 pr-12 rounded-full focus:outline-none text-gray-800"
      />
      <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
    </div>
  );
};

export default SearchBar;