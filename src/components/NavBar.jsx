import { NavLink } from "react-router-dom";
import ButtonTheme from "../components/buttons/ButtonTheme";
import { PiHouse, PiInfo, PiEnvelope, PiSignIn, PiUserPlus } from "react-icons/pi";

function Navegacion() {
  const links = [
    { to: "/", label: "Inicio", icon: <PiHouse className="text-xl" /> },
    { to: "/login", label: "Iniciar Sesion", icon: <PiSignIn className="text-xl" /> },
    { to: "/register", label: "Registro", icon: <PiUserPlus className="text-xl" /> },

  ];

  const renderLinks = links.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      className={({ isActive }) =>
        `font-semibold px-3 py-2 text-gold-accent rounded-button transition-colors duration-200 flex items-center gap-2
        ${isActive ? "bg-white/50 " : "hover:bg-white/20"}`
      }
    >
      {link.icon} {link.label}
    </NavLink>
  ));
  return (
    <nav
      className={`bg-blood-soft px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-card transition-colors duration-300`}
    >
      <p className="text-6xl text-center text-blood-accent font-extrabold w-full">
       PHANTOMBIDS
      </p>

      <div className="mx-auto text-center flex items-center gap-1 flex-wrap">{renderLinks}</div>
      <ButtonTheme />
    </nav>
  );
}

export default Navegacion;
