import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AppProvider } from "./context/AppContext.jsx";

/* 
1. Crear el contexto para el tema
const ThemeContext = createContext();

2. Proveer el valor del tema al contexto
<ThemeContext.Provider value="dark">
  <App/>
</ThemeContext.Provider>

3. Consumir el valor del tema
const theme = useContext(ThemeContext);

Context = es un objeto que se encarga de proveer un valor a sus hijos.
Estado global sin prop drilling.
*/

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <AppProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
