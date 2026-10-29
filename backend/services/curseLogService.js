const CurseLog = require("../models/CurseLog");
const { CURSES } = require("../utils/curses");

//el registro de maldiciones del usuario, requisitos 20 al 22
//a cada entrada se le pega el nombre y la descripcion del catalogo, y si todavia esta activa
async function misMaldiciones(userId) {
  const registros = await CurseLog.find({ userId: userId }).sort({ appliedAt: -1 });
  const ahora = new Date();
  return registros.map((r) => ({
    _id: r._id,
    auctionId: r.auctionId,
    curse: r.curse,
    name: CURSES[r.curse].name,
    description: CURSES[r.curse].description,
    effect: CURSES[r.curse].effect,
    appliedAt: r.appliedAt,
    expiresAt: r.expiresAt,
    //las de expiresAt en null son permanentes, por eso cuentan como activas
    active: r.expiresAt === null || r.expiresAt > ahora,
  }));
}

module.exports = { misMaldiciones };
