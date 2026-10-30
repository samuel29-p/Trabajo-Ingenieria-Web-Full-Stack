import api from "./api";

export const curseService = {
  getCatalogo: async () => {
    const response = await api.get("/curses");
    return response.data.maldiciones;
  },
  misMaldiciones: async () => {
    const response = await api.get("/curses/me");
    return response.data.maldiciones;
  },
};
