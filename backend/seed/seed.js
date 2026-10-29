//se corre una vez, o para dejar la base como al inicio, con: node seed/seed.js
//ojo, borra todo lo que haya en la base y deja solo estos datos
//son los mismos datos semilla del front, la seccion seed data del enunciado

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const HauntHouse = require("../models/HauntHouse");
const CursedObject = require("../models/CursedObject");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Bet = require("../models/Bet");
const CurseLog = require("../models/CurseLog");

const DIA = 24 * 60 * 60 * 1000;

//12 usuarios con las reputaciones del enunciado, mas un admin
//la contrasena tiene 6 caracteres porque el modelo User pide minimo 6
const SEED_USERS = [
  { id: 1, username: "vinland", email: "vinland@phantom.com", password: "123456", reputation: 120, joinDate: "2026-01-14", avatarUrl: "/images/AV1.png" },
  { id: 2, username: "newfoundland", email: "newfoundland@phantom.com", password: "123456", reputation: 100, joinDate: "2026-01-20", avatarUrl: "/images/AV2.png" },
  { id: 3, username: "illWin", email: "illWin@phantom.com", password: "123456", reputation: 95, joinDate: "2026-02-02", avatarUrl: "/images/AV3.png" },
  { id: 4, username: "cheeseburger", email: "cheeseburger@phantom.com", password: "123456", reputation: 85, joinDate: "2026-02-11", avatarUrl: "/images/AV4.png" },
  { id: 5, username: "blackberries", email: "blackberries@phantom.com", password: "123456", reputation: 80, joinDate: "2026-02-27", avatarUrl: "/images/AV5.png" },
  { id: 6, username: "strawberries", email: "strawberries@phantom.com", password: "123456", reputation: 75, joinDate: "2026-03-05", avatarUrl: "/images/AV6.png" },
  { id: 7, username: "deutschland", email: "deutschland@phantom.com", password: "123456", reputation: 70, joinDate: "2026-03-19", avatarUrl: "/images/AV7.png" },
  { id: 8, username: "photographer", email: "photographer@phantom.com", password: "123456", reputation: 65, joinDate: "2026-04-01", avatarUrl: "/images/AV8.png" },
  { id: 9, username: "thing", email: "thing@phantom.com", password: "123456", reputation: 60, joinDate: "2026-04-17", avatarUrl: "/images/AV9.png" },
  { id: 10, username: "persona", email: "persona@phantom.com", password: "123456", reputation: 55, joinDate: "2026-05-08", avatarUrl: "/images/AV10.jpg" },
  { id: 11, username: "animal", email: "animal@phantom.com", password: "123456", reputation: 50, joinDate: "2026-05-23", avatarUrl: "/images/AV11.jpg" },
  { id: 12, username: "place", email: "place@phantom.com", password: "123456", reputation: 45, joinDate: "2026-06-06", avatarUrl: "/images/AV12.jpg" },
  //el admin no esta en el front, se agrega para poder probar las vistas de administrador
  { id: 13, username: "admin", email: "admin@phantom.com", password: "admin123", reputation: 100, joinDate: "2026-01-01", avatarUrl: "/images/pfp.jpeg", role: "admin" },
];

