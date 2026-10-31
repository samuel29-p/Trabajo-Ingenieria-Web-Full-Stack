import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; //Link sirve para navegar sin recargar la pagina
import NavBar from "../components/NavBar.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { houseService } from "../services/houseService";
import { mensajeError } from "../utils/mensajeError";

function Home() {
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //al abrir la pagina se piden las casas al backend, una sola vez
  useEffect(() => {
    async function cargar() {
      try {
        const datos = await houseService.getCasas();
        setCasas(datos);
      } catch (err) {
        setError(mensajeError(err, "Could not load the houses"));
      } finally {
        //pase lo que pase se apaga el loading
        setLoading(false);
      }
    }
    cargar();
  }, []);

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-app-text">PhantomBids</h1>
        <p className="text-app-muted mb-6">Haunt houses</p>

        <Link
          to="/create-house"
          className="inline-block bg-ember-accent hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-button mb-6"
        >
          + New house
        </Link>

        {loading && <Loading texto="Loading houses..." />}
        <ErrorMessage mensaje={error} />

        {!loading && !error && casas.length === 0 && (
          <p className="text-app-muted">There are no houses yet.</p>
        )}

        {casas.map((casa) => (
          //en mongo el id se llama _id, ya no id como en los datos de prueba
          <Link key={casa._id} to={"/house/" + casa._id} className="block">
            <div className="bg-app-surface border border-app-border rounded-card shadow-card overflow-hidden mb-4 hover:shadow-card-hover transition-shadow">
              {/* la portada es opcional, si la casa no tiene no se dibuja la imagen rota */}
              {casa.coverImageUrl && (
                <img
                  src={casa.coverImageUrl}
                  alt={casa.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold text-app-text">{casa.name}</h2>
                <p className="text-app-muted">{casa.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-pill bg-ember-soft text-ember-accent">
                    {casa.theme}
                  </span>
                  {/* la cantidad de miembros es el largo del arreglo members */}
                  <span className="text-app-muted text-sm">
                    {casa.members.length} members
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

export default Home;
