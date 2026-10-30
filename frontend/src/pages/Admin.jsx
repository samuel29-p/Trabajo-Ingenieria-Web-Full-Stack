import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SuccessMessage from "../components/SuccessMessage.jsx";
import { selectUser } from "../store/slices/authSlice";
import { userService } from "../services/userService";
import { auctionService } from "../services/auctionService";
import { mensajeError } from "../utils/mensajeError";

//vista de roles: solo la ve el admin (la ruta va envuelta en AdminRoute)
function Admin() {
  const admin = useSelector(selectUser);

  const [usuarios, setUsuarios] = useState([]);
  const [subastas, setSubastas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);
  //cada vez que cambia este numero se vuelve a pedir todo al backend
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    async function cargar() {
      try {
        const [listaUsuarios, listaSubastas] = await Promise.all([
          userService.getUsuarios(),
          auctionService.getSubastas(),
        ]);
        setUsuarios(listaUsuarios);
        setSubastas(listaSubastas);
      } catch (err) {
        setError(mensajeError(err, "Could not load the admin data"));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [recarga]);

  //borra algo, avisa si salio bien o mal y vuelve a pedir las listas
  async function eliminar(accion, textoExito) {
    setEnviando(true);
    setError("");
    setExito("");
    try {
      await accion();
      setExito(textoExito);
      setRecarga((n) => n + 1);
    } catch (err) {
      setError(mensajeError(err, "Could not delete"));
    } finally {
      setEnviando(false);
    }
  }

  function handleDeleteUser(usuario) {
    if (!window.confirm("Delete " + usuario.username + "?")) return;
    eliminar(() => userService.eliminarUsuario(usuario._id), "User deleted");
  }

  function handleDeleteAuction(subasta) {
    if (!window.confirm("Delete this auction?")) return;
    eliminar(() => auctionService.eliminarSubasta(subasta._id), "Auction deleted");
  }

  const botonBorrar =
    "bg-blood-accent hover:opacity-80 disabled:opacity-60 text-white font-semibold px-3 py-2 rounded-button";

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-app-text mb-6">Admin</h1>

        <ErrorMessage mensaje={error} />
        <SuccessMessage mensaje={exito} />
        {loading && <Loading texto="Loading..." />}

        <h2 className="text-2xl font-bold text-app-text mb-3">Users</h2>
        {usuarios.map((usuario) => (
          <div
            key={usuario._id}
            className="bg-app-surface border border-app-border rounded-card p-4 mb-3 flex justify-between items-center"
          >
            <div>
              <p className="text-app-text font-bold">{usuario.username}</p>
              <p className="text-app-muted text-sm">
                {usuario.email}, {usuario.role}
              </p>
            </div>
            {/* el admin no se puede borrar a si mismo */}
            {usuario._id !== admin._id && (
              <button
                onClick={() => handleDeleteUser(usuario)}
                disabled={enviando}
                className={botonBorrar}
              >
                Delete
              </button>
            )}
          </div>
        ))}

        <h2 className="text-2xl font-bold text-app-text mt-8 mb-3">Auctions</h2>
        {!loading && subastas.length === 0 && (
          <p className="text-app-muted">There are no auctions.</p>
        )}
        {subastas.map((subasta) => (
          <div
            key={subasta._id}
            className="bg-app-surface border border-app-border rounded-card p-4 mb-3 flex justify-between items-center"
          >
            <div>
              <p className="text-app-text font-bold">Auction {subasta._id.slice(-6)}</p>
              <p className="text-app-muted text-sm">{subasta.status}</p>
            </div>
            <button
              onClick={() => handleDeleteAuction(subasta)}
              disabled={enviando}
              className={botonBorrar}
            >
              Delete
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Admin;
