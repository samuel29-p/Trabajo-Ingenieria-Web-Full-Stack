import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../components/NavBar.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SuccessMessage from "../components/SuccessMessage.jsx";
import { selectUser, recargarPerfil } from "../store/slices/authSlice";
import { curseService } from "../services/curseService";
import { userService } from "../services/userService";
import { mensajeError } from "../utils/mensajeError";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [maldiciones, setMaldiciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);
  //el formulario arranca con los datos actuales del usuario
  const [username, setUsername] = useState(user.username);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");

  //al abrir la pagina se actualiza la reputacion y se pide el registro de maldiciones
  useEffect(() => {
    async function cargar() {
      try {
        dispatch(recargarPerfil());
        const lista = await curseService.misMaldiciones();
        setMaldiciones(lista);
      } catch (err) {
        setError(mensajeError(err, "Could not load your curses"));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [dispatch]);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setExito("");

    if (username.trim().length < 3) {
      setError("The username must have at least 3 characters");
      return;
    }

    setEnviando(true);
    try {
      await userService.editarUsuario(user._id, {
        username: username.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      //se vuelve a pedir el perfil para que la barra muestre el nombre nuevo
      await dispatch(recargarPerfil());
      setExito("Profile updated");
    } catch (err) {
      setError(mensajeError(err, "Could not update the profile"));
    } finally {
      setEnviando(false);
    }
  }

  const inputClass =
    "w-full border border-app-border rounded-button px-3 py-2 mb-3 bg-app-bg text-app-text";

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <img
          src={user.avatarUrl}
          alt={user.username}
          className="w-20 h-20 rounded-pill mb-3"
        />
        <h1 className="text-3xl font-bold text-app-text">{user.username}</h1>
        <p className="text-app-muted">{user.email}</p>
        <p className="text-app-text">Reputation: {user.reputation}</p>
        <p className="text-app-muted mb-6">
          Member since {new Date(user.joinDate).toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-bold text-app-text mb-3">Edit profile</h2>
        <form onSubmit={handleSave} className="max-w-lg mb-8">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Avatar URL (e.g. /images/AV1.png)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className={inputClass}
          />
          <ErrorMessage mensaje={error} />
          <SuccessMessage mensaje={exito} />
          <button
            type="submit"
            disabled={enviando}
            className="bg-ember-accent hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-button"
          >
            {enviando ? "Saving..." : "Save changes"}
          </button>
        </form>

        <h2 className="text-2xl font-bold text-app-text mb-3">Curse log</h2>

        {loading && <Loading texto="Loading curses..." />}

        {!loading && maldiciones.length === 0 && (
          <p className="text-app-muted">No curses have fallen on you yet.</p>
        )}

        {maldiciones.map((entrada) => (
          <div
            key={entrada._id}
            className="bg-app-surface border border-app-border rounded-card p-4 mb-3"
          >
            <div className="flex justify-between items-center">
              <p className="text-app-text font-bold">{entrada.name}</p>
              {/* active dice si el efecto sigue puesto */}
              <span
                className={
                  entrada.active
                    ? "text-xs font-semibold px-3 py-1 rounded-pill bg-blood-soft text-blood-accent"
                    : "text-xs font-semibold px-3 py-1 rounded-pill bg-app-border text-app-muted"
                }
              >
                {entrada.active ? "Active" : "Expired"}
              </span>
            </div>
            <p className="text-app-muted">{entrada.description}</p>
            <p className="text-app-muted text-sm">
              {/* expiresAt en null significa efecto permanente */}
              {entrada.expiresAt === null
                ? "Permanent"
                : "Expires on " + new Date(entrada.expiresAt).toLocaleString()}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Profile;
