const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Bet = require("../models/Bet");
const CurseLog = require("../models/CurseLog");
const User = require("../models/User");
const { buscarCasaYMiembro } = require("../utils/membresia");

//los cuatro rankings de una casa, requisito 23
//como muestran nombres reales, solo los ven los miembros de la casa o un admin, requisito 6
async function rankingsDeCasa(houseId, usuario) {
  const { casa, miembro } = await buscarCasaYMiembro(houseId, usuario._id);
  if (!miembro && usuario.role !== "admin") {
    throw { status: 403, message: "Solo los miembros de esta casa pueden ver sus rankings" };
  }

  //primero se traen las subastas de la casa, y con sus ids todo lo demas
  const subastas = await Auction.find({ hauntHouseId: casa._id });
  const idsSubastas = subastas.map((s) => s._id);
  const pujas = await Bid.find({ auctionId: { $in: idsSubastas } });
  const apuestas = await Bet.find({ auctionId: { $in: idsSubastas } });
  const maldiciones = await CurseLog.find({ auctionId: { $in: idsSubastas } });
  const usuarios = await User.find({ _id: { $in: casa.members.map((m) => m.userId) } });

  //por cada miembro se calculan sus numeros, comparando los ids como texto
  const stats = casa.members.map((m) => {
    const id = m.userId.toString();
    const datosUsuario = usuarios.find((u) => u._id.toString() === id);

    const victorias = subastas.filter((s) => s.winnerId && s.winnerId.toString() === id).length;
    const totalMaldiciones = maldiciones.filter((c) => c.userId.toString() === id).length;

    //lo que gano apostando menos lo que aposto, las pendientes todavia no cuentan
    const ganancia = apuestas
      .filter((b) => b.bettorId.toString() === id && b.status !== "pending")
      .reduce((suma, b) => suma + b.payout - b.amount, 0);

    const misPujas = pujas.filter((p) => p.userId.toString() === id);
    const totalPujado = misPujas.reduce((suma, p) => suma + p.amount, 0);
    const promedioPuja = misPujas.length > 0 ? Math.round(totalPujado / misPujas.length) : 0;

    return {
      userId: m.userId,
      username: datosUsuario ? datosUsuario.username : "Usuario eliminado",
      wins: victorias,
      curses: totalMaldiciones,
      profit: ganancia,
      avgBid: promedioPuja,
      bidCount: misPujas.length,
    };
  });

  //slice saca una copia antes de ordenar, porque sort cambia el arreglo original
  return {
    //peor pujador, el que en promedio puja mas alto, que en una subasta inversa es jugar mal
    worstBidder: stats.slice().filter((s) => s.bidCount > 0).sort((a, b) => b.avgBid - a.avgBid),
    //el mas maldito
    totalCursed: stats.slice().sort((a, b) => b.curses - a.curses),
    //espiritus libres, los que nunca han ganado
    freeSpirits: stats.filter((s) => s.wins === 0),
    //profeta de apuestas, el que mas ha ganado apostando
    bettingProphet: stats.slice().sort((a, b) => b.profit - a.profit),
  };
}

module.exports = { rankingsDeCasa };
