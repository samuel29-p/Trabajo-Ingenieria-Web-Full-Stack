import { createContext, useState, useEffect } from "react";
import { SEED_DATA } from "../data/seedData.js";
import { CURSES } from "../data/Curses.js";

export const AppContext = createContext();//Esto crea la caja vacía

const STORAGE_KEY = "phantombids_data";
const USER_KEY = "phantombids_user";//llave aparte para la sesión, separada de los datos

export function AppProvider({ children }) {//Esta función es el envoltorio. children significa "todo lo que quede encerrado adentro".
  const [data, setData] = useState(() => {//useState crea una variable especial que, cuando cambia, hace que React vuelva a dibujar la pantalla sola. Te devuelve dos cosas:
    //data: el valor actual (tu objeto con usuarios, casas, subastas)
    //setData: la única forma permitida de cambiarlo
    const guardado = localStorage.getItem(STORAGE_KEY);//Es una cajita del navegador que sobrevive a recargas y a cerrar la pestaña. Solo guarda texto.
    if (guardado) {
      return JSON.parse(guardado);//convierte el texto de vuelta en objeto
    }
    return SEED_DATA;//si no hay nada guardado, usa los datos de ejemplo
  });

  //el id del usuario que tiene la sesión abierta. null = nadie conectado
  //se guarda solo el id, no el usuario completo: misma regla de conectar por id
  const [currentUserId, setCurrentUserId] = useState(() => {
    const guardado = localStorage.getItem(USER_KEY);
    return guardado ? JSON.parse(guardado) : null;//ternario: si hay algo lo convierte, si no devuelve null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));//convierte el objeto en texto
  }, [data]);

  //lo mismo pero para la sesión, así al recargar la página sigue conectado
  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(currentUserId));
  }, [currentUserId]);

  //cruza el id de la sesión con el arreglo de usuarios y devuelve el usuario completo
  const currentUser = data.users.find((u) => u.id === currentUserId) || null;

  //busca en el arreglo de usuarios uno con ese email y contraseña
  //.find() recorre y devuelve el PRIMERO que cumpla, o undefined si ninguno cumple
  function login(email, password) {
    const encontrado = data.users.find(
      (u) => u.email === email && u.password === password//=== compara valor y tipo. En JS siempre tres iguales
    );
    if (encontrado) {
      setCurrentUserId(encontrado.id);
      return true;//la pantalla de login usa esto para saber si mostrar error
    }
    return false;
  }

  //cerrar sesión es simplemente olvidar el id
  function logout() {
    setCurrentUserId(null);
  }
  function register(username, email, password) {
  const alreadyExists = data.users.find((u) => u.email === email);
  if (alreadyExists) {
  return false;
  }
  const newUser = {
    id: data.users.length + 1,
    username: username,
    email: email,
    password: password,
    reputation: 100,
    joinDate: new Date().toISOString(),
    avatarUrl: "/images/pfp.jpeg",
  };
  setData({ ...data, users: [...data.users, newUser] });
  return true;
 }

 function joinHouse(casaId, password){
  const searchHouse = data.houses.find((h) => h.id === casaId);
  if (!searchHouse) {
    return false;
    }

  const alreadyMember = searchHouse.members.find((m) => m.userId === currentUserId);
  if (alreadyMember) return false;

  if(searchHouse.isPrivate === true && password !== searchHouse.inviteCode){
    return false;
  }

  const newMembers = data.houses.map((h) => {
    if (h.id !== casaId) return h;   //las otras dos salen intactas
    return {
      ...h,                            //copio todo lo de esta casa
      members: [...h.members, { userId: currentUserId, role: "Spirit", joinedAt: new Date().toISOString() }],
    };
  });
  setData({ ...data, houses: newMembers });
  return true;
 }

 function auctionWinner(auctionId) {
  const neededBids = data.bids.filter((b) => b.auctionId === auctionId);
  const conteo = {};
  for (const bid of neededBids) {
    conteo[bid.amount] = (conteo[bid.amount] || 0) + 1;
  }
  const bidsKeys = Object.keys(conteo).filter((c) => conteo[c] === 1).map((c) => Number(c))
  if (bidsKeys.length === 0) return null;
  else return Math.min(...bidsKeys);
 }

 function getAlias(userId, auctionId) {
  const adjectives = ["Red", "Purple", "Blue", "Orange", "White", "Black", "Gray", "Yellow", "Pink", "Brown", "Turquoise",
    "Gold", "Silver", "Violet", "Green", "Beige", "Lilac", "Magenta", "Burgundy", "Mustard"];

  const position = ((userId * 11) + auctionId) % adjectives.length;
  const identifier = ((userId * 7) + auctionId) % 100;
  
  return adjectives[position] + "_" + String(identifier).padStart(2, "0");//padStart dice "asegúrate de que tenga 2 caracteres, y si le falta, rellena por la izquierda con ceros"
  //String convierte identifier a texto
  }

 //requisitos 10, 11 y 14: registrar una puja
 function placeBid(auctionId, amount) {
  //nadie puede pujar sin sesion iniciada
  if (!currentUserId) return "Log in to bid";

  const auction = data.auctions.find((a) => a.id === auctionId);
  if (!auction) return "Auction not found";

  //solo se puede pujar en subastas abiertas
  if (auction.status !== "open") return "This auction is closed";

  //hay que ser miembro de la casa donde esta la subasta
  const house = data.houses.find((h) => h.id === auction.hauntHouseId);
  const isMember = house.members.find((m) => m.userId === currentUserId);
  if (!isMember) return "You must join the house first";

  //requisito 10: un usuario puja UNA sola vez por subasta
  const alreadyBid = data.bids.find(
    (b) => b.auctionId === auctionId && b.userId === currentUserId
  );
  if (alreadyBid) return "You already placed a bid in this auction";

  //requisito 11: entero dentro del rango del objeto
  const object = data.objects.find((o) => o.id === auction.cursedObjectId);
  const monto = Number(amount); //lo que viene del input es texto
  if (!Number.isInteger(monto)) return "The bid must be a whole number";
  if (monto < object.minBid || monto > object.maxBid) {
    return "The bid must be between " + object.minBid + " and " + object.maxBid;
  }

  //armo la puja nueva. El alias sale de la funcion determinista
  const newBid = {
    id: data.bids.length + 1,
    auctionId: auctionId,
    userId: currentUserId,
    amount: monto,
    alias: getAlias(currentUserId, auctionId),
    createdAt: new Date().toISOString(),
  };

  setData({ ...data, bids: [...data.bids, newBid] });
  return null; //null = todo salio bien, sin mensaje de error
 }

 //requisito 4: crear una casa de subastas
