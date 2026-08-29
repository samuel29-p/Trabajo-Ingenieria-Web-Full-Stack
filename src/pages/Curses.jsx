import NavBar from "../components/NavBar.jsx";
import { CURSE_LIST } from "../data/Curses.js";

function CursesPage() {
  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-app-text">Maldiciones</h1>
        <p className="text-app-muted mb-6">
          Las 8 maldiciones que puede cargar un objeto embrujado
        </p>

        {/* CURSE_LIST ya es un arreglo, así que se recorre directo */}
        {CURSE_LIST.map((curse) => (
          <div
            key={curse.code}
            className="bg-app-surface border border-app-border rounded-card p-4 mb-3"
          >
            <p className="text-app-text font-bold">{curse.name}</p>
            <p className="text-app-muted">{curse.description}</p>
            <p className="text-app-muted">
              {/* los de reputación son permanentes, los demás duran unas horas */}
              {curse.effect === "reputation"
                ? "Efecto permanente"
                : "Dura " + curse.durationHours + " horas"}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default CursesPage;