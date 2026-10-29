const HauntHouse = require("../models/HauntHouse");

//si el castigo de poltergeist ya vencio, el miembro vuelve al rol que tenia antes, requisito 15
//se revisa cada vez que se busca la casa, en vez de tener un proceso aparte que lo haga solo
async function levantarCastigos(casa) {
  const ahora = new Date();
  let huboCambios = false;
  for (const miembro of casa.members) {
    if (miembro.role === "Poltergeist" && miembro.poltergeistUntil && miembro.poltergeistUntil <= ahora) {
      miembro.role = miembro.previousRole || "Spirit";
      miembro.poltergeistUntil = null;
      miembro.previousRole = null;
      huboCambios = true;
    }
  }
  if (huboCambios) {
    await casa.save();
  }
}

//vuelve poltergeist a un miembro por unas horas y guarda su rol para devolverselo despues
//si ya era poltergeist para siempre, se queda asi
function volverPoltergeist(miembro, horas) {
  if (miembro.role === "Poltergeist" && !miembro.poltergeistUntil) {
    return;
  }
  if (miembro.role !== "Poltergeist") {
    miembro.previousRole = miembro.role;
  }
  miembro.role = "Poltergeist";
  miembro.poltergeistUntil = new Date(Date.now() + horas * 60 * 60 * 1000);
}

//busca la casa y revisa si el usuario es miembro de ella
//la usan los servicios de objetos, subastas, pujas y apuestas, por eso vive en utils
async function buscarCasaYMiembro(hauntHouseId, userId) {
  const casa = await HauntHouse.findById(hauntHouseId);
  if (!casa) {
    throw { status: 404, message: "Casa no encontrada" };
  }
  await levantarCastigos(casa);
  //los ids de mongo son objetos, por eso se comparan como texto con toString
  const miembro = casa.members.find((m) => m.userId.toString() === userId.toString());
  return { casa, miembro };
}

module.exports = { buscarCasaYMiembro, levantarCastigos, volverPoltergeist };
