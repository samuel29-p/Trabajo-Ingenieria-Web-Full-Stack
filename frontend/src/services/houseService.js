import api from "./api";

export const houseService = {
  getCasas: async () => {
    const response = await api.get("/houses");
    return response.data.casas;
  },
  getCasa: async (id) => {
    const response = await api.get("/houses/" + id);
    return response.data.casa;
  },
  crearCasa: async (datos) => {
    const response = await api.post("/houses", datos);
    return response.data.casa;
  },
  editarCasa: async (id, datos) => {
    const response = await api.put("/houses/" + id, datos);
    return response.data.casa;
  },
  eliminarCasa: async (id) => {
    const response = await api.delete("/houses/" + id);
    return response.data;
  },
  unirse: async (id, inviteCode) => {
    const response = await api.post("/houses/" + id + "/join", { inviteCode });
    return response.data.casa;
  },
  getMiembros: async (id) => {
    const response = await api.get("/houses/" + id + "/members");
    return response.data.miembros;
  },
  getRankings: async (id) => {
    const response = await api.get("/houses/" + id + "/rankings");
    return response.data.rankings;
  },
};
