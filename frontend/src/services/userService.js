import api from "./api";

export const userService = {
  getUsuarios: async () => {
    const response = await api.get("/users");
    return response.data.usuarios;
  },
  getUsuario: async (id) => {
    const response = await api.get("/users/" + id);
    return response.data.usuario;
  },
  editarUsuario: async (id, datos) => {
    const response = await api.put("/users/" + id, datos);
    return response.data.usuario;
  },
  eliminarUsuario: async (id) => {
    const response = await api.delete("/users/" + id);
    return response.data;
  },
};
