# PhantomBids Frontend

Aplicacion en React de PhantomBids, conectada a la API del backend. Esta carpeta es el front del monorepo; el README de la raiz explica el proyecto completo, las URLs y las credenciales.

- **Aplicacion desplegada:** https://phantombids.vercel.app
- **API que consume:** https://phantombids-back.onrender.com/api

La aplicacion esta escrita en ingles para mantener un solo idioma entre el codigo y los textos de la interfaz. Los comentarios del codigo estan en espanol, para estudiar el proyecto y poder explicarlo en la sustentacion.

## Tecnologias

- **React 19** con archivos `.jsx`, y **Vite** como servidor de desarrollo y empaquetador
- **React Router 7** para las rutas
- **Redux Toolkit** y **react-redux** para la sesion del usuario
- **Axios** para hablar con el backend
- **Tailwind CSS 4** con variables de color propias en `src/index.css`
- **react-icons** para los iconos

## Instalacion local

Se necesita Node.js 22 y el backend corriendo en local o el de Render.

1. Crear el archivo `.env` en esta carpeta, copiando `.env.example`:

```
VITE_API_URL=http://localhost:3000/api
```

2. Instalar y prender:

```
npm install
npm run dev
```

La aplicacion queda en http://localhost:5173. Para usar el backend de Render en vez del local, `VITE_API_URL` va con `https://phantombids-back.onrender.com/api`.

| Comando | Que hace |
|---|---|
| `npm run dev` | Prende Vite con recarga automatica |
| `npm run build` | Genera la version de produccion en `dist`, es la que usa Vercel |
| `npm run preview` | Sirve en local lo que quedo en `dist` |

## Estructura

```
src/
  services/    api.js con la instancia de Axios, y un servicio por recurso del backend
  store/       el store de Redux y authSlice con la sesion
  components/  NavBar, PrivateRoute, AdminRoute, Loading, ErrorMessage, SuccessMessage, botones e inputs
  pages/       una pantalla por ruta
  context/     ThemeContext para el modo oscuro
  utils/       mensajeError, que saca el mensaje de error que manda el backend
  App.jsx      el mapa de rutas
  main.jsx     el arranque, con el Provider de Redux y el router
```

## Como se conecta con el backend

1. **`services/api.js`** crea una sola instancia de Axios con la URL de `VITE_API_URL`.
2. **Interceptor de peticiones:** antes de que salga cada peticion le agrega `Authorization: Bearer <token>`, con el token guardado al iniciar sesion.
3. **Interceptor de respuestas:** si el backend responde 401, borra la sesion y manda al login.
4. **Servicios:** `authService`, `houseService`, `objectService`, `auctionService`, `curseService` y `userService`. Cada pagina llama la funcion que necesita, por ejemplo `houseService.getCasas()`.
5. **Redux** guarda solo la sesion: el usuario, el token y si esta cargando. Los datos de casas, objetos y subastas los pide cada pagina al abrirse, porque solo esa pagina los usa.
6. **Estados de carga y errores:** cada pagina muestra `Loading` mientras espera, `ErrorMessage` con el mensaje del backend cuando algo falla y `SuccessMessage` cuando una accion sale bien. Los formularios validan antes de enviar y desactivan el boton mientras esperan.

## Paginas y permisos

| Ruta | Pagina | Quien la ve |
|---|---|---|
| `/login`, `/register` | Inicio de sesion y registro | Todos |
| `/curses` | Catalogo de las 8 maldiciones | Todos |
| `/` | Casas de subastas | Con sesion |
| `/create-house` | Crear una casa | Con sesion |
| `/house/:id` | Casa: unirse, miembros, rankings, objetos y subastas | Con sesion, miembros y rankings solo para miembros |
| `/house/:id/new-object` | Crear un objeto maldito | Miembros de la casa |
| `/object/:id/edit` | Editar un objeto | Su creador o un admin |
| `/auction/:id` | Subasta: pujar, apostar y cerrar | Con sesion, pujar y apostar solo miembros |
| `/profile` | Perfil, registro de maldiciones y editar datos | Con sesion |
| `/admin` | Administracion de usuarios y subastas | Solo admin |

`PrivateRoute` manda al login a quien no tiene sesion, y `AdminRoute` ademas devuelve al inicio a quien no es admin. Los botones de borrar o cerrar solo aparecen para quien tiene permiso, y el backend vuelve a revisar todo con `autenticar` y `autorizar`.

## Donde esta cada requisito del enunciado

La logica vive en el backend y el front la muestra. Esta tabla dice en que pagina se ve cada requisito y en que archivo del backend se resuelve.

| # | Requisito | Pagina | Backend |
|---|---|---|---|
| 1 | Registro, inicio y cierre de sesion | `Login`, `Register`, `NavBar` | `authService.js` |
| 2 | Perfil con reputacion que empieza en 100 | `Profile` | `models/User.js` |
| 3 | Alias anonimo `Adjetivo_Numero` por subasta | `Auction` | `utils/alias.js` |
| 4, 5 | Crear casas y unirse, con codigo si es privada | `CreateHouse`, `House` | `houseService.js` |
| 6, 7 | Miembros con su nombre real y su rol | `House` | `houseService.js` |
| 8, 9 | Objetos malditos y las 8 maldiciones | `CreateObject`, `EditObject`, `Curses` | `cursedObjectService.js`, `utils/curses.js` |
| 10 a 14 | Una puja secreta por usuario, gana la mas baja y unica, sin unica se cancela | `Auction` | `bidService.js`, `closeService.js` |
| 15 | Duplicados pierden 5 y quedan Poltergeist 48 horas | `Auction`, `House` | `closeService.js`, `utils/membresia.js` |
| 16 a 19 | Apuestas sobre alias, cierran 1 hora antes y pagan el triple | `Auction` | `betService.js`, `closeService.js` |
| 20 a 22 | Registro de maldiciones, permanentes y temporales | `Profile` | `closeService.js`, `curseLogService.js` |
| 23 | Rankings de la casa | `House` | `rankingService.js` |

## Despliegue en Vercel

El proyecto de Vercel usa esta carpeta como Root Directory y tiene la variable `VITE_API_URL` apuntando a Render. Las variables que empiezan por `VITE_` se meten en el codigo al compilar, asi que si cambia hay que volver a desplegar. El archivo `vercel.json` manda todas las rutas a `index.html`, para que al recargar una pagina como `/house/123` no salga un 404.
