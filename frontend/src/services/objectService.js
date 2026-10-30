import api from "./api";

export const objectService = {
  //si llega el id de una casa, solo trae los objetos de esa casa
  getObjetos: async (hauntHouseId) => {
    const response = await api.get("/objects", { params: { hauntHouseId } });
    return response.data.objetos;
  },
  getObjeto: async (id) => {
    const response = await api.get("/objects/" + id);
    return response.data.objeto;
  },
  crearObjeto: async (datos) => {
    const response = await api.post("/objects", datos);
    return response.data.objeto;
  },
  editarObjeto: async (id, datos) => {
    const response = await api.put("/objects/" + id, datos);
    return response.data.objeto;
  },
  eliminarObjeto: async (id) => {
    const response = await api.delete("/objects/" + id);
    return response.data;
  },
};
