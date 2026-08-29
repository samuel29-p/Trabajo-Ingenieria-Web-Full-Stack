// Datos semilla de PhantomBids (seccion "Seed Data" del enunciado).
// Se cargan una sola vez, cuando localStorage esta vacio.
// Regla que se respeta en todo el archivo: las entidades NO se anidan,
// se conectan por id (userId, auctionId, hauntHouseId...).
//
// IMAGENES: las rutas que empiezan con /images/ apuntan a la carpeta
// public/images del proyecto. Todo lo que este en public se sirve desde
// la raiz, por eso NO se escribe "public" en la ruta.

// 12 usuarios, con las reputaciones exactas que pide el enunciado.
// La contrasena va en claro porque no hay servidor.
export const SEED_USERS = [
  { id: 1, username: "vinland", email: "vinland@phantom.com", password: "1234", reputation: 120, joinDate: "2026-01-14", avatarUrl: "/images/AV1.png" },
  { id: 2, username: "newfoundland", email: "newfoundland@phantom.com", password: "1234", reputation: 100, joinDate: "2026-01-20", avatarUrl: "/images/AV2.png" },
  { id: 3, username: "illWin", email: "illWin@phantom.com", password: "1234", reputation: 95, joinDate: "2026-02-02", avatarUrl: "/images/AV3.png" },
  { id: 4, username: "cheeseburger", email: "cheeseburger@phantom.com", password: "1234", reputation: 85, joinDate: "2026-02-11", avatarUrl: "/images/AV4.png" },
  { id: 5, username: "blackberries", email: "blackberries@phantom.com", password: "1234", reputation: 80, joinDate: "2026-02-27", avatarUrl: "/images/AV5.png" },
  { id: 6, username: "strawberries", email: "strawberries@phantom.com", password: "1234", reputation: 75, joinDate: "2026-03-05", avatarUrl: "/images/AV6.png" },
  { id: 7, username: "deutschland", email: "deutschland@phantom.com", password: "1234", reputation: 70, joinDate: "2026-03-19", avatarUrl: "/images/AV7.png" },
  { id: 8, username: "photographer", email: "photographer@phantom.com", password: "1234", reputation: 65, joinDate: "2026-04-01", avatarUrl: "/images/AV8.png" },
  { id: 9, username: "thing", email: "thing@phantom.com", password: "1234", reputation: 60, joinDate: "2026-04-17", avatarUrl: "/images/AV9.png" },
  { id: 10, username: "persona", email: "persona@phantom.com", password: "1234", reputation: 55, joinDate: "2026-05-08", avatarUrl: "/images/AV10.jpg" },
  { id: 11, username: "animal", email: "animal@phantom.com", password: "1234", reputation: 50, joinDate: "2026-05-23", avatarUrl: "/images/AV11.jpg" },
  { id: 12, username: "place", email: "place@phantom.com", password: "1234", reputation: 45, joinDate: "2026-06-06", avatarUrl: "/images/AV12.jpg" },
];

// 3 casas de subastas (temas Darkness, Comedy, Terror).
// Los roles del requisito 7 viven dentro de members:
// HeadHaunter (1 max), SeniorSpook (2 max), Spirit, Poltergeist.
export const SEED_HOUSES = [
  {
    id: 1,
    name: "The Silent Crypt",
    theme: "Darkness",
    description: "Objects that only whisper when nobody is watching.",
    coverImageUrl: "/images/house-crypt.jpeg",
    isPrivate: false,
    inviteCode: null, //solo las privadas tienen codigo
    createdAt: "2026-02-01T10:00:00",
    members: [
      { userId: 1, role: "HeadHaunter", joinedAt: "2026-02-01T10:00:00" },
      { userId: 3, role: "SeniorSpook", joinedAt: "2026-02-03T12:00:00" },
      { userId: 5, role: "SeniorSpook", joinedAt: "2026-02-04T09:30:00" },
      { userId: 7, role: "Spirit", joinedAt: "2026-02-10T16:00:00" },
      { userId: 9, role: "Spirit", joinedAt: "2026-02-15T18:20:00" },
      { userId: 11, role: "Poltergeist", joinedAt: "2026-03-01T21:00:00" },
    ],
  },
  {
    id: 2,
    name: "The Laughing Basement",
    theme: "Comedy",
    description: "Curses that bring more shame than fear.",
    coverImageUrl: "/images/house-basement.jpeg",
    isPrivate: false,
    inviteCode: null,
    createdAt: "2026-02-20T11:00:00",
    members: [
      { userId: 2, role: "HeadHaunter", joinedAt: "2026-02-20T11:00:00" },
      { userId: 6, role: "SeniorSpook", joinedAt: "2026-02-22T14:00:00" },
      { userId: 8, role: "Spirit", joinedAt: "2026-03-02T10:15:00" },
      { userId: 10, role: "Spirit", joinedAt: "2026-03-08T19:45:00" },
      { userId: 12, role: "Spirit", joinedAt: "2026-03-14T08:00:00" },
    ],
  },
  {
    id: 3,
    name: "Room 13",
    theme: "Terror",
    description: "Private house. Nobody gets in without a code.",
    coverImageUrl: "/images/house-room13.jpeg",
    isPrivate: true,
    inviteCode: "SALA13", //el codigo que pide el formulario de unirse
    createdAt: "2026-03-10T22:00:00",
    members: [
      { userId: 4, role: "HeadHaunter", joinedAt: "2026-03-10T22:00:00" },
      { userId: 1, role: "SeniorSpook", joinedAt: "2026-03-11T23:10:00" },
      { userId: 7, role: "Spirit", joinedAt: "2026-03-18T20:00:00" },
      { userId: 9, role: "Spirit", joinedAt: "2026-03-25T17:30:00" },
    ],
  },
];

