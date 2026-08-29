import NavBar from "../components/NavBar.jsx";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Link } from "react-router-dom"; //Link sirve para navegar sin recargar la pagina

function Home() {
  const { data, auctionWinner, getAlias } = useContext(AppContext);//saco los datos del contexto

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-app-text">PhantomBids</h1>
        <p className="text-app-muted mb-6">Casas de subastas disponibles</p>

        {/* Las llaves { } dentro del JSX significan "aquí adentro esto es JavaScript, no texto" */}
        {/* .map() recorre el arreglo y devuelve otro arreglo, transformando cada elemento */}
        {data.houses.map((casa) => (
        //Link navega sin recargar la página (a diferencia de <a href>, que recarga todo y borra el estado)
        //envuelve la tarjeta completa para que el clic funcione en cualquier parte de ella
        //to es a dónde lleva. Se arma pegando texto con el id: para la casa 2 seria por ejemplo "/house/2"
        //ese "/house/" tiene que coincidir con el path de la ruta en App.jsx
        //key va en el elemento de más afuera de cada vuelta, por eso está aquí y no en el div
        //block hace que el link ocupe todo el ancho (los links por defecto ocupan solo su contenido)
          <Link key={casa.id} to={"/house/" + casa.id} className="block">
            <div className="bg-app-surface border border-app-border rounded-card shadow-card p-4 mb-4">
              <h2 className="text-xl font-bold text-app-text">{casa.name}</h2>
              <p className="text-app-muted">{casa.description}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

export default Home;