import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import House from "./pages/House.jsx";
import Auction from "./pages/Auction.jsx";
import Profile from "./pages/Profile.jsx";
import CursesPage from "./pages/CursesPage.jsx";
import CreateHouse from "./pages/CreateHouse.jsx";

/* Existen 2 tipos de aplicativos web
1. los spa : Single page application.  **ESTE ES EL QUE USAMOS**
Que una sola pagina renderiza diversos componentes, sin recargas.
2. los mpa: Multi page application. Que cada pagina es una pagina independiente. */
function App() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      {/* cada Route es una pareja: direccion y pantalla que se dibuja */}
      {/* los :id son parametros, se leen con useParams dentro de la pagina */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/curses" element={<CursesPage />} />
        <Route path="/house/:id" element={<House />} />
        <Route path="/auction/:id" element={<Auction />} />
        <Route path="/create-house" element={<CreateHouse />} />
      </Routes>
    </div>
  );
}

export default App;