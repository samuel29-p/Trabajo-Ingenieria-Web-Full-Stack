import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registrar, limpiarError, selectAuthLoading, selectAuthError } from "../store/slices/authSlice";
import ErrorMessage from "../components/ErrorMessage.jsx";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [errorLocal, setErrorLocal] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorLocal("");
    dispatch(limpiarError());

    //las mismas reglas que revisa el backend, asi el usuario ve el error sin esperar
    if (username.trim().length < 3) {
      setErrorLocal("The username needs at least 3 characters");
      return;
    }
    if (!email.includes("@")) {
      setErrorLocal("The email is not valid");
      return;
    }
    if (password.length < 6) {
      setErrorLocal("The password needs at least 6 characters");
      return;
    }
    if (password !== confirmacion) {
      setErrorLocal("The passwords do not match");
      return;
    }

    const resultado = await dispatch(
      registrar({ username: username.trim(), email: email.trim().toLowerCase(), password }),
    );
    if (registrar.fulfilled.match(resultado)) {
      navigate("/", { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-app-surface border border-app-border rounded-card shadow-card p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-app-text mb-6">Sign up</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-app-border rounded-button px-3 py-2 mb-3 bg-app-bg text-app-text"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-app-border rounded-button px-3 py-2 mb-3 bg-app-bg text-app-text"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-app-border rounded-button px-3 py-2 mb-3 bg-app-bg text-app-text"
        />

        <input
          type="password"
          placeholder="Repeat the password"
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
          className="w-full border border-app-border rounded-button px-3 py-2 mb-3 bg-app-bg text-app-text"
        />

        <ErrorMessage mensaje={errorLocal || authError} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ember-accent hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-button"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-app-muted text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-ember-accent">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
