const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Bet = require("../models/Bet");
const User = require("../models/User");
const CursedObject = require("../models/CursedObject");
const CurseLog = require("../models/CurseLog");
const HauntHouse = require("../models/HauntHouse");
const { CURSES } = require("../utils/curses");
const { volverPoltergeist } = require("../utils/membresia");

//reputacion que pierde cada usuario que repitio un monto con otro, requisito 15
const DUPLICATE_PENALTY = 5;
//horas que quedan como poltergeist los que repitieron monto, requisito 15
const DUPLICATE_POLTERGEIST_HOURS = 48;
//una apuesta acertada paga el triple de lo apostado, requisito 19
const BET_MULTIPLIER = 3;

//gana la puja mas baja que nadie mas repitio, requisito 12
//se cuenta cuantas veces aparece cada monto, se quedan los que aparecen una sola vez y se toma el menor
function buscarGanador(pujas) {
  const conteo = {};
  for (const puja of pujas) {
    conteo[puja.amount] = (conteo[puja.amount] || 0) + 1;
  }

  let ganadora = null;
  for (const puja of pujas) {
    if (conteo[puja.amount] === 1) {
      if (!ganadora || puja.amount < ganadora.amount) {
        ganadora = puja;
      }
    }
  }

  //las pujas cuyo monto aparece mas de una vez son las duplicadas, esas se castigan
  const duplicadas = pujas.filter((puja) => conteo[puja.amount] > 1);
  return { ganadora, duplicadas };
}

//busca dentro de la casa al miembro que corresponde a ese usuario
function buscarMiembro(casa, userId) {
  if (!casa) return null;
  return casa.members.find((m) => m.userId.toString() === userId.toString());
}

//cierra la subasta y aplica todo lo que pasa despues, ganador, castigos, maldicion y apuestas
async function cerrarSubasta(auctionId, usuario) {
  const subasta = await Auction.findById(auctionId);
  if (!subasta) {
    throw { status: 404, message: "Subasta no encontrada" };
  }

  const esCreador = subasta.createdBy.toString() === usuario._id.toString();
  if (!esCreador && usuario.role !== "admin") {
    throw { status: 403, message: "Solo el creador de la subasta o un admin puede cerrarla" };
  }
  if (subasta.status !== "open") {
    throw { status: 409, message: "Esta subasta ya fue cerrada" };
  }

  const pujas = await Bid.find({ auctionId: subasta._id });
  const { ganadora, duplicadas } = buscarGanador(pujas);
  //la casa se carga una sola vez, aqui se cambian los roles de los castigados
  const casa = await HauntHouse.findById(subasta.hauntHouseId);
  let casaCambio = false;

  //aqui se van sumando los cambios de reputacion de cada usuario
  //asi si a alguien le toca castigo y apuesta a la vez, se guarda una sola vez al final
  const cambios = {};
  function sumar(userId, valor) {
    const llave = userId.toString();
    cambios[llave] = (cambios[llave] || 0) + valor;
  }

  //los que repitieron monto pierden 5 de reputacion y quedan poltergeist 48 horas
  for (const puja of duplicadas) {
    sumar(puja.userId, -DUPLICATE_PENALTY);
    const miembro = buscarMiembro(casa, puja.userId);
    if (miembro) {
      volverPoltergeist(miembro, DUPLICATE_POLTERGEIST_HOURS);
      casaCambio = true;
    }
  }

  //al ganador le cae la maldicion base del objeto y queda registrada en el curselog, requisito 20
  let maldicion = null;
  if (ganadora) {
    subasta.winnerId = ganadora.userId;
    subasta.winningBid = ganadora.amount;

    const objeto = await CursedObject.findById(subasta.cursedObjectId);
    if (objeto) {
      maldicion = CURSES[objeto.baseCurse];
      //si la maldicion dura unas horas se calcula cuando vence, si no, queda en null y es permanente
      let expiresAt = null;
      if (maldicion.durationHours) {
        expiresAt = new Date(Date.now() + maldicion.durationHours * 60 * 60 * 1000);
      }
      await CurseLog.create({
        userId: ganadora.userId,
        auctionId: subasta._id,
        curse: maldicion.code,
        expiresAt: expiresAt,
      });

      if (maldicion.reputationChange !== 0) {
        sumar(ganadora.userId, maldicion.reputationChange);
      }

      //esta maldicion vuelve poltergeist al ganador dentro de la casa por 24 horas
      if (maldicion.code === "POLTERGEIST_24_HOURS") {
        const miembro = buscarMiembro(casa, ganadora.userId);
        if (miembro) {
          volverPoltergeist(miembro, maldicion.durationHours);
          casaCambio = true;
        }
      }
    }
  }

  if (casaCambio) {
    await casa.save();
  }

  //las apuestas se resuelven contra el alias ganador, si no hubo ganador se devuelve lo apostado
  const apuestas = await Bet.find({ auctionId: subasta._id, status: "pending" });
  for (const apuesta of apuestas) {
    if (!ganadora) {
      apuesta.status = "refunded";
      apuesta.payout = apuesta.amount;
    } else if (apuesta.predictedAlias === ganadora.alias) {
      apuesta.status = "won";
      apuesta.payout = apuesta.amount * BET_MULTIPLIER;

      //la maldicion plaster hand le quita la mitad a su siguiente ganancia, y despues se gasta
      const manoDeYeso = await CurseLog.findOne({
        userId: apuesta.bettorId,
        curse: "HALVE_NEXT_PAYOUT",
        expiresAt: { $gt: new Date() },
      });
      if (manoDeYeso) {
        apuesta.payout = Math.floor(apuesta.payout / 2);
        manoDeYeso.expiresAt = new Date();
        await manoDeYeso.save();
      }
    } else {
      apuesta.status = "lost";
      apuesta.payout = 0;
    }
    sumar(apuesta.bettorId, apuesta.payout);
    await apuesta.save();
  }

  //ahora si se guarda la reputacion de cada usuario afectado, una sola vez cada uno
  for (const userId of Object.keys(cambios)) {
    const afectado = await User.findById(userId);
    if (afectado) {
      afectado.reputation = afectado.reputation + cambios[userId];
      await afectado.save();
    }
  }

  //si nadie tuvo una puja unica la subasta queda cancelada, requisito 13
  subasta.status = ganadora ? "closed" : "cancelled";
  await subasta.save();

  return {
    subasta,
    ganador: ganadora ? { alias: ganadora.alias, amount: ganadora.amount } : null,
    duplicados: duplicadas.map((puja) => ({ alias: puja.alias, amount: puja.amount })),
    maldicion: maldicion ? { code: maldicion.code, name: maldicion.name } : null,
    apuestasResueltas: apuestas.length,
  };
}

module.exports = { cerrarSubasta };
