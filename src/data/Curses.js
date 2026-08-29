// Catalogo de las 8 maldiciones predefinidas (requisito 9).
// La clave del objeto es el codigo que guardas en cursedObject.baseCurse
// y en curseLog.curse. El resto son los datos para mostrar y para aplicar.
//
// Los CODIGOS (LOSE_10_REPUTATION, etc) nunca se traducen: son la llave
// interna que conecta este archivo con seedData. Solo el name y la
// description son texto para mostrar en pantalla.
//
// effect: "reputation" -> permanente, resta puntos (requisito 21)
//         "permission" -> temporal, bloquea algo durante X horas
//         "cosmetic"   -> temporal, solo se ve en el perfil
export const CURSES = {
  LOSE_10_REPUTATION: {
    code: "LOSE_10_REPUTATION",
    name: "Soul Leak",
    description: "You permanently lose 10 reputation points.",
    effect: "reputation",
    reputationChange: -10,
    durationHours: null, //null = no expira nunca
  },
  LOSE_20_REPUTATION: {
    code: "LOSE_20_REPUTATION",
    name: "Miser's Sentence",
    description: "You permanently lose 20 reputation points.",
    effect: "reputation",
    reputationChange: -20,
    durationHours: null,
  },
  CANNOT_BID_2_AUCTIONS: {
    code: "CANNOT_BID_2_AUCTIONS",
    name: "Spectral Gag",
    description: "You cannot bid in the next 2 auctions.",
    effect: "permission",
    reputationChange: 0,
    durationHours: 168, //7 dias
  },
  CANNOT_BET_48_HOURS: {
    code: "CANNOT_BET_48_HOURS",
    name: "Blind Eye",
    description: "You cannot place bets for 48 hours.",
    effect: "permission",
    reputationChange: 0,
    durationHours: 48,
  },
  CURSE_MARK_7_DAYS: {
    code: "CURSE_MARK_7_DAYS",
    name: "Mark of the Damned",
    description: "Your profile shows a curse mark for 7 days.",
    effect: "cosmetic",
    reputationChange: 0,
    durationHours: 168,
  },
  ALIAS_REVEALED: {
    code: "ALIAS_REVEALED",
    name: "Torn Veil",
    description: "Your alias is revealed in the next auction of the house.",
    effect: "permission",
    reputationChange: 0,
    durationHours: 72,
  },
  HALVE_NEXT_PAYOUT: {
    code: "HALVE_NEXT_PAYOUT",
    name: "Plaster Hand",
    description: "Your next betting payout is cut in half.",
    effect: "permission",
    reputationChange: 0,
    durationHours: 120,
  },
  POLTERGEIST_24_HOURS: {
    code: "POLTERGEIST_24_HOURS",
    name: "Brief Exile",
    description: "You become a Poltergeist in your house for 24 hours.",
    effect: "permission",
    reputationChange: 0,
    durationHours: 24,
  },
};

// Object.values convierte el objeto de arriba en un arreglo con sus 8 valores.
// Sirve para recorrerlo con .map() en las listas y en los <select>.
export const CURSE_LIST = Object.values(CURSES);