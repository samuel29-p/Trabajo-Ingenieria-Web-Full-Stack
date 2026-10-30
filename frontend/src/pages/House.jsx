import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SuccessMessage from "../components/SuccessMessage.jsx";
import { selectUser, selectIsAdmin } from "../store/slices/authSlice";
import { houseService } from "../services/houseService";
import { objectService } from "../services/objectService";
import { auctionService } from "../services/auctionService";
import { mensajeError } from "../utils/mensajeError";

function House() {
  const { id } = useParams(); //el id de la casa que viene en la direccion
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  const [casa, setCasa] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [rankings, setRankings] = useState(null);
  const [objetos, setObjetos] = useState([]);
  const [subastas, setSubastas] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);
  //cada vez que cambia este numero el useEffect vuelve a pedir todo al backend
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    async function cargar() {
      try {
        const datosCasa = await houseService.getCasa(id);
        //la casa trae la lista de miembros solo con ids, de ahi se saca si el usuario es miembro
        const esMiembro = datosCasa.members.some((m) => m.userId === user._id);

        //lo que no depende de ser miembro se pide en paralelo
        const pedidos = [
          objectService.getObjetos(id),
          auctionService.getSubastas({ hauntHouseId: id }),
        ];
        //los miembros y los rankings solo los puede pedir un miembro, si no el backend responde 403
        if (esMiembro) {
          pedidos.push(houseService.getMiembros(id));
          pedidos.push(houseService.getRankings(id));
        }
        const [listaObjetos, listaSubastas, listaMiembros, listaRankings] =
          await Promise.all(pedidos);

        setCasa(datosCasa);
        setObjetos(listaObjetos);
        setSubastas(listaSubastas);
        setMiembros(listaMiembros || []);
        setRankings(listaRankings || null);
        setError("");
      } catch (err) {
        setError(mensajeError(err, "Could not load the house"));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id, user._id, recarga]);

  //guard clauses: mientras carga o si fallo, no se dibuja el resto
  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Loading texto="Loading house..." />
        </main>
      </div>
    );
  }
  if (!casa) {
    return (
      <div className="min-h-screen bg-app-bg">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <ErrorMessage mensaje={error || "That house does not exist."} />
        </main>
      </div>
    );
  }

  const esMiembro = casa.members.some((m) => m.userId === user._id);

  //ejecuta una accion contra el backend: desactiva botones, muestra el exito o el error y recarga
  async function ejecutar(accion, textoExito, alTerminar) {
    setEnviando(true);
    setError("");
    setExito("");
    try {
      await accion();
      setExito(textoExito);
      if (alTerminar) {
        alTerminar();
      } else {
        setRecarga((n) => n + 1);
      }
    } catch (err) {
      setError(mensajeError(err, "Something went wrong"));
    } finally {
      setEnviando(false);
    }
  }

  function handleJoin() {
    ejecutar(() => houseService.unirse(id, codigo), "You joined the house");
  }

  function handleStartAuction(objetoId) {
    ejecutar(() => auctionService.crearSubasta(objetoId), "Auction started");
  }

  function handleDeleteObject(objetoId) {
    //si el objeto esta en subasta el backend responde 409 y se muestra ese error
    ejecutar(() => objectService.eliminarObjeto(objetoId), "Object deleted");
  }

  function handleDeleteHouse() {
    if (!window.confirm("Delete this house?")) return;
    ejecutar(() => houseService.eliminarCasa(id), "House deleted", () => navigate("/"));
  }

  //las subastas guardan solo el id del objeto, por eso se busca en la lista de objetos
  function nombreObjeto(subasta) {
    const objeto = objetos.find((o) => o._id === subasta.cursedObjectId);
    return objeto ? objeto.name : "Deleted object";
  }

  function estaEnSubasta(objetoId) {
    return subastas.some((s) => s.cursedObjectId === objetoId && s.status === "open");
  }

  //un objeto lo puede editar o borrar su creador o un admin
  function puedeGestionar(objeto) {
    return isAdmin || objeto.createdBy === user._id;
  }

  const botonNaranja =
    "bg-ember-accent hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-button";

  //los cuatro rankings: titulo, lista y como se muestra el dato de cada uno
  const tablas = rankings
    ? [
        { titulo: "Worst Bidder", lista: rankings.worstBidder, dato: (s) => "avg " + s.avgBid },
        { titulo: "Total Cursed", lista: rankings.totalCursed, dato: (s) => s.curses + " curses" },
        { titulo: "Free Spirit", lista: rankings.freeSpirits, dato: () => "never won" },
        { titulo: "Betting Prophet", lista: rankings.bettingProphet, dato: (s) => s.profit + " rep" },
      ]
    : [];

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

        <ErrorMessage mensaje={error} />
        <SuccessMessage mensaje={exito} />

        {esMiembro ? (
          <p className="text-app-text mb-6">You are already a member of this house.</p>
        ) : (
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
            <button onClick={handleJoin} disabled={enviando} className={botonNaranja}>
              {enviando ? "Joining..." : "Join"}
            </button>
          </div>
        )}

        {isAdmin && (
          <button
            onClick={handleDeleteHouse}
            disabled={enviando}
            className="bg-blood-accent hover:opacity-80 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-button mb-6"
          >
            Delete house
          </button>
        )}

        {/* miembros y rankings llevan nombres reales, solo los ven los miembros */}
        {esMiembro && (
          <>
            <h2 className="text-2xl font-bold text-app-text mb-3">Members</h2>
            {miembros.map((miembro) => (
              <div
                key={miembro.userId}
                className="bg-app-surface border border-app-border rounded-card p-4 mb-3 flex items-center gap-3"
              >
                <img src={miembro.avatarUrl} alt="" className="w-10 h-10 rounded-pill" />
                <div>
                  <p className="text-app-text">{miembro.username}</p>
                  {/* los poltergeist se resaltan con otro color */}
                  <p
                    className={
                      miembro.role === "Poltergeist"
                        ? "text-blood-accent text-sm font-bold"
                        : "text-app-muted text-sm"
                    }
                  >
                    {miembro.role}
                  </p>
                </div>
              </div>
            ))}

            <h2 className="text-2xl font-bold text-app-text mt-8 mb-3">Cursed objects</h2>
            <Link to={"/house/" + id + "/new-object"} className={"inline-block mb-4 " + botonNaranja}>
              + New object
            </Link>
          </>
        )}

        {!esMiembro && <h2 className="text-2xl font-bold text-app-text mt-8 mb-3">Cursed objects</h2>}

        {objetos.length === 0 && <p className="text-app-muted">No objects yet.</p>}
        {objetos.map((obj) => (
          <div
            key={obj._id}
            className="bg-app-surface border border-app-border rounded-card p-4 mb-3 flex flex-wrap justify-between items-center gap-3"
          >
            <div>
              <p className="text-app-text font-bold">{obj.name}</p>
              <p className="text-app-muted text-sm">
                {obj.minBid} to {obj.maxBid}, {obj.durationDays} days
              </p>
            </div>
            <div className="flex gap-2">
              {esMiembro && !estaEnSubasta(obj._id) && (
                <button
                  onClick={() => handleStartAuction(obj._id)}
                  disabled={enviando}
                  className="bg-gold-accent hover:bg-yellow-600 disabled:opacity-60 text-black font-semibold px-3 py-2 rounded-button"
                >
                  Start auction
                </button>
              )}
              {puedeGestionar(obj) && (
                <>
                  <Link
                    to={"/object/" + obj._id + "/edit"}
                    className="border border-app-border text-app-text font-semibold px-3 py-2 rounded-button"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteObject(obj._id)}
                    disabled={enviando}
                    className="bg-blood-accent hover:opacity-80 disabled:opacity-60 text-white font-semibold px-3 py-2 rounded-button"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        <h2 className="text-2xl font-bold text-app-text mt-8 mb-3">Auctions</h2>
        {subastas.length === 0 && <p className="text-app-muted">No auctions yet.</p>}
        {subastas.map((subasta) => (
          <Link key={subasta._id} to={"/auction/" + subasta._id} className="block">
            <div className="bg-app-surface border border-app-border rounded-card p-4 mb-3 hover:shadow-card-hover transition-shadow">
              <p className="text-app-text font-bold">{nombreObjeto(subasta)}</p>
              <p className="text-app-muted">
                {/* el estado puede ser open, closed o cancelled */}
                {subasta.status === "closed"
                  ? "Closed, won with " + subasta.winningBid
                  : subasta.status}
              </p>
            </div>
          </Link>
        ))}

        {esMiembro && (
          <>
            <h2 className="text-2xl font-bold text-app-text mt-8 mb-3">Rankings</h2>
            {tablas.map((t) => (
              <div key={t.titulo} className="bg-app-surface border border-app-border rounded-card p-4 mb-3">
                <p className="text-ember-accent font-bold mb-2">{t.titulo}</p>
                {t.lista.slice(0, 3).map((s) => (
                  <div key={s.userId} className="flex justify-between text-app-text">
                    <span>{s.username}</span>
                    <span className="text-app-muted">{t.dato(s)}</span>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default House;
