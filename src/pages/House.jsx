import NavBar from "../components/NavBar.jsx";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useParams } from "react-router-dom";

function House() {
  const { data, currentUser, joinHouse } = useContext(AppContext);
  const { id } = useParams();

  //los useState van siempre arriba, nunca dentro de un map o un if
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  const casa = data.houses.find((h) => h.id === Number(id));

  if (!casa) {
    return <p className="p-8 text-app-text">Esa casa no existe.</p>;
  }

  const subastas = data.auctions.filter((a) => a.hauntHouseId === casa.id);

  //busco si el usuario conectado ya está en la lista de miembros
  //el ?. es porque currentUser puede ser null si nadie inicia sesión
  const alreadyMember = casa.members.find((m) => m.userId === currentUser?.id);

  function handleJoin() {
    const exito = joinHouse(casa.id, codigo);
    if (!exito) {
      setError("No se pudo unir. Revisa el código o si ya eres miembro.");
    }
  }

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-app-text">{casa.name}</h1>
        <p className="text-app-muted mb-6">{casa.description}</p>

        {/* tres situaciones distintas: sin sesión, ya miembro, o puede unirse */}
        {!currentUser && (
          <p className="text-app-muted mb-6">Inicia sesión para unirte a esta casa.</p>
        )}

        {currentUser && alreadyMember && (
          <p className="text-app-text mb-6">Ya eres miembro de esta casa.</p>
        )}

        {currentUser && !alreadyMember && (
          <div className="mb-6">
            {/* el input del código solo aparece si la casa es privada */}
            {casa.isPrivate && (
              <input
                type="text"
                placeholder="Código de invitación"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="border border-app-border rounded-button px-3 py-2 mr-2 bg-app-bg text-app-text"
              />
            )}
            <button
              onClick={handleJoin}
              className="bg-ember-accent hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-button"
            >
              Unirme
            </button>
            {error && <p className="text-blood-accent mt-2">{error}</p>}
          </div>
        )}

        <h2 className="text-2xl font-bold text-app-text mb-3">Miembros</h2>

        {casa.members.map((miembro) => {
          const user = data.users.find((u) => u.id === miembro.userId);
          return (
            <div
              key={miembro.userId}
              className="bg-app-surface border border-app-border rounded-card p-4 mb-3"
            >
              <p className="text-app-text">{user?.username}</p>
              <p className="text-app-muted">{miembro.role}</p>
            </div>
          );
        })}

        <h2 className="text-2xl font-bold text-app-text mt-8 mb-3">Subastas</h2>

        {subastas.map((subasta) => {
          const objeto = data.objects.find((o) => o.id === subasta.cursedObjectId);
          return (
            <div
              key={subasta.id}
              className="bg-app-surface border border-app-border rounded-card p-4 mb-3"
            >
              <p className="text-app-text font-bold">{objeto?.name}</p>
              <p className="text-app-muted">
                {subasta.status === "closed"
                  ? "Cerrada, ganó con " + subasta.winningBid
                  : subasta.status}
              </p>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default House;