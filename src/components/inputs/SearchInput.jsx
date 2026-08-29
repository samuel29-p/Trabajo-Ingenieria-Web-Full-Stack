import { PiMagnifyingGlassLight, PiXLight } from "react-icons/pi";

function SearchInput({ placeholder, value, onChange }) {
  return (
    <div className="flex items-center gap-2 p-4 w-full bg-app-surface text-app-muted rounded-button shadow-card transition-colors duration-200">
      <input
        type="text"
        minLength={1}
        maxLength={100}
        placeholder={placeholder}
        value={value}
        className="w-full bg-transparent outline-none text-app-text placeholder:text-app-muted"
        onChange={onChange}
      />
      {value?.length > 0 ? (
        <button
          onClick={() => onChange({ target: { value: "" } })}
          className="cursor-pointer hover:scale-110 transition-transform"
          aria-label="Limpiar búsqueda"
        >
          <PiXLight className="dark:text-white text-app-muted text-2xl" />
        </button>
      ) : (
        <button className="cursor-pointer" aria-label="Buscar">
          <PiMagnifyingGlassLight className="dark:text-white text-app-muted text-2xl" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
