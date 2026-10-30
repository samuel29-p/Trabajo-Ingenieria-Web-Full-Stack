# PhantomBids

Casa de subastas inversas de objetos embrujados. En cada subasta los usuarios pujan en secreto con un alias anonimo, gana la puja mas baja que nadie mas repitio, y al ganador le cae la maldicion del objeto.

Proyecto 3 de Ingenieria Web, Universidad EIA. Entrega 3: aplicacion full stack, con el front conectado al backend y los dos desplegados.

## Enlaces

| Que | URL |
|---|---|
| Aplicacion (front en Vercel) | https://phantombids.vercel.app |
| API (backend en Render) | https://phantombids-back.onrender.com |
| Documentacion de la API (Swagger) | https://phantombids-back.onrender.com/api-docs |
| Repositorio | https://github.com/samuel29-p/Trabajo-Ingenieria-Web-Full-Stack |

El plan gratis de Render se duerme despues de 15 minutos sin uso. La primera peticion despues de eso, por ejemplo el primer login, puede tardar cerca de un minuto.

## Credenciales de prueba

| Rol | Email | Contrasena |
|---|---|---|
| Administrador | `admin@phantom.com` | `admin123` |
| Usuario estandar | `vinland@phantom.com` | `123456` |
| Usuario estandar | `illWin@phantom.com` | `123456` |

Los otros 10 usuarios del seed tambien usan la contrasena `123456`. El administrador ve la pagina `/admin`, puede borrar usuarios, casas y subastas, y puede cerrar cualquier subasta.

## Como esta armado

```
Navegador  ->  React en Vercel  ->  Axios con el token  ->  API Express en Render  ->  MongoDB Atlas
```

1. El front pide los datos con Axios. Un interceptor le agrega a cada peticion el token JWT guardado al iniciar sesion.
2. El backend revisa el token con `autenticar`, el rol con `autorizar`, valida los datos con express-validator y responde desde MongoDB Atlas.
3. Si el backend responde 401, el interceptor del front cierra la sesion y manda al login.

El repositorio es un monorepo con dos carpetas, y cada una tiene su propio README con el detalle:

```
Trabajo-Ingenieria-Web-Full-Stack/
  backend/     API en Node.js y Express, ver backend/README.md
  frontend/    aplicacion en React y Vite, ver frontend/README.md
  .gitignore   deja por fuera node_modules, dist y los .env de las dos carpetas
```

## Tecnologias

- **Frontend:** React 19, Vite, React Router 7, Redux Toolkit, Axios, Tailwind CSS 4 y react-icons.
- **Backend:** Node.js 22, Express 5, MongoDB Atlas con Mongoose 9, JWT, bcryptjs, express-validator y Swagger.
- **Despliegue:** Vercel para el front y Render para el backend.

## Instalacion local

Se necesita Node.js 22 y una base de datos en MongoDB Atlas.

1. Clonar el repositorio:

```
git clone https://github.com/samuel29-p/Trabajo-Ingenieria-Web-Full-Stack.git
cd Trabajo-Ingenieria-Web-Full-Stack
```

2. Backend. Crear `backend/.env` a partir de `backend/.env.example` y prender el servidor:

```
cd backend
npm install
node seed/seed.js
npm run dev
```

`node seed/seed.js` borra la base y carga los datos del enunciado. La API queda en http://localhost:3000.

3. Frontend, en otra terminal. Crear `frontend/.env` a partir de `frontend/.env.example` y prender Vite:

```
cd frontend
npm install
npm run dev
```

La aplicacion queda en http://localhost:5173.

## Variables de entorno

Los archivos `.env` nunca se suben al repositorio. Cada carpeta tiene un `.env.example` con los nombres.

| Carpeta | Variable | Para que sirve |
|---|---|---|
| backend | `PORT` | Puerto del servidor, Render pone el suyo |
| backend | `MONGODB_URI` | Conexion a MongoDB Atlas |
| backend | `JWT_SECRET` | Clave con la que se firman los tokens |
| backend | `JWT_EXPIRES_IN` | Duracion del token, por ejemplo `7d` |
| backend | `NODE_ENV` | `development` en local y `production` en Render |
| frontend | `VITE_API_URL` | Direccion del backend, `http://localhost:3000/api` en local y `https://phantombids-back.onrender.com/api` en Vercel |

## Despliegue

- **Render (backend):** servicio web conectado a la rama `main`, con build `cd backend && npm install` y start `cd backend && npm start`. Las variables del backend van en Environment.
- **Vercel (frontend):** proyecto con Root Directory `frontend` y la variable `VITE_API_URL`. El archivo `frontend/vercel.json` hace que al recargar cualquier ruta, como `/house/123`, se abra la aplicacion.

Cada merge a `main` se despliega solo en los dos.

## Endpoints principales

La lista completa, con ejemplos y codigos de respuesta, esta en Swagger y en `backend/README.md`.

| Metodo | Ruta | Para que lo usa el front |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Registro e inicio de sesion |
| GET | /api/auth/me | Recargar el perfil y la reputacion |
| GET, POST, PUT, DELETE | /api/houses | Casas de subastas |
| POST | /api/houses/:id/join | Unirse a una casa |
| GET | /api/houses/:id/members, /api/houses/:id/rankings | Miembros y rankings de la casa |
| GET, POST, PUT, DELETE | /api/objects | Objetos malditos |
| GET, POST, PUT, DELETE | /api/auctions | Subastas |
| POST, GET | /api/auctions/:id/bids | Pujar y ver las pujas |
| POST, GET | /api/auctions/:id/bets | Apostar y ver las apuestas |
| POST | /api/auctions/:id/close | Cerrar la subasta y aplicar los efectos |
| GET | /api/curses, /api/curses/me | Catalogo de maldiciones y registro del usuario |
| GET, PUT, DELETE | /api/users | Perfil y administracion de usuarios |

## Integrantes

- **Samuel Restrepo Zapata** ([samuel29-p](https://github.com/samuel29-p)): estructura del backend, subastas, objetos, pujas, apuestas y cierre de subasta, base del front con Axios y Redux, pagina de subasta y despliegue.
- **Maria Paula Rozo Arboleda** ([Mariapaularozo](https://github.com/Mariapaularozo)): usuarios, autenticacion JWT, roles, casas, validaciones, Swagger, datos semilla y las paginas de casas, objetos, perfil, maldiciones y administracion.
