// paso 1
import { createContext } from "react";

export const ThemeContext = createContext("light");
// paso 2
import { useState } from "react";
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }
  const value = { theme, toggleTheme };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
