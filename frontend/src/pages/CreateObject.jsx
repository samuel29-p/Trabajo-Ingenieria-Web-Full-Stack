import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SuccessMessage from "../components/SuccessMessage.jsx";
import { curseService } from "../services/curseService";
import { objectService } from "../services/objectService";
import { mensajeError } from "../utils/mensajeError";

function CreateObject() {
  const { id } = useParams(); //el id de la casa donde se crea el objeto
  const navigate = useNavigate();

  const [maldiciones, setMaldiciones] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [baseCurse, setBaseCurse] = useState("");
  const [minBid, setMinBid] = useState("5");
  const [maxBid, setMaxBid] = useState("50");
  const [durationDays, setDurationDays] = useState("3");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);

  //las maldiciones del formulario salen del catalogo del backend
  useEffect(() => {
    async function cargar() {
      try {
        const catalogo = await curseService.getCatalogo();
        setMaldiciones(catalogo);
        if (catalogo.length > 0) setBaseCurse(catalogo[0].code);
      } catch (err) {
        setError(mensajeError(err, "Could not load the curses"));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setExito("");

    //los inputs entregan texto, se pasan a numero para comparar
    const min = Number(minBid);
    const max = Number(maxBid);
    const dias = Number(durationDays);

    if (name.trim().length < 3) {
      setError("The name must have at least 3 characters");
      return;
    }
    if (min < 1 || min > 100) {
      setError("Min bid must be between 1 and 100");
      return;
    }
    if (max < min + 10 || max > 500) {
      setError("Max bid must be at least min bid + 10 and at most 500");
      return;
    }
    if (dias < 1 || dias > 7) {
      setError("Duration must be between 1 and 7 days");
      return;
    }

    setEnviando(true);
    try {
      await objectService.crearObjeto({
        hauntHouseId: id,
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        baseCurse,
        minBid: min,
        maxBid: max,
        durationDays: dias,
      });
      setExito("Object created");
      navigate("/house/" + id);
    } catch (err) {
      setError(mensajeError(err, "Could not create the object"));
    } finally {
      setEnviando(false);
    }
  }

  const inputClass =
    "w-full border border-app-border rounded-button px-3 py-2 mb-3 bg-app-bg text-app-text";

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-bold text-app-text mb-6">New cursed object</h1>

        {loading ? (
          <Loading texto="Loading curses..." />
        ) : (
          <form onSubmit={handleCreate}>
            <input type="text" placeholder="Name" value={name}
              onChange={(e) => setName(e.target.value)} className={inputClass} />

            <textarea placeholder="Description" value={description}
              onChange={(e) => setDescription(e.target.value)} className={inputClass} />

            <input type="text" placeholder="Image (e.g. /images/doll.jpeg)" value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)} className={inputClass} />

            <select value={baseCurse} onChange={(e) => setBaseCurse(e.target.value)} className={inputClass}>
              {maldiciones.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>

            <label className="text-app-muted text-sm">Min bid (1 to 100)</label>
            <input type="number" value={minBid}
              onChange={(e) => setMinBid(e.target.value)} className={inputClass} />

            <label className="text-app-muted text-sm">Max bid (min+10 to 500)</label>
            <input type="number" value={maxBid}
              onChange={(e) => setMaxBid(e.target.value)} className={inputClass} />

            <label className="text-app-muted text-sm">Duration in days (1 to 7)</label>
            <input type="number" value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)} className={inputClass} />

            <ErrorMessage mensaje={error} />
            <SuccessMessage mensaje={exito} />

            <button type="submit" disabled={enviando}
              className="w-full bg-ember-accent hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-button">
              {enviando ? "Creating..." : "Create object"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

export default CreateObject;
