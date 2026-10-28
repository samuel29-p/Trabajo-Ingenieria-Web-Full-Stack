import NavBar from "../components/NavBar.jsx";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

function CreateHouse() {
  const { currentUser, createHouse } = useContext(AppContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [theme, setTheme] = useState("Darkness"); //los 4 temas del requisito 4
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-app-bg">
        <NavBar />
        <p className="p-8 text-app-text">Log in to create a house.</p>
      </div>
    );
  }

  function handleCreate() {
    const mensaje = createHouse(name, theme, description, coverImageUrl, isPrivate, inviteCode);
    if (mensaje) {
      setError(mensaje);
    } else {
      navigate("/"); //si salio bien, al inicio a ver la casa nueva
    }
  }

  const inputClass =
    "w-full border border-app-border rounded-button px-3 py-2 mb-3 bg-app-bg text-app-text";

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-bold text-app-text mb-6">New haunt house</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />

        {/* un select es como un input, pero con opciones fijas */}
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className={inputClass}
        >
          <option value="Darkness">Darkness</option>
          <option value="Comedy">Comedy</option>
          <option value="Terror">Terror</option>
          <option value="Corporate">Corporate</option>
        </select>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />

        <input
          type="text"
          placeholder="Cover image (e.g. /images/house-crypt.jpeg)"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className={inputClass}
        />

        {/* en un checkbox el valor va en checked, no en value */}
        <label className="flex items-center gap-2 text-app-text mb-3">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          Private house
        </label>

        {isPrivate && (
          <input
            type="text"
            placeholder="Invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className={inputClass}
          />
        )}

        {error && <p className="text-blood-accent mb-3">{error}</p>}

        <button
          onClick={handleCreate}
          className="w-full bg-ember-accent hover:bg-orange-600 text-white font-semibold py-2 rounded-button"
        >
          Create house
        </button>
      </main>
    </div>
  );
}

export default CreateHouse;