// 8 objetos malditos (requisito 8).
// Reglas: minBid entre 1 y 100, maxBid entre 10 y 500,
// durationDays entre 1 y 7.
// baseCurse guarda el codigo de una maldicion de Curses.js.
export const SEED_OBJECTS = [
  { id: 1, hauntHouseId: 1, createdBy: 1, name: "Porcelain Doll", description: "It blinks when nobody is looking.", imageUrl: "/images/doll.jpeg", baseCurse: "LOSE_10_REPUTATION", minBid: 5, maxBid: 60, durationDays: 3 },
  { id: 2, hauntHouseId: 1, createdBy: 3, name: "Cursed Mirror", description: "It reflects whoever stood there before you.", imageUrl: "/images/mirror.jpeg", baseCurse: "CURSE_MARK_7_DAYS", minBid: 1, maxBid: 40, durationDays: 5 },
  { id: 3, hauntHouseId: 1, createdBy: 5, name: "Clock Without Hands", description: "It marks the hour of your last mistake.", imageUrl: "/images/clock.jpeg", baseCurse: "CANNOT_BID_2_AUCTIONS", minBid: 10, maxBid: 80, durationDays: 7 },
  { id: 4, hauntHouseId: 2, createdBy: 2, name: "Terrifying Clown Nose", description: "It honks by itself at 3 in the morning.", imageUrl: "/images/nose.jpeg", baseCurse: "ALIAS_REVEALED", minBid: 3, maxBid: 30, durationDays: 2 },
  { id: 5, hauntHouseId: 2, createdBy: 6, name: "The Laughing Chair", description: "It creaks with a cackle if you sit down.", imageUrl: "/images/chair.jpeg", baseCurse: "HALVE_NEXT_PAYOUT", minBid: 2, maxBid: 25, durationDays: 4 },
  { id: 6, hauntHouseId: 2, createdBy: 8, name: "Dead Manager's Tie", description: "It tightens by itself during meetings.", imageUrl: "/images/tie.jpeg", baseCurse: "CANNOT_BET_48_HOURS", minBid: 8, maxBid: 50, durationDays: 3 },
  { id: 7, hauntHouseId: 3, createdBy: 4, name: "Key to Door 13", description: "It opens a room that does not exist.", imageUrl: "/images/key.jpeg", baseCurse: "LOSE_20_REPUTATION", minBid: 5, maxBid: 100, durationDays: 6 },
  { id: 8, hauntHouseId: 3, createdBy: 1, name: "The Blank Diary", description: "It wakes up written in your handwriting.", imageUrl: "/images/diary.jpeg", baseCurse: "POLTERGEIST_24_HOURS", minBid: 1, maxBid: 35, durationDays: 2 },
];

// 6 subastas: 3 abiertas, 2 cerradas con ganador, 1 cancelada.
// winnerId y winningBid quedan en null mientras no haya ganador.
export const SEED_AUCTIONS = [
  { id: 1, hauntHouseId: 1, cursedObjectId: 1, createdBy: 1, startsAt: "2026-08-21T18:00:00", endsAt: "2026-08-26T18:00:00", status: "open", winnerId: null, winningBid: null },
  { id: 2, hauntHouseId: 2, cursedObjectId: 4, createdBy: 2, startsAt: "2026-08-22T09:00:00", endsAt: "2026-08-25T09:00:00", status: "open", winnerId: null, winningBid: null },
  { id: 3, hauntHouseId: 3, cursedObjectId: 7, createdBy: 4, startsAt: "2026-08-22T20:00:00", endsAt: "2026-08-28T20:00:00", status: "open", winnerId: null, winningBid: null },
  { id: 4, hauntHouseId: 1, cursedObjectId: 3, createdBy: 3, startsAt: "2026-08-10T12:00:00", endsAt: "2026-08-17T12:00:00", status: "closed", winnerId: 9, winningBid: 19 },
  { id: 5, hauntHouseId: 2, cursedObjectId: 5, createdBy: 6, startsAt: "2026-08-12T15:00:00", endsAt: "2026-08-16T15:00:00", status: "closed", winnerId: 10, winningBid: 4 },
  { id: 6, hauntHouseId: 3, cursedObjectId: 8, createdBy: 4, startsAt: "2026-08-08T10:00:00", endsAt: "2026-08-10T10:00:00", status: "cancelled", winnerId: null, winningBid: null },
];

