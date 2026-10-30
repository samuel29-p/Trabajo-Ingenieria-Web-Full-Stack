import { useEffect, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { curseService } from "../services/curseService";
import { mensajeError } from "../utils/mensajeError";

//se llama CursesPage y no Curses para no confundirla con el catalogo
//esta ruta es publica, el catalogo se pide al backend sin necesitar sesion
function CursesPage() {
  const [maldiciones, setMaldiciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const catalogo = await curseService.getCatalogo();
        setMaldiciones(catalogo);
      } catch (err) {
        setError(mensajeError(err, "Could not load the curses"));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-app-text">Curses</h1>
        <p className="text-app-muted mb-6">The 8 curses a haunted object can carry</p>

        {loading && <Loading texto="Loading curses..." />}
        <ErrorMessage mensaje={error} />

        {maldiciones.map((curse) => (
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
