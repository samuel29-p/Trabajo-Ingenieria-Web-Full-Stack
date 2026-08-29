// Datos semilla de PhantomBids (seccion "Seed Data" del enunciado).
// Se cargan una sola vez, cuando localStorage esta vacio.
// Regla que se respeta en todo el archivo: las entidades NO se anidan,
// se conectan por id (userId, auctionId, hauntHouseId...).
// 12 usuarios, con las reputaciones exactas que pide el enunciado.
// La contrasena va en claro porque no hay servidor.

export const SEED_USERS = [
    { id: 1, username: "vinland", email: "vinland@phantom.com", password: "1234", reputation: 120, joinDate: "2026-01-14", avatarUrl: "https://i.pravatar.cc/150?u=1" },
    { id: 2, username: "newfoundland", email: "newfoundland@phantom.com", password: "1234", reputation: 100, joinDate: "2026-01-20", avatarUrl: "https://i.pravatar.cc/150?u=2" },
    { id: 3, username: "illWin", email: "illWin@phantom.com", password: "1234", reputation: 95, joinDate: "2026-02-02", avatarUrl: "https://i.pravatar.cc/150?u=3" },
    { id: 4, username: "cheeseburger", email: "cheeseburger@phantom.com", password: "1234", reputation: 85, joinDate: "2026-02-11", avatarUrl: "https://i.pravatar.cc/150?u=4" },
    { id: 5, username: "blackberries", email: "blackberries@phantom.com", password: "1234", reputation: 80, joinDate: "2026-02-27", avatarUrl: "https://i.pravatar.cc/150?u=5" },
    { id: 6, username: "strawberries", email: "strawberries@phantom.com", password: "1234", reputation: 75, joinDate: "2026-03-05", avatarUrl: "https://i.pravatar.cc/150?u=6" },
    { id: 7, username: "deutschland", email: "deutschland@phantom.com", password: "1234", reputation: 70, joinDate: "2026-03-19", avatarUrl: "https://i.pravatar.cc/150?u=7" },
    { id: 8, username: "photographer", email: "photographer@phantom.com", password: "1234", reputation: 65, joinDate: "2026-04-01", avatarUrl: "https://i.pravatar.cc/150?u=8" },
    { id: 9, username: "thing", email: "thing@phantom.com", password: "1234", reputation: 60, joinDate: "2026-04-17", avatarUrl: "https://i.pravatar.cc/150?u=9" },
    { id: 10, username: "persona", email: "persona@phantom.com", password: "1234", reputation: 55, joinDate: "2026-05-08", avatarUrl: "https://i.pravatar.cc/150?u=10" },
    { id: 11, username: "animal", email: "animal@phantom.com", password: "1234", reputation: 50, joinDate: "2026-05-23", avatarUrl: "https://i.pravatar.cc/150?u=11" },
    { id: 12, username: "place", email: "place@phantom.com", password: "1234", reputation: 45, joinDate: "2026-06-06", avatarUrl: "https://i.pravatar.cc/150?u=12" },
  ];
  

  // 3 casas de subastas (temas Darkness, Comedy, Terror).
  // Los roles del requisito 7 viven dentro de members:
  // HeadHaunter (1 max), SeniorSpook (2 max), Spirit, Poltergeist.

  export const SEED_HOUSES = [
    {
      id: 1,
      name: "La Cripta Silenciosa",
      theme: "Darkness",
      description: "Objetos que solo susurran cuando nadie los mira.",
      coverImageUrl: "https://picsum.photos/seed/cripta/600/300",
      isPrivate: false,
      inviteCode: null,
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
      name: "El Sotano de las Risas",
      theme: "Comedy",
      description: "Maldiciones que dan mas verguenza que miedo.",
      coverImageUrl: "https://picsum.photos/seed/sotano/600/300",
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
      name: "Sala 13",
      theme: "Terror",
      description: "Casa privada. Aqui nadie entra sin codigo.",
      coverImageUrl: "https://picsum.photos/seed/sala13/600/300",
      isPrivate: true,
      inviteCode: "SALA13",
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
  // Reglas: minBid entre 1 y 100, maxBid entre minBid+10 y 500,
  // durationDays entre 1 y 7.

  export const SEED_OBJECTS = [
    { id: 1, hauntHouseId: 1, createdBy: 1, name: "Munieca de porcelana", description: "Parpadea cuando nadie la mira.", imageUrl: "https://picsum.photos/seed/munieca/400/400", baseCurse: "LOSE_10_REPUTATION", minBid: 5, maxBid: 60, durationDays: 3 },
    { id: 2, hauntHouseId: 1, createdBy: 3, name: "Espejo maldito", description: "Refleja a quien estuvo antes que tu.", imageUrl: "https://picsum.photos/seed/espejo/400/400", baseCurse: "CURSE_MARK_7_DAYS", minBid: 1, maxBid: 40, durationDays: 5 },
    { id: 3, hauntHouseId: 1, createdBy: 5, name: "Reloj sin manecillas", description: "Marca la hora de tu ultimo error.", imageUrl: "https://picsum.photos/seed/reloj/400/400", baseCurse: "CANNOT_BID_2_AUCTIONS", minBid: 10, maxBid: 80, durationDays: 7 },
    { id: 4, hauntHouseId: 2, createdBy: 2, name: "Nariz de payaso terrorifico", description: "Suena sola a las 3 de la maniana.", imageUrl: "https://picsum.photos/seed/payaso/400/400", baseCurse: "ALIAS_REVEALED", minBid: 3, maxBid: 30, durationDays: 2 },
    { id: 5, hauntHouseId: 2, createdBy: 6, name: "Silla que se rie", description: "Cruje con carcajada si te sientas.", imageUrl: "https://picsum.photos/seed/silla/400/400", baseCurse: "HALVE_NEXT_PAYOUT", minBid: 2, maxBid: 25, durationDays: 4 },
    { id: 6, hauntHouseId: 2, createdBy: 8, name: "Corbata del gerente muerto", description: "Se aprieta sola en las reuniones.", imageUrl: "https://picsum.photos/seed/corbata/400/400", baseCurse: "CANNOT_BET_48_HOURS", minBid: 8, maxBid: 50, durationDays: 3 },
    { id: 7, hauntHouseId: 3, createdBy: 4, name: "Llave de la puerta 13", description: "Abre una habitacion que no existe.", imageUrl: "https://picsum.photos/seed/llave/400/400", baseCurse: "LOSE_20_REPUTATION", minBid: 5, maxBid: 100, durationDays: 6 },
    { id: 8, hauntHouseId: 3, createdBy: 1, name: "Diario en blanco", description: "Amanece con tu letra escrita.", imageUrl: "https://picsum.photos/seed/diario/400/400", baseCurse: "POLTERGEIST_24_HOURS", minBid: 1, maxBid: 35, durationDays: 2 },
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

  export const SEED_BIDS = [//alias creados con una pagina que aleatoriza usernames, no me dio la creatividad
    // Subasta 1 (abierta, objeto 1: min 5, max 60). Sin duplicados.
    { id: 1, auctionId: 1, userId: 3, amount: 8, alias: "Marchito_42", createdAt: "2026-08-21T19:10:00" },
    { id: 2, auctionId: 1, userId: 5, amount: 13, alias: "Palido_17", createdAt: "2026-08-21T20:02:00" },
    { id: 3, auctionId: 1, userId: 7, amount: 21, alias: "Hueco_88", createdAt: "2026-08-22T08:45:00" },
    { id: 4, auctionId: 1, userId: 9, amount: 34, alias: "Turbio_05", createdAt: "2026-08-22T11:30:00" },
    { id: 5, auctionId: 1, userId: 11, amount: 55, alias: "Rancio_63", createdAt: "2026-08-22T14:12:00" },
  
    // Subasta 2 (abierta, objeto 4: min 3, max 30). El 7 esta duplicado.
    { id: 6, auctionId: 2, userId: 6, amount: 5, alias: "Bufon_21", createdAt: "2026-08-22T10:00:00" },
    { id: 7, auctionId: 2, userId: 8, amount: 7, alias: "Grotesco_49", createdAt: "2026-08-22T10:40:00" },
    { id: 8, auctionId: 2, userId: 10, amount: 7, alias: "Ridiculo_33", createdAt: "2026-08-22T12:15:00" },
    { id: 9, auctionId: 2, userId: 12, amount: 15, alias: "Torpe_76", createdAt: "2026-08-22T16:50:00" },
  
    // Subasta 3 (abierta, objeto 7: min 5, max 100). Sin duplicados.
    { id: 10, auctionId: 3, userId: 1, amount: 12, alias: "Sombrio_08", createdAt: "2026-08-22T21:00:00" },
    { id: 11, auctionId: 3, userId: 7, amount: 19, alias: "Yerto_54", createdAt: "2026-08-22T22:30:00" },
    { id: 12, auctionId: 3, userId: 9, amount: 30, alias: "Gelido_91", createdAt: "2026-08-23T07:20:00" },
  
    // Subasta 4 (cerrada, objeto 3: min 10, max 80).
    // Duplicado en 12. Menor unico = 19 -> gana el usuario 9.
    { id: 13, auctionId: 4, userId: 1, amount: 12, alias: "Fugaz_11", createdAt: "2026-08-11T09:00:00" },
    { id: 14, auctionId: 4, userId: 5, amount: 12, alias: "Opaco_26", createdAt: "2026-08-11T14:20:00" },
    { id: 15, auctionId: 4, userId: 9, amount: 19, alias: "Aciago_70", createdAt: "2026-08-12T18:05:00" },
    { id: 16, auctionId: 4, userId: 7, amount: 28, alias: "Mustio_39", createdAt: "2026-08-14T11:45:00" },
    { id: 17, auctionId: 4, userId: 11, amount: 45, alias: "Lugubre_02", createdAt: "2026-08-16T20:30:00" },
  
    // Subasta 5 (cerrada, objeto 5: min 2, max 25).
    // Duplicado en 11. Menor unico = 4 -> gana el usuario 10.
    { id: 18, auctionId: 5, userId: 10, amount: 4, alias: "Chiflado_60", createdAt: "2026-08-12T16:00:00" },
    { id: 19, auctionId: 5, userId: 2, amount: 11, alias: "Payaso_14", createdAt: "2026-08-13T10:10:00" },
    { id: 20, auctionId: 5, userId: 8, amount: 11, alias: "Bobo_57", createdAt: "2026-08-13T13:35:00" },
    { id: 21, auctionId: 5, userId: 12, amount: 17, alias: "Zafio_83", createdAt: "2026-08-15T09:25:00" },
  
    // Subasta 6 (cancelada, objeto 8: min 1, max 35).
    // Todos los valores estan repetidos, no hay ninguno unico (requisito 13).
    { id: 22, auctionId: 6, userId: 1, amount: 10, alias: "Nefasto_45", createdAt: "2026-08-08T11:00:00" },
    { id: 23, auctionId: 6, userId: 4, amount: 10, alias: "Espanto_29", createdAt: "2026-08-08T15:40:00" },
    { id: 24, auctionId: 6, userId: 7, amount: 20, alias: "Fatal_67", createdAt: "2026-08-09T08:15:00" },
    { id: 25, auctionId: 6, userId: 9, amount: 20, alias: "Siniestro_93", createdAt: "2026-08-09T19:50:00" },
  ];
  
  // 10 apuestas (requisitos 16 al 19).
  // Se apuesta al alias, nunca al username real.
  // pending = payout 0. won = payout = amount * 3. lost = payout 0.

  export const SEED_BETS = [
    // Sobre subastas abiertas: todavia sin resolver.
    { id: 1, auctionId: 1, bettorId: 1, predictedAlias: "Marchito_42", amount: 25, status: "pending", payout: 0, createdAt: "2026-08-22T09:00:00" },
    { id: 2, auctionId: 1, bettorId: 7, predictedAlias: "Palido_17", amount: 10, status: "pending", payout: 0, createdAt: "2026-08-22T10:30:00" },
    { id: 3, auctionId: 2, bettorId: 2, predictedAlias: "Bufon_21", amount: 50, status: "pending", payout: 0, createdAt: "2026-08-22T13:00:00" },
    { id: 4, auctionId: 3, bettorId: 4, predictedAlias: "Sombrio_08", amount: 5, status: "pending", payout: 0, createdAt: "2026-08-23T08:00:00" },
  
    // Sobre la subasta 4, que gano "Aciago_70" (usuario 9).
    { id: 5, auctionId: 4, bettorId: 3, predictedAlias: "Aciago_70", amount: 25, status: "won", payout: 75, createdAt: "2026-08-13T10:00:00" },
    { id: 6, auctionId: 4, bettorId: 11, predictedAlias: "Fugaz_11", amount: 10, status: "lost", payout: 0, createdAt: "2026-08-14T16:20:00" },
    { id: 7, auctionId: 4, bettorId: 5, predictedAlias: "Mustio_39", amount: 50, status: "lost", payout: 0, createdAt: "2026-08-15T21:00:00" },
  
    // Sobre la subasta 5, que gano "Chiflado_60" (usuario 10).
    { id: 8, auctionId: 5, bettorId: 6, predictedAlias: "Chiflado_60", amount: 10, status: "won", payout: 30, createdAt: "2026-08-14T12:00:00" },
    { id: 9, auctionId: 5, bettorId: 12, predictedAlias: "Payaso_14", amount: 5, status: "lost", payout: 0, createdAt: "2026-08-14T18:45:00" },
  
    // Sobre la subasta 6, que se cancelo: la apuesta se devuelve.
    { id: 10, auctionId: 6, bettorId: 9, predictedAlias: "Nefasto_45", amount: 25, status: "refunded", payout: 25, createdAt: "2026-08-09T09:30:00" },
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