//quien la crea queda automaticamente como HeadHaunter
function createHouse(name, theme, description, coverImageUrl, isPrivate, inviteCode) {
  if (!currentUserId) return "Log in to create a house";
  if (!name) return "The house needs a name";
  if (isPrivate && !inviteCode) return "A private house needs an invite code";

  const newHouse = {
    id: data.houses.length + 1,
    name: name,
    theme: theme,
    description: description,
    coverImageUrl: coverImageUrl || "/images/house-crypt.jpeg", //si no pone imagen, una por defecto
    isPrivate: isPrivate,
    inviteCode: isPrivate ? inviteCode : null, //solo las privadas guardan codigo
    createdAt: new Date().toISOString(),
    members: [
      { userId: currentUserId, role: "HeadHaunter", joinedAt: new Date().toISOString() },
    ],
  };

  setData({ ...data, houses: [...data.houses, newHouse] });
  return null;
}

//requisito 8: crear un objeto maldito dentro de una casa
function createObject(hauntHouseId, name, description, imageUrl, baseCurse, minBid, maxBid, durationDays) {
  if (!currentUserId) return "Log in to create an object";

  //solo los miembros de la casa pueden crear objetos ahi
  const house = data.houses.find((h) => h.id === hauntHouseId);
  if (!house) return "House not found";
  const isMember = house.members.find((m) => m.userId === currentUserId);
  if (!isMember) return "You must be a member of this house";

  //convierto porque los inputs devuelven texto
  const min = Number(minBid);
  const max = Number(maxBid);
  const dias = Number(durationDays);

  //las reglas exactas del requisito 8
  if (!name) return "The object needs a name";
  if (min < 1 || min > 100) return "Min bid must be between 1 and 100";
  if (max < min + 10 || max > 500) return "Max bid must be between min+10 and 500";
  if (dias < 1 || dias > 7) return "Duration must be between 1 and 7 days";

  const newObject = {
    id: data.objects.length + 1,
    hauntHouseId: hauntHouseId,
    createdBy: currentUserId,
    name: name,
    description: description,
    imageUrl: imageUrl || "/images/doll.jpeg",
    baseCurse: baseCurse,
    minBid: min,
    maxBid: max,
    durationDays: dias,
  };

  setData({ ...data, objects: [...data.objects, newObject] });
  return null;
}

