import React, {
  useState
} from 'react';
import axios from 'axios';
import {
  Search
} from 'lucide-react';



const SearchBar = () => {
  const [query, setQuery] = useState(''); // Input value
  const [results, setResults] = useState([]); // Search results

  const handleSearch = async () => {
    if (!query) {
      return; // Do not proceed if the query is empty
    }

    try {
      // Pass the 'ingredients' as query parameters in the URL
      const response = await axios.get('http://127.0.0.1:8000/search', {
        params: {
          ingredients: query
        } // Send the user input as a query parameter
      });

      setResults(response.data); // Store the response data in state
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };


  return ( <
    div >
    <
    div className = "relative w-full max-w-3xl mx-auto bg-white rounded-full shadow-lg" >
    <
    input type = "text"
    value = {
      query
    }
    onChange = {
      (e) => setQuery(e.target.value)
    } // Update query on input change
    placeholder = "Search for recipes"
    className = "w-full py-4 px-6 pr-12 rounded-full focus:outline-none text-gray-800" /
    >
    <
    Search className = "absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 cursor-pointer"
    onClick = {
      handleSearch
    } // Trigger search when the icon is clicked
    /> < /
    div >

    {
      /* Search results */
    } <
    div className = "mt-6" > {
      results.map((recipe) => ( <
        div key = {
          recipe.id
        }
        className = "p-4 border-b" >
        <
        h3 className = "font-bold" > {
          recipe.name
        } < /h3> <
        p > {
          recipe.ingredients
        } < /p> <
        img src = {
          recipe.image_url
        }
        alt = {
          recipe.name
        }
        className = "w-32 h-32 object-cover mt-2" / >
        <
        /div>
      ))
    } <
    /div> < /
    div >
  );
};

export default SearchBar;