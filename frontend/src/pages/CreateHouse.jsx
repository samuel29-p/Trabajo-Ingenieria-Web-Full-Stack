import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SuccessMessage from "../components/SuccessMessage.jsx";
import { houseService } from "../services/houseService";
import { mensajeError } from "../utils/mensajeError";

function CreateHouse() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [theme, setTheme] = useState(""); //vacio hasta que escoja uno de los 4 temas
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleCreate(e) {
    e.preventDefault(); //evita que el formulario recargue la pagina
    setError("");
    setExito("");

    //validaciones antes de molestar al backend
    if (name.trim().length < 3) {
      setError("The name must have at least 3 characters");
      return;
    }
    if (!theme) {
      setError("Choose a theme");
      return;
    }

    setEnviando(true);
    try {
      const datos = {
        name: name.trim(),
        theme,
        description: description.trim(),
        coverImageUrl: coverImageUrl.trim(),
        isPrivate,
      };
      //el codigo solo se manda si la casa es privada y escribieron uno, si no el backend genera uno
      if (isPrivate && inviteCode.trim()) {
        datos.inviteCode = inviteCode.trim();
      }
      const casa = await houseService.crearCasa(datos);
      setExito("House created");
      navigate("/house/" + casa._id);
    } catch (err) {
      setError(mensajeError(err, "Could not create the house"));
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
        <h1 className="text-3xl font-bold text-app-text mb-6">New haunt house</h1>

        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />

          {/* un select es como un input, pero con opciones fijas */}
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className={inputClass}>
            <option value="">Choose a theme</option>
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
              placeholder="Invite code (optional)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className={inputClass}
            />
          )}

          <ErrorMessage mensaje={error} />
          <SuccessMessage mensaje={exito} />

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-ember-accent hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-button"
          >
            {enviando ? "Creating..." : "Create house"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateHouse;
