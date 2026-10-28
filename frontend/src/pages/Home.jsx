import NavBar from "../components/NavBar.jsx";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Link } from "react-router-dom"; //Link sirve para navegar sin recargar la pagina

function Home() {
  const { data, currentUser } = useContext(AppContext); //saco los datos del contexto

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-app-text">PhantomBids</h1>
        <p className="text-app-muted mb-6">Haunt houses</p>

        {/* el boton de crear casa solo se ve si hay sesion abierta */}
        {currentUser && (
          <Link
            to="/create-house"
            className="inline-block bg-ember-accent hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-button mb-6"
          >
            + New house
          </Link>
        )}

        {/* Las llaves { } dentro del JSX significan "aqui adentro esto es JavaScript, no texto" */}
        {/* .map() recorre el arreglo y devuelve otro arreglo, transformando cada elemento */}
        {data.houses.map((casa) => (
          //Link navega sin recargar la pagina (a diferencia de <a href>, que recarga todo y borra el estado)
          //envuelve la tarjeta completa para que el clic funcione en cualquier parte de ella
          //to es a donde lleva. Se arma pegando texto con el id: para la casa 2 seria "/house/2"
          //ese "/house/" tiene que coincidir con el path de la ruta en App.jsx
          //key va en el elemento de mas afuera de cada vuelta, por eso esta aqui y no en el div
          //block hace que el link ocupe todo el ancho (los links por defecto ocupan solo su contenido)
          <Link key={casa.id} to={"/house/" + casa.id} className="block">
            <div className="bg-app-surface border border-app-border rounded-card shadow-card overflow-hidden mb-4 hover:shadow-card-hover transition-shadow">
              {/* la portada de la casa: sale de public/images */}
              <img
                src={casa.coverImageUrl}
                alt={casa.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-app-text">{casa.name}</h2>
                <p className="text-app-muted">{casa.description}</p>
                {/* el tema de la casa, como etiqueta pequena */}
                <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-pill bg-ember-soft text-ember-accent">
                  {casa.theme}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

export default Home;