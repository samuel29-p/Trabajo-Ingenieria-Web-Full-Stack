import NavBar from "../components/NavBar.jsx";
import { CURSE_LIST } from "../data/Curses.js";

//se llama CursesPage y no Curses para no confundirla con el catalogo CURSES
function CursesPage() {
  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-app-text">Curses</h1>
        <p className="text-app-muted mb-6">
          The 8 curses a haunted object can carry
        </p>

        {/* CURSE_LIST ya es un arreglo, se recorre directo */}
        {/* esta pagina no usa el contexto: el catalogo nunca cambia */}
        {CURSE_LIST.map((curse) => (
          <div
            key={curse.code}
            className="bg-app-surface border border-app-border rounded-card p-4 mb-3"
          >
            <p className="text-app-text font-bold">{curse.name}</p>
            <p className="text-app-muted">{curse.description}</p>
            <p className="text-app-muted text-sm">
              {/* los de reputacion son permanentes, los demas duran unas horas */}
              {curse.effect === "reputation"
                ? "Permanent effect"
                : "Lasts " + curse.durationHours + " hours"}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default CursesPage;