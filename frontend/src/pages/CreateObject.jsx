import NavBar from "../components/NavBar.jsx";
import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { CURSE_LIST } from "../data/Curses.js";

function CreateObject() {
  const { currentUser, createObject } = useContext(AppContext);
  const { id } = useParams(); //el id de la casa donde se crea el objeto
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [baseCurse, setBaseCurse] = useState("LOSE_10_REPUTATION");
  const [minBid, setMinBid] = useState("5");
  const [maxBid, setMaxBid] = useState("50");
  const [durationDays, setDurationDays] = useState("3");
  const [error, setError] = useState("");

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-app-bg">
        <NavBar />
        <p className="p-8 text-app-text">Log in to create an object.</p>
      </div>
    );
  }

  function handleCreate() {
    const mensaje = createObject(
      Number(id), name, description, imageUrl, baseCurse, minBid, maxBid, durationDays
    );
    if (mensaje) setError(mensaje);
    else navigate("/house/" + id);
  }

  const inputClass =
    "w-full border border-app-border rounded-button px-3 py-2 mb-3 bg-app-bg text-app-text";

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-bold text-app-text mb-6">New cursed object</h1>

        <input type="text" placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)} className={inputClass} />

        <textarea placeholder="Description" value={description}
          onChange={(e) => setDescription(e.target.value)} className={inputClass} />

        <input type="text" placeholder="Image (e.g. /images/doll.jpeg)" value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)} className={inputClass} />

        {/* las 8 maldiciones salen del catalogo, recorridas con map */}
        <select value={baseCurse} onChange={(e) => setBaseCurse(e.target.value)} className={inputClass}>
          {CURSE_LIST.map((c) => (
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

        {error && <p className="text-blood-accent mb-3">{error}</p>}

        <button onClick={handleCreate}
          className="w-full bg-ember-accent hover:bg-orange-600 text-white font-semibold py-2 rounded-button">
          Create object
        </button>
      </main>
    </div>
  );
}

export default CreateObject;