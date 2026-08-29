// Catalogo de las 8 maldiciones predefinidas (requisito 9).
// La clave del objeto es el codigo que guardas en cursedObject.baseCurse
// y en curseLog.curse. El resto son los datos para mostrar y para aplicar.
//
// effect: "reputation" -> permanente, resta puntos (requisito 21)
//         "permission" -> temporal, bloquea algo durante X horas
//         "cosmetic"   -> temporal, solo se ve en el perfil
export const CURSES = {
    LOSE_10_REPUTATION: {
      code: "LOSE_10_REPUTATION",
      name: "Sangria de alma",
      description: "Pierdes 10 puntos de reputacion para siempre.",
      effect: "reputation",
      reputationChange: -10,
      durationHours: null,
    },
    LOSE_20_REPUTATION: {
      code: "LOSE_20_REPUTATION",
      name: "Condena del avaro",
      description: "Pierdes 20 puntos de reputacion para siempre.",
      effect: "reputation",
      reputationChange: -20,
      durationHours: null,
    },
    CANNOT_BID_2_AUCTIONS: {
      code: "CANNOT_BID_2_AUCTIONS",
      name: "Mordaza espectral",
      description: "No puedes pujar en las proximas 2 subastas.",
      effect: "permission",
      reputationChange: 0,
      durationHours: 168,
    },
    CANNOT_BET_48_HOURS: {
      code: "CANNOT_BET_48_HOURS",
      name: "Ojo ciego",
      description: "No puedes apostar durante 48 horas.",
      effect: "permission",
      reputationChange: 0,
      durationHours: 48,
    },
    CURSE_MARK_7_DAYS: {
      code: "CURSE_MARK_7_DAYS",
      name: "Marca del condenado",
      description: "Tu perfil muestra una marca maldita durante 7 dias.",
      effect: "cosmetic",
      reputationChange: 0,
      durationHours: 168,
    },
    ALIAS_REVEALED: {
      code: "ALIAS_REVEALED",
      name: "Velo rasgado",
      description: "Tu alias queda revelado en la proxima subasta de la casa.",
      effect: "permission",
      reputationChange: 0,
      durationHours: 72,
    },
    HALVE_NEXT_PAYOUT: {
      code: "HALVE_NEXT_PAYOUT",
      name: "Mano de yeso",
      description: "Tu proxima ganancia en apuestas se reduce a la mitad.",
      effect: "permission",
      reputationChange: 0,
      durationHours: 120,
    },
    POLTERGEIST_24_HOURS: {
      code: "POLTERGEIST_24_HOURS",
      name: "Destierro breve",
      description: "Quedas como Poltergeist en tu casa durante 24 horas.",
      effect: "permission",
      reputationChange: 0,
      durationHours: 24,
    },
  };
  
  // Lista para recorrer con .map() en los formularios (un <select> de maldiciones).
  export const CURSE_LIST = Object.values(CURSES);