import { NavLink } from "react-router-dom";
import { useContext } from "react";
import ButtonTheme from "../components/buttons/ButtonTheme";
import { AppContext } from "../context/AppContext.jsx";
import {
  PiHouse,
  PiSignIn,
  PiUserPlus,
  PiUser,
  PiSkull,
  PiSignOut,
} from "react-icons/pi";

function Navegacion() {
  const { currentUser, logout } = useContext(AppContext);

  //los links que ve todo el mundo
  const links = [
    { to: "/", label: "Home", icon: <PiHouse className="text-xl" /> },
    { to: "/curses", label: "Curses", icon: <PiSkull className="text-xl" /> },
  ];

  //si hay sesion abierta muestro Profile, si no muestro Log in y Sign up
  //push agrega al final del arreglo
  if (currentUser) {
    links.push({ to: "/profile", label: "Profile", icon: <PiUser className="text-xl" /> });
  } else {
    links.push({ to: "/login", label: "Log in", icon: <PiSignIn className="text-xl" /> });
    links.push({ to: "/register", label: "Sign up", icon: <PiUserPlus className="text-xl" /> });
  }

  //recorro el arreglo y convierto cada objeto en un link de pantalla
  const renderLinks = links.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      className={({ isActive }) =>
        `font-semibold px-3 py-2 text-gold-accent rounded-button transition-colors duration-200 flex items-center gap-2
        ${isActive ? "bg-white/10 " : "hover:bg-white/5"}`
      }
    >
      {link.icon} {link.label}
    </NavLink>
  ));

  return (
    <nav className="bg-blood-soft px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-card transition-colors duration-300">
      <p className="text-6xl text-center text-blood-accent font-extrabold w-full tracking-wider">
        PHANTOMBIDS
      </p>

      <div className="mx-auto text-center flex items-center gap-1 flex-wrap">
        {renderLinks}

        {/* el boton de salir solo aparece si hay alguien conectado */}
        {currentUser && (
          <button
            onClick={logout}
            className="font-semibold px-3 py-2 text-app-muted rounded-button hover:bg-white/5 flex items-center gap-2"
          >
            <PiSignOut className="text-xl" /> Log out
          </button>
        )}
      </div>

      <ButtonTheme />
    </nav>
  );
}

export default Navegacion;