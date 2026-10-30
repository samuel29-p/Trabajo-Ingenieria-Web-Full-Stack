import api from "./api";

export const auctionService = {
  //filtros puede traer status y hauntHouseId, axios los arma como ?status=open
  getSubastas: async (filtros) => {
    const response = await api.get("/auctions", { params: filtros });
    return response.data.subastas;
  },
  getSubasta: async (id) => {
    const response = await api.get("/auctions/" + id);
    return response.data.subasta;
  },
  crearSubasta: async (cursedObjectId) => {
    const response = await api.post("/auctions", { cursedObjectId });
    return response.data.subasta;
  },
  editarCierre: async (id, endsAt) => {
    const response = await api.put("/auctions/" + id, { endsAt });
    return response.data.subasta;
  },
  eliminarSubasta: async (id) => {
    const response = await api.delete("/auctions/" + id);
    return response.data;
  },
  cerrarSubasta: async (id) => {
    const response = await api.post("/auctions/" + id + "/close");
    return response.data;
  },
  getPujas: async (id) => {
    const response = await api.get("/auctions/" + id + "/bids");
    return response.data.pujas;
  },
  miPuja: async (id) => {
    const response = await api.get("/auctions/" + id + "/bids/me");
    return response.data.puja;
  },
  pujar: async (id, amount) => {
    const response = await api.post("/auctions/" + id + "/bids", { amount });
    return response.data.puja;
  },
  getApuestas: async (id) => {
    const response = await api.get("/auctions/" + id + "/bets");
    return response.data.apuestas;
  },
  apostar: async (id, predictedAlias, amount) => {
    const response = await api.post("/auctions/" + id + "/bets", { predictedAlias, amount });
    return response.data.apuesta;
  },
};
