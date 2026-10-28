import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import { PiSunDimLight, PiMoonLight } from "react-icons/pi";

function ButtonTheme() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      className="bg-white/20 absolute top-4 right-4 hover:bg-white/40 text-white w-10 h-10 rounded-button flex items-center justify-center text-2xl transition-colors duration-200 "
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <PiMoonLight className="text-blue-800" />
      ) : (
        <PiSunDimLight className="text-amber-300" />
      )}
    </button>
  );
}
export default ButtonTheme;
