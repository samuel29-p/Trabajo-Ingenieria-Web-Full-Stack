import NavBar from "../components/NavBar.jsx";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useParams, Link } from "react-router-dom";

function House() {
  const { data, currentUser, joinHouse } = useContext(AppContext);
  const { id } = useParams(); //el id que viene en la direccion, como TEXTO

  //los useState van siempre arriba, nunca dentro de un map o un if
  const [codigo, setCodigo] = useState(""); //lo que el usuario escribe en el input del codigo
  const [error, setError] = useState(""); //mensaje de error, vacio = no mostrar nada

  //Number(id) porque useParams devuelve texto y los ids de las casas son numeros
  const casa = data.houses.find((h) => h.id === Number(id));

  //salida temprana: si no existe, muestro un mensaje y no sigo
  if (!casa) {
    return <p className="p-8 text-app-text">That house does not exist.</p>;
  }

  //de las 6 subastas que hay en total, me quedo solo con las de esta casa
  //va despues del if porque aqui ya se que casa existe
  const subastas = data.auctions.filter((a) => a.hauntHouseId === casa.id);

  //busco si el usuario conectado ya esta en la lista de miembros
  //el ?. es porque currentUser puede ser null si nadie inicia sesion
  const alreadyMember = casa.members.find((m) => m.userId === currentUser?.id);

  //se ejecuta al hacer clic en el boton. joinHouse esta en el contexto y devuelve true o false
  function handleJoin() {
    const exito = joinHouse(casa.id, codigo);
    if (!exito) {
      setError("Could not join. Check the invite code or if you are already a member.");
    }
  }

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <img
          src={casa.coverImageUrl}
          alt={casa.name}
          className="w-full h-48 object-cover rounded-card mb-4"
        />
        <h1 className="text-3xl font-bold text-app-text">{casa.name}</h1>
        <p className="text-app-muted mb-6">{casa.description}</p>

        {/* tres situaciones distintas: sin sesion, ya miembro, o puede unirse */}
        {/* el && muestra lo de la derecha solo si lo de la izquierda es verdadero */}
        {!currentUser && (
          <p className="text-app-muted mb-6">Log in to join this house.</p>
        )}

        {currentUser && alreadyMember && (
          <p className="text-app-text mb-6">You are already a member of this house.</p>
        )}

        {currentUser && !alreadyMember && (
          <div className="mb-6">
            {/* el input del codigo solo aparece si la casa es privada */}
            {casa.isPrivate && (
              <input
                type="text"
                placeholder="Invite code"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="border border-app-border rounded-button px-3 py-2 mr-2 bg-app-bg text-app-text"
              />
            )}
            <button
              onClick={handleJoin}
              className="bg-ember-accent hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-button"
            >
              Join
            </button>
            {error && <p className="text-blood-accent mt-2">{error}</p>}
          </div>
        )}

        <h2 className="text-2xl font-bold text-app-text mb-3">Members</h2>

        {/* recorro los miembros de esta casa, uno por uno */}
        {casa.members.map((miembro) => {
          //cada miembro solo trae el userId, asi que busco su usuario completo
          const user = data.users.find((u) => u.id === miembro.userId);
          return (
            <div
              key={miembro.userId} //el key es obligatorio en toda lista
              className="bg-app-surface border border-app-border rounded-card p-4 mb-3 flex items-center gap-3"
            >
              <img src={user?.avatarUrl} alt="" className="w-10 h-10 rounded-pill" />
              <div>
                {/* el ?. evita que explote si el usuario ya no existe */}
                <p className="text-app-text">{user?.username}</p>
                <p className="text-app-muted text-sm">{miembro.role}</p>
              </div>
            </div>
          );
        })}

        <h2 className="text-2xl font-bold text-app-text mt-8 mb-3">Auctions</h2>

        {/* mismo patron que los miembros: recorro y cruzo por id */}
        {subastas.map((subasta) => {
          //la subasta solo trae cursedObjectId, busco el objeto completo
          const objeto = data.objects.find((o) => o.id === subasta.cursedObjectId);
          return (
            <Link key={subasta.id} to={"/auction/" + subasta.id} className="block">
              <div className="bg-app-surface border border-app-border rounded-card p-4 mb-3 hover:shadow-card-hover transition-shadow">
                <p className="text-app-text font-bold">{objeto?.name}</p>
                <p className="text-app-muted">
                  {/*si esta cerrada muestro el monto ganador, si no el estado */}
                  {subasta.status === "closed"
                    ? "Closed, won with " + subasta.winningBid
                    : subasta.status}
                </p>
              </div>
            </Link>
          );
        })}
      </main>
    </div>
  );
}

export default House;