//crear una subasta a partir de un objeto que ya existe
//la fecha de cierre se calcula sumandole los dias de duracion del objeto
function createAuction(cursedObjectId) {
  if (!currentUserId) return "Log in to create an auction";

  const object = data.objects.find((o) => o.id === cursedObjectId);
  if (!object) return "Object not found";

  //un objeto no puede estar en dos subastas abiertas a la vez
  const yaSubastado = data.auctions.find(
    (a) => a.cursedObjectId === cursedObjectId && a.status === "open"
  );
  if (yaSubastado) return "This object is already being auctioned";

  const ahora = new Date();
  //getTime da los milisegundos desde 1970. Sumo los dias convertidos a milisegundos
  const cierre = new Date(ahora.getTime() + object.durationDays * 24 * 60 * 60 * 1000);

  const newAuction = {
    id: data.auctions.length + 1,
    hauntHouseId: object.hauntHouseId,
    cursedObjectId: cursedObjectId,
    createdBy: currentUserId,
    startsAt: ahora.toISOString(),
    endsAt: cierre.toISOString(),
    status: "open",
    winnerId: null,
    winningBid: null,
  };

  setData({ ...data, auctions: [...data.auctions, newAuction] });
  return null;
 }

 function getDuplicateBidders(auctionId){
  const neededBids = data.bids.filter((b) => b.auctionId === auctionId);
  const conteo = {};
  for (const bid of neededBids) {
    conteo[bid.amount] = (conteo[bid.amount] || 0) + 1;
  }
  const duplicatedBidders = Object.keys(conteo).filter((c) => conteo[c] > 1).map((c) => Number(c))
  const punished = neededBids.filter((p) => duplicatedBidders.includes(p.amount)).map((p) => p.userId)
  if (duplicatedBidders.length === 0) return [];
  else return punished;
 }

 function closeAuction(auctionId) {
  const auction = data.auctions.find((a) => a.id === auctionId);
  if (!auction) return "Auction not found";
  if (auction.status !== "open") return "This auction is already closed";

  //el monto ganador, o null si no hubo ninguna puja unica
  const winningBid = auctionWinner(auctionId);

  //la puja que gano, para saber quien es el usuario, undefined si no hubo ganador
  const winningBidObject = data.bids.find((b) => b.auctionId === auctionId && b.amount === winningBid);
  const winnerId = winningBidObject ? winningBidObject.userId : null;

  //los que empataron y van a ser castigados
  const punished = getDuplicateBidders(auctionId);

  //el objeto que se subasta y la definicion de su maldicion, para saber cuanta reputacion quita
  const object = data.objects.find((o) => o.id === auction.cursedObjectId);
  const curse = CURSES[object.baseCurse];
  const ahora = new Date().toISOString();

  //la subasta cambia de estado y guarda el resultado, las demas salen intactas
  const newAuctions = data.auctions.map((a) => {
    if (a.id !== auctionId) return a;
    return {
      ...a,
      status: winnerId ? "closed" : "cancelled", //sin ganador se cancela
      winnerId: winnerId,
      winningBid: winningBid,
    };
  });

  //los usuarios, al ganador le cae la maldicion y a los que empataron menos 5
  const newUsers = data.users.map((u) => {
    let reputation = u.reputation; //let porque el valor se reasigna, con const no se puede

    if (u.id === winnerId) {
      reputation = reputation + curse.reputationChange;
    }
    if (punished.includes(u.id)) {
      reputation = reputation - 5;
    }

    //si no cambio nada, devuelvo el usuario tal cual
    if (reputation === u.reputation) return u;
    return { ...u, reputation: reputation };
  });

  //el registro de maldiciones, solo si hubo ganador
  let newCurseLog = data.curseLog;
  if (winnerId) {
    //si la maldicion dura horas calculo cuando expira, si no queda en null y es permanente
    const expiresAt = curse.durationHours
      ? new Date(Date.now() + curse.durationHours * 60 * 60 * 1000).toISOString()
      : null;

    const entry = {
      id: data.curseLog.length + 1,
      userId: winnerId,
      auctionId: auctionId,
      curse: curse.code,
      appliedAt: ahora,
      expiresAt: expiresAt,
    };
    newCurseLog = [...data.curseLog, entry];
  }

  //el alias del ganador, porque las apuestas van sobre alias y no sobre usuarios
  const winnerAlias = winningBidObject ? winningBidObject.alias : null;

  const newBets = data.bets.map((b) => {
    if (b.auctionId !== auctionId) return b; //las de otras subastas, intactas
    if (b.status !== "pending") return b; //las ya resueltas, intactas

    //si la subasta se cancelo se devuelve la apuesta
    if (!winnerId) {
      return { ...b, status: "refunded", payout: b.amount };
    }
    //si acerto gana tres veces lo apostado
    if (b.predictedAlias === winnerAlias) {
      return { ...b, status: "won", payout: b.amount * 3 };
    }
    return { ...b, status: "lost", payout: 0 };
  });

  //un solo setData con los cuatro arreglos, si fueran cuatro seguidos
  //los ultimos leerian el data viejo y se pisarian entre si
  setData({
    ...data,
    auctions: newAuctions,
    users: newUsers,
    curseLog: newCurseLog,
    bets: newBets,
  });
  return null;
 }

