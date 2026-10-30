//saca un mensaje entendible del error que devuelve axios
//el backend manda { error } y a veces { detalles } con la lista de validaciones que fallaron
export function mensajeError(error, porDefecto) {
  const datos = error.response?.data;
  if (datos?.detalles?.length) {
    return datos.detalles.join(", ");
  }
  return datos?.error || datos?.mensaje || error.message || porDefecto;
}
