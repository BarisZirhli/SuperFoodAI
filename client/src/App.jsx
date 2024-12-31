import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import RecipeList from "./pages/Home";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import {Container} from "react-bootstrap";
import "./App";

function App() {
  return (
    <div className="App">
      <Container>
      <Header/>
      <Routes>
        <Route path="/" element={<RecipeList/>}></Route>
        <Route path="/home" element={<RecipeList/>}></Route>
        <Route path="/favorites" element={<Favorites />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      </Container>
    </div>

  );
}

export default App;
