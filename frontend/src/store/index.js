import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

//el store guarda el estado global de la app, aqui solo vive la sesion
//los datos de casas, objetos y subastas los pide cada pagina al backend cuando se abre
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
