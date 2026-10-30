const CurseLog = require("../models/CurseLog");

//revisa si el usuario tiene esa maldicion todavia vigente, las que ya vencieron no cuentan
//se revisa en cada peticion que la necesita, asi no hace falta un proceso aparte que las borre
async function tieneMaldicionActiva(userId, code) {
  const registros = await CurseLog.find({ userId: userId, curse: code });
  const ahora = new Date();
  return registros.some((r) => r.expiresAt && r.expiresAt > ahora);
}

module.exports = { tieneMaldicionActiva };
