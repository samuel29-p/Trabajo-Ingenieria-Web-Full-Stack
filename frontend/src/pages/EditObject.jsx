import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SuccessMessage from "../components/SuccessMessage.jsx";
import { curseService } from "../services/curseService";
import { objectService } from "../services/objectService";
import { mensajeError } from "../utils/mensajeError";

//es el "actualizar" del crud de objetos: carga el objeto, llena el formulario y guarda los cambios
function EditObject() {
  const { id } = useParams(); //el id del objeto que se edita
  const navigate = useNavigate();

  const [maldiciones, setMaldiciones] = useState([]);
  const [hauntHouseId, setHauntHouseId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [baseCurse, setBaseCurse] = useState("");
  const [minBid, setMinBid] = useState("");
  const [maxBid, setMaxBid] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);

  //se piden el objeto y el catalogo al mismo tiempo y con el objeto se llenan los campos
  useEffect(() => {
    async function cargar() {
      try {
        const [objeto, catalogo] = await Promise.all([
          objectService.getObjeto(id),
          curseService.getCatalogo(),
        ]);
        setMaldiciones(catalogo);
        setHauntHouseId(objeto.hauntHouseId);
        setName(objeto.name);
        setDescription(objeto.description || "");
        setImageUrl(objeto.imageUrl || "");
        setBaseCurse(objeto.baseCurse);
        setMinBid(String(objeto.minBid));
        setMaxBid(String(objeto.maxBid));
        setDurationDays(String(objeto.durationDays));
      } catch (err) {
        setError(mensajeError(err, "Could not load the object"));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setExito("");

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
      await objectService.editarObjeto(id, {
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        baseCurse,
        minBid: min,
        maxBid: max,
        durationDays: dias,
      });
      setExito("Object updated");
      navigate("/house/" + hauntHouseId);
    } catch (err) {
      setError(mensajeError(err, "Could not update the object"));
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
        <h1 className="text-3xl font-bold text-app-text mb-6">Edit cursed object</h1>

        {loading && <Loading texto="Loading object..." />}

        {/* si el objeto no cargo no hay formulario que mostrar, solo el error */}
        {!loading && !hauntHouseId && <ErrorMessage mensaje={error} />}

        {!loading && hauntHouseId && (
          <form onSubmit={handleSave}>
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
              {enviando ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

export default EditObject;