//requisitos 16 al 19, apostar reputacion sobre quien va a ganar
function placeBet(auctionId, predictedAlias, amount) {
  if (!currentUserId) return "Log in to bet";

  const auction = data.auctions.find((a) => a.id === auctionId);
  if (!auction) return "Auction not found";
  if (auction.status !== "open") return "This auction is closed";

  //hay que ser miembro de la casa
  const house = data.houses.find((h) => h.id === auction.hauntHouseId);
  const isMember = house.members.find((m) => m.userId === currentUserId);
  if (!isMember) return "You must join the house first";

  //las apuestas cierran una hora antes de que termine la subasta
  const cierre = new Date(auction.endsAt).getTime() - 60 * 60 * 1000;
  if (Date.now() > cierre) return "Betting closed one hour before the auction ends";

  //solo se puede apostar 5, 10, 25 o 50
  const monto = Number(amount);
  if (![5, 10, 25, 50].includes(monto)) return "Bet must be 5, 10, 25 or 50";

  //no puedes apostar mas reputacion de la que tienes
  if (currentUser.reputation < monto) return "Not enough reputation";

  //una apuesta por subasta
  const yaAposto = data.bets.find(
    (b) => b.auctionId === auctionId && b.bettorId === currentUserId
  );
  if (yaAposto) return "You already bet in this auction";

  if (!predictedAlias) return "Pick an alias to bet on";

  const newBet = {
    id: data.bets.length + 1,
    auctionId: auctionId,
    bettorId: currentUserId,
    predictedAlias: predictedAlias,
    amount: monto,
    status: "pending",
    payout: 0,
    createdAt: new Date().toISOString(),
  };

  //la reputacion se descuenta al apostar, si gana se le devuelve el triple al cerrar
  const newUsers = data.users.map((u) => {
    if (u.id !== currentUserId) return u;
    return { ...u, reputation: u.reputation - monto };
  });

  setData({ ...data, bets: [...data.bets, newBet], users: newUsers });
  return null;
}

 const value = {
  data,
  setData,
  currentUserId,
  currentUser,
  isAuthenticated: currentUserId !== null,
  loading,
  login,
  logout,
  register,
  auctionWinner,
  getAlias,
  joinHouse,
  placeBid,
  createHouse,
  createObject,
  createAuction,
  getDuplicateBidders,
  closeAuction,
  placeBet,
};//value es el contenido de la caja que se comparte con los hijos

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;//AppContext.Provider es el envoltorio que le dice a React: "¡Aquí está la caja con el contenido!"
}