// 25 pujas. Cada usuario puja una sola vez por subasta (requisito 10).
// El alias es temporal y por subasta (requisito 3).
//
// Escenarios de duplicados incluidos (requisito 15):
//   subasta 2 -> el 7 se repite
//   subasta 4 -> el 12 se repite
//   subasta 5 -> el 11 se repite
//   subasta 6 -> todo se repite, por eso quedo cancelada
export const SEED_BIDS = [
  // Subasta 1 (abierta, objeto 1: min 5, max 60). Sin duplicados.
  { id: 1, auctionId: 1, userId: 3, amount: 8, alias: "Withered_42", createdAt: "2026-08-21T19:10:00" },
  { id: 2, auctionId: 1, userId: 5, amount: 13, alias: "Pallid_17", createdAt: "2026-08-21T20:02:00" },
  { id: 3, auctionId: 1, userId: 7, amount: 21, alias: "Hollow_88", createdAt: "2026-08-22T08:45:00" },
  { id: 4, auctionId: 1, userId: 9, amount: 34, alias: "Murky_05", createdAt: "2026-08-22T11:30:00" },
  { id: 5, auctionId: 1, userId: 11, amount: 55, alias: "Rancid_63", createdAt: "2026-08-22T14:12:00" },

  // Subasta 2 (abierta, objeto 4: min 3, max 30). El 7 esta duplicado.
  { id: 6, auctionId: 2, userId: 6, amount: 5, alias: "Jester_21", createdAt: "2026-08-22T10:00:00" },
  { id: 7, auctionId: 2, userId: 8, amount: 7, alias: "Grotesque_49", createdAt: "2026-08-22T10:40:00" },
  { id: 8, auctionId: 2, userId: 10, amount: 7, alias: "Absurd_33", createdAt: "2026-08-22T12:15:00" },
  { id: 9, auctionId: 2, userId: 12, amount: 15, alias: "Clumsy_76", createdAt: "2026-08-22T16:50:00" },

  // Subasta 3 (abierta, objeto 7: min 5, max 100). Sin duplicados.
  { id: 10, auctionId: 3, userId: 1, amount: 12, alias: "Somber_08", createdAt: "2026-08-22T21:00:00" },
  { id: 11, auctionId: 3, userId: 7, amount: 19, alias: "Stiff_54", createdAt: "2026-08-22T22:30:00" },
  { id: 12, auctionId: 3, userId: 9, amount: 30, alias: "Gelid_91", createdAt: "2026-08-23T07:20:00" },

  // Subasta 4 (cerrada, objeto 3: min 10, max 80).
  // Duplicado en 12. Menor unico = 19 -> gana el usuario 9.
  { id: 13, auctionId: 4, userId: 1, amount: 12, alias: "Fleeting_11", createdAt: "2026-08-11T09:00:00" },
  { id: 14, auctionId: 4, userId: 5, amount: 12, alias: "Opaque_26", createdAt: "2026-08-11T14:20:00" },
  { id: 15, auctionId: 4, userId: 9, amount: 19, alias: "Dismal_70", createdAt: "2026-08-12T18:05:00" },
  { id: 16, auctionId: 4, userId: 7, amount: 28, alias: "Wilted_39", createdAt: "2026-08-14T11:45:00" },
  { id: 17, auctionId: 4, userId: 11, amount: 45, alias: "Gloomy_02", createdAt: "2026-08-16T20:30:00" },

  // Subasta 5 (cerrada, objeto 5: min 2, max 25).
  // Duplicado en 11. Menor unico = 4 -> gana el usuario 10.
  { id: 18, auctionId: 5, userId: 10, amount: 4, alias: "Giddy_60", createdAt: "2026-08-12T16:00:00" },
  { id: 19, auctionId: 5, userId: 2, amount: 11, alias: "Clownish_14", createdAt: "2026-08-13T10:10:00" },
  { id: 20, auctionId: 5, userId: 8, amount: 11, alias: "Foolish_57", createdAt: "2026-08-13T13:35:00" },
  { id: 21, auctionId: 5, userId: 12, amount: 17, alias: "Crude_83", createdAt: "2026-08-15T09:25:00" },

  // Subasta 6 (cancelada, objeto 8: min 1, max 35).
  // Todos los valores estan repetidos, no hay ninguno unico (requisito 13).
  { id: 22, auctionId: 6, userId: 1, amount: 10, alias: "Wicked_45", createdAt: "2026-08-08T11:00:00" },
  { id: 23, auctionId: 6, userId: 4, amount: 10, alias: "Dreadful_29", createdAt: "2026-08-08T15:40:00" },
  { id: 24, auctionId: 6, userId: 7, amount: 20, alias: "Fatal_67", createdAt: "2026-08-09T08:15:00" },
  { id: 25, auctionId: 6, userId: 9, amount: 20, alias: "Sinister_93", createdAt: "2026-08-09T19:50:00" },
];

