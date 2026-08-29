import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeContext } from "./context/ThemeContext.jsx";
import { useContext } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import House from "./pages/House.jsx";
/* Existen 2 tipos de aplicativos web
1. los spa : Single paage application.  **ESTE ES EL QUE USAMOS**
Que una sola pagina reneriza diversos componentes, sin recargas.
2. los mpa: Multi page application. Que cada pagina es una pagina independiente. */
function App() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/house/:id" element={<House />} />
      </Routes>
    </div>
  );
}

export default App;