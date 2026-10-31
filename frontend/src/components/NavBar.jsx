import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ButtonTheme from "../components/buttons/ButtonTheme";
import { logout, selectUser, selectIsAdmin } from "../store/slices/authSlice";
import {
  PiHouse,
  PiSignIn,
  PiUserPlus,
  PiUser,
  PiSkull,
  PiShieldStar,
  PiSignOut,
} from "react-icons/pi";

function Navegacion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //el usuario sale del store de redux, si es null es porque nadie inicio sesion
  const currentUser = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  //los links que ve todo el mundo
  const links = [
    { to: "/", label: "Home", icon: <PiHouse className="text-xl" /> },
    { to: "/curses", label: "Curses", icon: <PiSkull className="text-xl" /> },
  ];

  //si hay sesion abierta muestro Profile, si no muestro Log in y Sign up
  if (currentUser) {
    links.push({ to: "/profile", label: "Profile", icon: <PiUser className="text-xl" /> });
  } else {
    links.push({ to: "/login", label: "Log in", icon: <PiSignIn className="text-xl" /> });
    links.push({ to: "/register", label: "Sign up", icon: <PiUserPlus className="text-xl" /> });
  }

  //el link de admin solo aparece si el usuario es admin
  if (isAdmin) {
    links.push({ to: "/admin", label: "Admin", icon: <PiShieldStar className="text-xl" /> });
  }

  //cerrar sesion manda al login y borra el token y el usuario
  function handleLogout() {
    navigate("/login", { replace: true });
    dispatch(logout());
  }

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
      <p className="text-3xl sm:text-6xl text-center text-blood-accent font-extrabold w-full tracking-wider">
        PHANTOMBIDS
      </p>

      <div className="mx-auto text-center flex items-center gap-1 flex-wrap justify-center">
        {renderLinks}

        {/* el boton de salir y la reputacion solo aparecen si hay alguien conectado */}
        {currentUser && (
          <>
            <span className="px-3 py-2 text-app-muted text-sm">
              {currentUser.username} · {currentUser.reputation} rep
            </span>
            <button
              onClick={handleLogout}
              className="font-semibold px-3 py-2 text-app-muted rounded-button hover:bg-white/5 flex items-center gap-2"
            >
              <PiSignOut className="text-xl" /> Log out
            </button>
          </>
        )}
      </div>

      <ButtonTheme />
    </nav>
  );
}

export default Navegacion;