// 10 apuestas (requisitos 16 al 19).
// Se apuesta al alias, nunca al username real.
// pending = payout 0. won = payout = amount * 3. lost = payout 0.
export const SEED_BETS = [
  // Sobre subastas abiertas: todavia sin resolver.
  { id: 1, auctionId: 1, bettorId: 1, predictedAlias: "Withered_42", amount: 25, status: "pending", payout: 0, createdAt: "2026-08-22T09:00:00" },
  { id: 2, auctionId: 1, bettorId: 7, predictedAlias: "Pallid_17", amount: 10, status: "pending", payout: 0, createdAt: "2026-08-22T10:30:00" },
  { id: 3, auctionId: 2, bettorId: 2, predictedAlias: "Jester_21", amount: 50, status: "pending", payout: 0, createdAt: "2026-08-22T13:00:00" },
  { id: 4, auctionId: 3, bettorId: 4, predictedAlias: "Somber_08", amount: 5, status: "pending", payout: 0, createdAt: "2026-08-23T08:00:00" },

  // Sobre la subasta 4, que gano "Dismal_70" (usuario 9).
  { id: 5, auctionId: 4, bettorId: 3, predictedAlias: "Dismal_70", amount: 25, status: "won", payout: 75, createdAt: "2026-08-13T10:00:00" },
  { id: 6, auctionId: 4, bettorId: 11, predictedAlias: "Fleeting_11", amount: 10, status: "lost", payout: 0, createdAt: "2026-08-14T16:20:00" },
  { id: 7, auctionId: 4, bettorId: 5, predictedAlias: "Wilted_39", amount: 50, status: "lost", payout: 0, createdAt: "2026-08-15T21:00:00" },

  // Sobre la subasta 5, que gano "Giddy_60" (usuario 10).
  { id: 8, auctionId: 5, bettorId: 6, predictedAlias: "Giddy_60", amount: 10, status: "won", payout: 30, createdAt: "2026-08-14T12:00:00" },
  { id: 9, auctionId: 5, bettorId: 12, predictedAlias: "Clownish_14", amount: 5, status: "lost", payout: 0, createdAt: "2026-08-14T18:45:00" },

  // Sobre la subasta 6, que se cancelo: la apuesta se devuelve.
  { id: 10, auctionId: 6, bettorId: 9, predictedAlias: "Wicked_45", amount: 25, status: "refunded", payout: 25, createdAt: "2026-08-09T09:30:00" },
];

// 3 maldiciones ya aplicadas (requisitos 20 al 22).
// expiresAt en null = efecto permanente.
export const SEED_CURSE_LOG = [
  // El usuario 9 gano la subasta 4 y se llevo el reloj sin manecillas.
  { id: 1, userId: 9, auctionId: 4, curse: "CANNOT_BID_2_AUCTIONS", appliedAt: "2026-08-17T12:00:00", expiresAt: "2026-08-24T12:00:00" },
  // El usuario 10 gano la subasta 5 y se llevo la silla que se rie.
  { id: 2, userId: 10, auctionId: 5, curse: "HALVE_NEXT_PAYOUT", appliedAt: "2026-08-16T15:00:00", expiresAt: "2026-08-21T15:00:00" },
  // El usuario 1 quedo marcado en una subasta vieja. Efecto permanente.
  { id: 3, userId: 1, auctionId: 4, curse: "LOSE_10_REPUTATION", appliedAt: "2026-08-17T12:00:00", expiresAt: null },
];

// Un solo objeto con todo, para cargarlo de un tiron en el contexto.
export const SEED_DATA = {
  users: SEED_USERS,
  houses: SEED_HOUSES,
  objects: SEED_OBJECTS,
  auctions: SEED_AUCTIONS,
  bids: SEED_BIDS,
  bets: SEED_BETS,
  curseLog: SEED_CURSE_LOG,
};