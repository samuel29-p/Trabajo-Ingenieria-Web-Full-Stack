import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login, limpiarError, selectAuthLoading, selectAuthError } from "../store/slices/authSlice";
import ErrorMessage from "../components/ErrorMessage.jsx";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  //un estado por cada campo del formulario, inputs controlados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLocal, setErrorLocal] = useState("");

  //si llego aqui porque intento entrar a una pagina privada, despues del login vuelve a esa pagina
  const destino = location.state?.from?.pathname || "/";

  async function handleSubmit(e) {
    e.preventDefault(); //evita que el formulario recargue la pagina
    setErrorLocal("");
    dispatch(limpiarError());

    //validaciones antes de molestar al backend
    if (!email || !password) {
      setErrorLocal("Please fill in your email and password");
      return;
    }

    const resultado = await dispatch(login({ email: email.trim().toLowerCase(), password }));
    if (login.fulfilled.match(resultado)) {
      navigate(destino, { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-app-surface border border-app-border rounded-card shadow-card p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-app-text mb-6">Log in</h1>

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

        <ErrorMessage mensaje={errorLocal || authError} />

        {/* mientras espera la respuesta el boton se desactiva y cambia el texto */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ember-accent hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-button"
        >
          {loading ? "Entering..." : "Enter"}
        </button>

        <p className="text-app-muted text-sm mt-4">
          No account?{" "}
          <Link to="/register" className="text-ember-accent">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
