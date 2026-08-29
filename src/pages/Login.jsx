import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

function Login() {
  const { login } = useContext(AppContext); //saco solo la funcion login del contexto
  const navigate = useNavigate(); //sirve para mandar al usuario a otra ruta desde el codigo

  //un estado por cada campo del formulario (inputs controlados)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); //mensaje de error, vacio = no mostrar nada

  function handleSubmit() {
    const exito = login(email, password); //devuelve true o false
    if (exito) {
      navigate("/"); //si entro, lo mando al inicio
    } else {
      setError("Wrong email or password");
    }
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <div className="bg-app-surface border border-app-border rounded-card shadow-card p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-app-text mb-6">Log in</h1>

        {/* input controlado: value lo lee del estado, onChange lo escribe */}
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

        {/* el error solo se dibuja si tiene texto */}
        {error && <p className="text-blood-accent mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-ember-accent hover:bg-orange-600 text-white font-semibold py-2 rounded-button"
        >
          Enter
        </button>

        <p className="text-app-muted text-sm mt-4">
          No account?{" "}
          <Link to="/register" className="text-ember-accent">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;