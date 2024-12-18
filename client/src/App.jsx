import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import RecipeList from "./components/RecipeList";
import Header from "./components/Header";
import RecipeCard from "./components/RecipeCard";
import SearchBar from "./components/SearchBar";
import './App'

function App() {
  return (
    <div className="App">
      <RecipeList />
    </div>
  );
}

export default App;