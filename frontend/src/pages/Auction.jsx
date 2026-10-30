import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../components/NavBar.jsx";
import Badge from "../components/Badge.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SuccessMessage from "../components/SuccessMessage.jsx";
import { auctionService } from "../services/auctionService";
import { objectService } from "../services/objectService";
import { houseService } from "../services/houseService";
import { selectUser, selectIsAdmin, recargarPerfil } from "../store/slices/authSlice";
import { mensajeError } from "../utils/mensajeError";

//color de la etiqueta segun el estado de la subasta
const COLOR_ESTADO = { open: "green", closed: "gold", cancelled: "blood" };

function Auction() {
  const { id } = useParams(); //el id de la subasta que viene en la direccion
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  //todo lo que se pide al backend para dibujar la pagina
  const [subasta, setSubasta] = useState(null);
  const [objeto, setObjeto] = useState(null);
  const [casa, setCasa] = useState(null);
  const [pujas, setPujas] = useState([]);
  const [miPuja, setMiPuja] = useState(null);
  const [apuestas, setApuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //estado de cada formulario, con su propio mensaje de error o de exito
  const [monto, setMonto] = useState("");
  const [aliasApuesta, setAliasApuesta] = useState("");
  const [montoApuesta, setMontoApuesta] = useState("10");
  const [enviando, setEnviando] = useState(false);
  const [errorAccion, setErrorAccion] = useState("");
  const [exito, setExito] = useState("");
  const [resultado, setResultado] = useState(null);

  //recargas es un contador, cada vez que sube el efecto vuelve a pedir todo al backend
  //se sube despues de pujar, apostar o cerrar, para ver los datos nuevos
  const [recargas, setRecargas] = useState(0);
  //la hora del momento en que llegaron los datos, para saber si las apuestas siguen abiertas
  const [ahora, setAhora] = useState(0);

  useEffect(() => {
    async function cargar() {
      try {
        const datosSubasta = await auctionService.getSubasta(id);
        setSubasta(datosSubasta);
        setCasa(await houseService.getCasa(datosSubasta.hauntHouseId));
        setPujas(await auctionService.getPujas(id));
        setMiPuja(await auctionService.miPuja(id));
        setApuestas(await auctionService.getApuestas(id));
        //el objeto puede haber sido borrado, en ese caso la subasta se sigue mostrando sin el
        try {
          setObjeto(await objectService.getObjeto(datosSubasta.cursedObjectId));
        } catch {
          setObjeto(null);
        }
        setAhora(Date.now());
        setError("");
      } catch (err) {
        setError(mensajeError(err, "Could not load the auction"));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id, recargas]);

  //limpia los mensajes antes de cada accion
  function empezarAccion() {
    setErrorAccion("");
    setExito("");
    setEnviando(true);
  }

  async function handlePujar(e) {
    e.preventDefault();
    const numero = Number(monto);
    //la misma regla del backend, asi el usuario ve el error sin esperar
    if (!Number.isInteger(numero) || numero < objeto.minBid || numero > objeto.maxBid) {
      setErrorAccion("The bid must be a whole number between " + objeto.minBid + " and " + objeto.maxBid);
      return;
    }
    empezarAccion();
    try {
      const puja = await auctionService.pujar(id, numero);
      setExito("Your secret bid is in. Your alias in this auction is " + puja.alias);
      setMonto("");
      setRecargas((n) => n + 1);
    } catch (err) {
      setErrorAccion(mensajeError(err, "Could not place the bid"));
    } finally {
      setEnviando(false);
    }
  }

  async function handleApostar(e) {
    e.preventDefault();
    if (!aliasApuesta) {
      setErrorAccion("Pick an alias to bet on");
      return;
    }
    empezarAccion();
    try {
      await auctionService.apostar(id, aliasApuesta, Number(montoApuesta));
      setExito("You bet " + montoApuesta + " reputation on " + aliasApuesta);
      setAliasApuesta("");
      //apostar descuenta reputacion, por eso se recarga el perfil de la barra
      dispatch(recargarPerfil());
      setRecargas((n) => n + 1);
    } catch (err) {
      setErrorAccion(mensajeError(err, "Could not place the bet"));
    } finally {
      setEnviando(false);
    }
  }

  async function handleCerrar() {
    if (!window.confirm("Close the auction now? This reveals every bid and applies the curse.")) return;
    empezarAccion();
    try {
      const datos = await auctionService.cerrarSubasta(id);
      setResultado(datos);
      dispatch(recargarPerfil());
      setRecargas((n) => n + 1);
    } catch (err) {
      setErrorAccion(mensajeError(err, "Could not close the auction"));
    } finally {
      setEnviando(false);
    }
  }

  async function handleEliminar() {
    if (!window.confirm("Delete this auction with all its bids and bets?")) return;
    empezarAccion();
    try {
      await auctionService.eliminarSubasta(id);
      navigate("/house/" + subasta.hauntHouseId);
    } catch (err) {
      setErrorAccion(mensajeError(err, "Could not delete the auction"));
      setEnviando(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Loading texto="Loading the auction..." />
        </main>
      </div>
    );
  }

  if (error || !subasta) {
    return (
      <div className="min-h-screen bg-app-bg">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <ErrorMessage mensaje={error || "That auction does not exist."} />
          <Link to="/" className="text-ember-accent">Back to the houses</Link>
        </main>
      </div>
    );
  }

  //quien es el usuario dentro de esta casa, los ids de mongo llegan como texto
  const miembro = casa?.members.find((m) => m.userId === user._id);
  const esCreador = subasta.createdBy === user._id;
  const abierta = subasta.status === "open";
  //las apuestas cierran una hora antes del final, requisito 18
  const apuestasAbiertas = abierta && new Date(subasta.endsAt).getTime() - 60 * 60 * 1000 > ahora;
  //se apuesta a los alias de los demas, nunca al propio
  const aliasDeOtros = pujas.map((p) => p.alias).filter((alias) => alias !== miPuja?.alias);

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to={"/house/" + subasta.hauntHouseId} className="text-ember-accent">
          ← {casa?.name || "Back to the house"}
        </Link>

        <div className="flex flex-col sm:flex-row gap-6 mt-4">
          {objeto?.imageUrl && (
            <img src={objeto.imageUrl} alt={objeto.name} className="w-full sm:w-56 h-56 object-cover rounded-card" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-app-text">{objeto?.name || "Deleted object"}</h1>
            <p className="text-app-muted mb-3">{objeto?.description}</p>
            <Badge variant={COLOR_ESTADO[subasta.status]}>{subasta.status}</Badge>
            {objeto && (
              <p className="text-app-text mt-3">
                Bids between {objeto.minBid} and {objeto.maxBid}
              </p>
            )}
            <p className="text-app-muted">Ends on {new Date(subasta.endsAt).toLocaleString()}</p>
            <p className="text-app-muted">{pujas.length} secret bids · {apuestas.length} side bets</p>
          </div>
        </div>

        <ErrorMessage mensaje={errorAccion} />
        <SuccessMessage mensaje={exito} />

        {/* el resultado del cierre que devuelve el backend, solo justo despues de cerrar */}
        {resultado && (
          <div className="bg-app-surface border border-gold-accent rounded-card p-4 my-4">
            <h2 className="text-xl font-bold text-gold-accent mb-2">Auction result</h2>
            {resultado.ganador ? (
              <p className="text-app-text">
                {resultado.ganador.alias} wins with {resultado.ganador.amount} and receives the curse{" "}
                {resultado.maldicion?.name}.
              </p>
            ) : (
              <p className="text-app-text">There was no unique bid, so the auction was cancelled.</p>
            )}
            {resultado.duplicados.length > 0 && (
              <p className="text-blood-accent mt-1">
                Duplicated bids: {resultado.duplicados.map((d) => d.alias + " (" + d.amount + ")").join(", ")}. They lose 5
                reputation and become Poltergeist for 48 hours.
              </p>
            )}
            <p className="text-app-muted mt-1">{resultado.apuestasResueltas} bets were resolved.</p>
          </div>
        )}

        {/* subasta abierta, el formulario de puja secreta */}
        {abierta && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-app-text mb-3">Your secret bid</h2>
            {!miembro && <p className="text-app-muted">Join the house to bid in this auction.</p>}
            {miembro && miembro.role === "Poltergeist" && (
              <p className="text-blood-accent">Poltergeists cannot bid until their punishment ends.</p>
            )}
            {miPuja && (
              <p className="text-app-text">
                You bid {miPuja.amount} as <span className="text-ember-accent font-semibold">{miPuja.alias}</span>. It
                stays secret until the auction closes.
              </p>
            )}
            {miembro && miembro.role !== "Poltergeist" && !miPuja && objeto && (
              <form onSubmit={handlePujar} className="flex flex-wrap gap-2">
                <input
                  type="number"
                  placeholder={"Between " + objeto.minBid + " and " + objeto.maxBid}
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="border border-app-border rounded-button px-3 py-2 bg-app-bg text-app-text"
                />
                <button
                  type="submit"
                  disabled={enviando}
                  className="bg-ember-accent hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-button"
                >
                  {enviando ? "Sending..." : "Bid"}
                </button>
              </form>
            )}
          </section>
        )}

        {/* las pujas, con la subasta abierta solo se ven los alias, al cerrar se ven los montos */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-app-text mb-3">{abierta ? "Who is bidding" : "Revealed bids"}</h2>
          {pujas.length === 0 && <p className="text-app-muted">No bids yet.</p>}
          {pujas.map((puja) => (
            <div
              key={puja._id}
              className={
                "bg-app-surface border rounded-card p-3 mb-2 flex justify-between " +
                (!abierta && puja.amount === subasta.winningBid ? "border-gold-accent" : "border-app-border")
              }
            >
              <span className="text-app-text">
                {puja.alias}
                {puja.alias === miPuja?.alias && <span className="text-app-muted"> (you)</span>}
              </span>
              {!abierta && <span className="text-gold-accent font-bold">{puja.amount}</span>}
            </div>
          ))}
          {subasta.status === "closed" && (
            <p className="text-gold-accent mt-2">Winning bid: {subasta.winningBid}</p>
          )}
          {subasta.status === "cancelled" && (
            <p className="text-blood-accent mt-2">Cancelled: there was no unique bid.</p>
          )}
        </section>

        {/* apuestas paralelas, requisitos 16 al 19 */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-app-text mb-3">Side bets</h2>
          {abierta && !apuestasAbiertas && (
            <p className="text-app-muted">Betting closed one hour before the end of the auction.</p>
          )}
          {apuestasAbiertas && miembro && (
            <form onSubmit={handleApostar} className="flex flex-wrap gap-2 mb-4">
              <select
                value={aliasApuesta}
                onChange={(e) => setAliasApuesta(e.target.value)}
                className="border border-app-border rounded-button px-3 py-2 bg-app-bg text-app-text"
              >
                <option value="">Pick an alias</option>
                {aliasDeOtros.map((alias) => (
                  <option key={alias} value={alias}>
                    {alias}
                  </option>
                ))}
              </select>
              <select
                value={montoApuesta}
                onChange={(e) => setMontoApuesta(e.target.value)}
                className="border border-app-border rounded-button px-3 py-2 bg-app-bg text-app-text"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <button
                type="submit"
                disabled={enviando}
                className="bg-gold-accent hover:bg-yellow-600 disabled:opacity-60 text-black font-semibold px-4 py-2 rounded-button"
              >
                {enviando ? "Sending..." : "Bet"}
              </button>
            </form>
          )}
          {apuestas.length === 0 && <p className="text-app-muted">No bets yet.</p>}
          {apuestas.map((apuesta) => (
            <div
              key={apuesta._id}
              className="bg-app-surface border border-app-border rounded-card p-3 mb-2 flex justify-between"
            >
              <span className="text-app-text">
                {apuesta.amount} on {apuesta.predictedAlias}
              </span>
              <span className="text-app-muted">
                {apuesta.status}
                {apuesta.status !== "pending" && " · pays " + apuesta.payout}
              </span>
            </div>
          ))}
        </section>

        {/* cerrar la subasta, solo el creador o un admin */}
        {abierta && (esCreador || isAdmin) && (
          <section className="mt-8 pt-6 border-t border-app-border">
            <button
              onClick={handleCerrar}
              disabled={enviando}
              className="bg-blood-accent hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-button"
            >
              Close auction
            </button>
            <p className="text-app-muted text-sm mt-2">Reveals all bids, applies the curse and resolves the bets.</p>
          </section>
        )}

        {/* borrar la subasta, solo lo ve el admin */}
        {isAdmin && (
          <section className="mt-6">
            <button
              onClick={handleEliminar}
              disabled={enviando}
              className="border border-blood-accent text-blood-accent hover:bg-blood-soft font-semibold px-4 py-2 rounded-button"
            >
              Delete auction
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default Auction;
