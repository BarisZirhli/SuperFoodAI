import React from "react";
import '../css/SearchBar.css'

function SearchBar({ query, setQuery, loading, error }) {
  return (
    <div className="searchContainer">
      <input
        type="text"
        placeholder="Malzeme giriniz (örneğin: meatball)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Yükleniyor...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default SearchBar;
