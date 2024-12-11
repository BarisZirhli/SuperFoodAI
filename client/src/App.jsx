import React from "react";
import RecipeList from "./components/RecipeList";
import Header from './components/Header'
import './App.css'

const recipes = [
  {
    title: "Chocolate Cake",
    description: "A delicious chocolate cake recipe with rich flavor.",
    image: "https://via.placeholder.com/300x200",
  },
];

const App = () => {
  return (
    <div>
      <Header/>
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default App;
