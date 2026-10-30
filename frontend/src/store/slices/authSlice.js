import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { mensajeError } from "../../utils/mensajeError";

//al abrir la app se revisa si ya habia una sesion guardada en el navegador
function leerSesionGuardada() {
  try {
    const usuario = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (usuario && token) {
      return { user: JSON.parse(usuario), token: token };
    }
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
  return { user: null, token: null };
}

const guardada = leerSesionGuardada();

//guarda la sesion en el navegador, asi al recargar la pagina sigue conectado
function guardarSesion(usuario, token) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(usuario));
}

export const login = createAsyncThunk("auth/login", async (datos, { rejectWithValue }) => {
  try {
    const { usuario, token } = await authService.login(datos);
    guardarSesion(usuario, token);
    return { user: usuario, token };
  } catch (error) {
    return rejectWithValue(mensajeError(error, "Could not log in"));
  }
});

//el registro tambien devuelve token, asi que deja la sesion abierta de una vez
export const registrar = createAsyncThunk("auth/registrar", async (datos, { rejectWithValue }) => {
  try {
    const { usuario, token } = await authService.registrar(datos);
    guardarSesion(usuario, token);
    return { user: usuario, token };
  } catch (error) {
    return rejectWithValue(mensajeError(error, "Could not create the account"));
  }
});

//vuelve a pedir el perfil, sirve despues de pujar, apostar o cerrar una subasta porque cambia la reputacion
export const recargarPerfil = createAsyncThunk("auth/recargarPerfil", async (_, { rejectWithValue }) => {
  try {
    const usuario = await authService.perfil();
    localStorage.setItem("user", JSON.stringify(usuario));
    return usuario;
  } catch (error) {
    return rejectWithValue(mensajeError(error, "Could not load the profile"));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: guardada.user,
    token: guardada.token,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    limpiarError: (state) => {
      state.error = null;
    },
  },
  //los extraReducers responden a los tres momentos de cada thunk, pending, fulfilled y rejected
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registrar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registrar.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registrar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(recargarPerfil.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, limpiarError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
