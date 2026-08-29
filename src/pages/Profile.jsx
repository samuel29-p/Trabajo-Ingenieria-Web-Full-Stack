import NavBar from "../components/NavBar.jsx";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { CURSES } from "../data/Curses.js";

function Profile() {
  const { data, currentUser } = useContext(AppContext);

  //si nadie inició sesión, no hay perfil que mostrar
  if (!currentUser) {
    return <p className="p-8 text-app-text">No hay nadie conectado</p>;
  }

  //me quedo con las maldiciones que le cayeron a este usuario (requisitos 20 y 22)
  //el campo que apunta al usuario es userId, no id
  const curses = data.curseLog.filter((c) => c.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <img src={currentUser.avatarUrl} className="w-20 h-20 rounded-pill mb-3" />
        <h1 className="text-3xl font-bold text-app-text">{currentUser.username}</h1>
        <p className="text-app-muted">{currentUser.email}</p>
        <p className="text-app-text">Reputación: {currentUser.reputation}</p>
        <p className="text-app-muted mb-6">Miembro desde {currentUser.joinDate}</p>

        <h2 className="text-2xl font-bold text-app-text mb-3">Maldiciones</h2>

        {/* si no tiene ninguna, muestro un mensaje en vez de una lista vacía */}
        {curses.length === 0 && (
          <p className="text-app-muted">Todavía no te ha caído ninguna maldición.</p>
        )}

        {curses.map((entrada) => {
          //entrada.curse es solo el código, busco su definición en el catálogo
          const curse = CURSES[entrada.curse];
          return (
            <div
              key={entrada.id}
              className="bg-app-surface border border-app-border rounded-card p-4 mb-3"
            >
              <p className="text-app-text font-bold">{curse?.name}</p>
              <p className="text-app-muted">{curse?.description}</p>
              <p className="text-app-muted">
                {/* expiresAt en null significa efecto permanente (requisito 21) */}
                {entrada.expiresAt === null
                  ? "Permanente"
                  : "Expira el " + entrada.expiresAt}
              </p>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default Profile;