//3 casas, con los roles de cada miembro, requisito 7
const SEED_HOUSES = [
  {
    id: 1,
    name: "The Silent Crypt",
    theme: "Darkness",
    description: "Objects that only whisper when nobody is watching.",
    coverImageUrl: "/images/house-crypt.jpeg",
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

//8 objetos malditos, cada uno con una de las maldiciones del catalogo
const SEED_OBJECTS = [
  { id: 1, hauntHouseId: 1, createdBy: 1, name: "Porcelain Doll", description: "It blinks when nobody is looking.", imageUrl: "/images/doll.jpeg", baseCurse: "LOSE_10_REPUTATION", minBid: 5, maxBid: 60, durationDays: 3 },
  { id: 2, hauntHouseId: 1, createdBy: 3, name: "Cursed Mirror", description: "It reflects whoever stood there before you.", imageUrl: "/images/mirror.jpeg", baseCurse: "CURSE_MARK_7_DAYS", minBid: 1, maxBid: 40, durationDays: 5 },
  { id: 3, hauntHouseId: 1, createdBy: 5, name: "Clock Without Hands", description: "It marks the hour of your last mistake.", imageUrl: "/images/clock.jpeg", baseCurse: "CANNOT_BID_2_AUCTIONS", minBid: 10, maxBid: 80, durationDays: 7 },
  { id: 4, hauntHouseId: 2, createdBy: 2, name: "Terrifying Clown Nose", description: "It honks by itself at 3 in the morning.", imageUrl: "/images/nose.jpeg", baseCurse: "ALIAS_REVEALED", minBid: 3, maxBid: 30, durationDays: 2 },
  { id: 5, hauntHouseId: 2, createdBy: 6, name: "The Laughing Chair", description: "It creaks with a cackle if you sit down.", imageUrl: "/images/chair.jpeg", baseCurse: "HALVE_NEXT_PAYOUT", minBid: 2, maxBid: 25, durationDays: 4 },
  { id: 6, hauntHouseId: 2, createdBy: 8, name: "Dead Manager's Tie", description: "It tightens by itself during meetings.", imageUrl: "/images/tie.jpeg", baseCurse: "CANNOT_BET_48_HOURS", minBid: 8, maxBid: 50, durationDays: 3 },
  { id: 7, hauntHouseId: 3, createdBy: 4, name: "Key to Door 13", description: "It opens a room that does not exist.", imageUrl: "/images/key.jpeg", baseCurse: "LOSE_20_REPUTATION", minBid: 5, maxBid: 100, durationDays: 6 },
  { id: 8, hauntHouseId: 3, createdBy: 1, name: "The Blank Diary", description: "It wakes up written in your handwriting.", imageUrl: "/images/diary.jpeg", baseCurse: "POLTERGEIST_24_HOURS", minBid: 1, maxBid: 35, durationDays: 2 },
];

//6 subastas, 3 abiertas, 2 cerradas con ganador y 1 cancelada
//las abiertas se calculan desde hoy para que siempre esten vigentes, diasInicio es hace cuantos dias empezo
const SEED_AUCTIONS = [
  { id: 1, cursedObjectId: 1, status: "open", diasInicio: 2, diasFin: 30 },
  { id: 2, cursedObjectId: 4, status: "open", diasInicio: 1, diasFin: 45 },
  { id: 3, cursedObjectId: 7, status: "open", diasInicio: 1, diasFin: 60 },
  { id: 4, cursedObjectId: 3, status: "closed", startsAt: "2026-08-10T12:00:00", endsAt: "2026-08-17T12:00:00", winnerId: 9, winningBid: 19 },
  { id: 5, cursedObjectId: 5, status: "closed", startsAt: "2026-08-12T15:00:00", endsAt: "2026-08-16T15:00:00", winnerId: 10, winningBid: 4 },
  { id: 6, cursedObjectId: 8, status: "cancelled", startsAt: "2026-08-08T10:00:00", endsAt: "2026-08-10T10:00:00", winnerId: null, winningBid: null },
];

//25 pujas, cada usuario puja una sola vez por subasta, requisito 10
//hay duplicados en la subasta 2 con el 7, en la 4 con el 12, en la 5 con el 11, y en la 6 todo se repite y por eso se cancelo
const SEED_BIDS = [
  { id: 1, auctionId: 1, userId: 3, amount: 8, alias: "Withered_42", createdAt: "2026-08-21T19:10:00" },
  { id: 2, auctionId: 1, userId: 5, amount: 13, alias: "Pallid_17", createdAt: "2026-08-21T20:02:00" },
  { id: 3, auctionId: 1, userId: 7, amount: 21, alias: "Hollow_88", createdAt: "2026-08-22T08:45:00" },
  { id: 4, auctionId: 1, userId: 9, amount: 34, alias: "Murky_05", createdAt: "2026-08-22T11:30:00" },
  { id: 5, auctionId: 1, userId: 11, amount: 55, alias: "Rancid_63", createdAt: "2026-08-22T14:12:00" },
  { id: 6, auctionId: 2, userId: 6, amount: 5, alias: "Jester_21", createdAt: "2026-08-22T10:00:00" },
  { id: 7, auctionId: 2, userId: 8, amount: 7, alias: "Grotesque_49", createdAt: "2026-08-22T10:40:00" },
  { id: 8, auctionId: 2, userId: 10, amount: 7, alias: "Absurd_33", createdAt: "2026-08-22T12:15:00" },
  { id: 9, auctionId: 2, userId: 12, amount: 15, alias: "Clumsy_76", createdAt: "2026-08-22T16:50:00" },
  { id: 10, auctionId: 3, userId: 1, amount: 12, alias: "Somber_08", createdAt: "2026-08-22T21:00:00" },
  { id: 11, auctionId: 3, userId: 7, amount: 19, alias: "Stiff_54", createdAt: "2026-08-22T22:30:00" },
  { id: 12, auctionId: 3, userId: 9, amount: 30, alias: "Gelid_91", createdAt: "2026-08-23T07:20:00" },
  { id: 13, auctionId: 4, userId: 1, amount: 12, alias: "Fleeting_11", createdAt: "2026-08-11T09:00:00" },
  { id: 14, auctionId: 4, userId: 5, amount: 12, alias: "Opaque_26", createdAt: "2026-08-11T14:20:00" },
  { id: 15, auctionId: 4, userId: 9, amount: 19, alias: "Dismal_70", createdAt: "2026-08-12T18:05:00" },
  { id: 16, auctionId: 4, userId: 7, amount: 28, alias: "Wilted_39", createdAt: "2026-08-14T11:45:00" },
  { id: 17, auctionId: 4, userId: 11, amount: 45, alias: "Gloomy_02", createdAt: "2026-08-16T20:30:00" },
  { id: 18, auctionId: 5, userId: 10, amount: 4, alias: "Giddy_60", createdAt: "2026-08-12T16:00:00" },
  { id: 19, auctionId: 5, userId: 2, amount: 11, alias: "Clownish_14", createdAt: "2026-08-13T10:10:00" },
  { id: 20, auctionId: 5, userId: 8, amount: 11, alias: "Foolish_57", createdAt: "2026-08-13T13:35:00" },
  { id: 21, auctionId: 5, userId: 12, amount: 17, alias: "Crude_83", createdAt: "2026-08-15T09:25:00" },
  { id: 22, auctionId: 6, userId: 1, amount: 10, alias: "Wicked_45", createdAt: "2026-08-08T11:00:00" },
  { id: 23, auctionId: 6, userId: 4, amount: 10, alias: "Dreadful_29", createdAt: "2026-08-08T15:40:00" },
  { id: 24, auctionId: 6, userId: 7, amount: 20, alias: "Fatal_67", createdAt: "2026-08-09T08:15:00" },
  { id: 25, auctionId: 6, userId: 9, amount: 20, alias: "Sinister_93", createdAt: "2026-08-09T19:50:00" },
];

//10 apuestas sobre alias, nunca sobre usuarios, requisitos 16 al 19
const SEED_BETS = [
  { id: 1, auctionId: 1, bettorId: 1, predictedAlias: "Withered_42", amount: 25, status: "pending", payout: 0, createdAt: "2026-08-22T09:00:00" },
  { id: 2, auctionId: 1, bettorId: 7, predictedAlias: "Pallid_17", amount: 10, status: "pending", payout: 0, createdAt: "2026-08-22T10:30:00" },
  { id: 3, auctionId: 2, bettorId: 2, predictedAlias: "Jester_21", amount: 50, status: "pending", payout: 0, createdAt: "2026-08-22T13:00:00" },
  { id: 4, auctionId: 3, bettorId: 4, predictedAlias: "Somber_08", amount: 5, status: "pending", payout: 0, createdAt: "2026-08-23T08:00:00" },
  { id: 5, auctionId: 4, bettorId: 3, predictedAlias: "Dismal_70", amount: 25, status: "won", payout: 75, createdAt: "2026-08-13T10:00:00" },
  { id: 6, auctionId: 4, bettorId: 11, predictedAlias: "Fleeting_11", amount: 10, status: "lost", payout: 0, createdAt: "2026-08-14T16:20:00" },
  { id: 7, auctionId: 4, bettorId: 5, predictedAlias: "Wilted_39", amount: 50, status: "lost", payout: 0, createdAt: "2026-08-15T21:00:00" },
  { id: 8, auctionId: 5, bettorId: 6, predictedAlias: "Giddy_60", amount: 10, status: "won", payout: 30, createdAt: "2026-08-14T12:00:00" },
  { id: 9, auctionId: 5, bettorId: 12, predictedAlias: "Clownish_14", amount: 5, status: "lost", payout: 0, createdAt: "2026-08-14T18:45:00" },
  { id: 10, auctionId: 6, bettorId: 9, predictedAlias: "Wicked_45", amount: 25, status: "refunded", payout: 25, createdAt: "2026-08-09T09:30:00" },
];

//3 maldiciones ya aplicadas, expiresAt en null es un efecto permanente, requisitos 20 al 22
const SEED_CURSE_LOG = [
  { id: 1, userId: 9, auctionId: 4, curse: "CANNOT_BID_2_AUCTIONS", appliedAt: "2026-08-17T12:00:00", expiresAt: "2026-08-24T12:00:00" },
  { id: 2, userId: 10, auctionId: 5, curse: "HALVE_NEXT_PAYOUT", appliedAt: "2026-08-16T15:00:00", expiresAt: "2026-08-21T15:00:00" },
  { id: 3, userId: 1, auctionId: 4, curse: "LOSE_10_REPUTATION", appliedAt: "2026-08-17T12:00:00", expiresAt: null },
];

async function sembrar() {
  await connectDB();

  console.log("Borrando datos anteriores...");
  await User.deleteMany({});
  await HauntHouse.deleteMany({});
  await CursedObject.deleteMany({});
  await Auction.deleteMany({});
  await Bid.deleteMany({});
  await Bet.deleteMany({});
  await CurseLog.deleteMany({});

  //cada mapa conecta el id del front, 1, 2, 3..., con el _id real que le pone mongo
  console.log("Creando usuarios...");
  const usersMap = {};
  for (const datos of SEED_USERS) {
    //User.create dispara el hook pre save que hashea la contrasena
    const usuario = await User.create({
      username: datos.username,
      email: datos.email,
      password: datos.password,
      reputation: datos.reputation,
      joinDate: datos.joinDate,
      avatarUrl: datos.avatarUrl,
      role: datos.role || "user",
    });
    usersMap[datos.id] = usuario._id;
  }

  console.log("Creando casas...");
  const housesMap = {};
  for (const datos of SEED_HOUSES) {
    const casa = await HauntHouse.create({
      name: datos.name,
      theme: datos.theme,
      description: datos.description,
      coverImageUrl: datos.coverImageUrl,
      isPrivate: datos.isPrivate,
      inviteCode: datos.inviteCode,
      createdAt: datos.createdAt,
      members: datos.members.map((m) => ({
        userId: usersMap[m.userId],
        role: m.role,
        joinedAt: m.joinedAt,
      })),
    });
    housesMap[datos.id] = casa._id;
  }

  console.log("Creando objetos...");
  const objectsMap = {};
  for (const datos of SEED_OBJECTS) {
    const objeto = await CursedObject.create({
      hauntHouseId: housesMap[datos.hauntHouseId],
      createdBy: usersMap[datos.createdBy],
      name: datos.name,
      description: datos.description,
      imageUrl: datos.imageUrl,
      baseCurse: datos.baseCurse,
      minBid: datos.minBid,
      maxBid: datos.maxBid,
      durationDays: datos.durationDays,
    });
    objectsMap[datos.id] = objeto._id;
  }

  console.log("Creando subastas...");
  const auctionsMap = {};
  for (const datos of SEED_AUCTIONS) {
    const objeto = SEED_OBJECTS.find((o) => o.id === datos.cursedObjectId);
    //las abiertas se arman desde hoy, las que ya terminaron llevan sus fechas fijas
    let inicio = datos.startsAt;
    let fin = datos.endsAt;
    if (datos.status === "open") {
      inicio = new Date(Date.now() - datos.diasInicio * DIA);
      fin = new Date(Date.now() + datos.diasFin * DIA);
    }
    const subasta = await Auction.create({
      hauntHouseId: housesMap[objeto.hauntHouseId],
      cursedObjectId: objectsMap[objeto.id],
      createdBy: usersMap[objeto.createdBy],
      startsAt: inicio,
      endsAt: fin,
      status: datos.status,
      winnerId: datos.winnerId ? usersMap[datos.winnerId] : null,
      winningBid: datos.winningBid,
    });
    auctionsMap[datos.id] = subasta._id;
  }

  console.log("Creando pujas...");
  for (const datos of SEED_BIDS) {
    await Bid.create({
      auctionId: auctionsMap[datos.auctionId],
      userId: usersMap[datos.userId],
      amount: datos.amount,
      alias: datos.alias,
      createdAt: datos.createdAt,
    });
  }

  console.log("Creando apuestas...");
  for (const datos of SEED_BETS) {
    await Bet.create({
      auctionId: auctionsMap[datos.auctionId],
      bettorId: usersMap[datos.bettorId],
      predictedAlias: datos.predictedAlias,
      amount: datos.amount,
      status: datos.status,
      payout: datos.payout,
      createdAt: datos.createdAt,
    });
  }

  console.log("Creando registro de maldiciones...");
  for (const datos of SEED_CURSE_LOG) {
    await CurseLog.create({
      userId: usersMap[datos.userId],
      auctionId: auctionsMap[datos.auctionId],
      curse: datos.curse,
      appliedAt: datos.appliedAt,
      expiresAt: datos.expiresAt,
    });
  }

  console.log(
    "Listo: " + SEED_USERS.length + " usuarios, " + SEED_HOUSES.length + " casas, " +
      SEED_OBJECTS.length + " objetos, " + SEED_AUCTIONS.length + " subastas, " +
      SEED_BIDS.length + " pujas, " + SEED_BETS.length + " apuestas y " +
      SEED_CURSE_LOG.length + " maldiciones."
  );

  await mongoose.connection.close();
  console.log("Conexion cerrada.");
}

sembrar().catch((error) => {
  console.error("Error sembrando datos:", error);
  process.exit(1);
});
