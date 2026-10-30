import axios from "axios";

//una sola instancia de axios para toda la app, la direccion del backend sale del .env
//en vite las variables del .env tienen que empezar por VITE_ para que el front las pueda leer
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

//interceptor de peticiones, antes de que salga cada peticion le pega el token en el header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

//interceptor de respuestas, si el backend dice 401 el token ya no sirve
//entonces se borra la sesion y se manda al login, menos si ya esta en el login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
