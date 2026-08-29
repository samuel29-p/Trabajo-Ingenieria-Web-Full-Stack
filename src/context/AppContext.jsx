import { createContext, useState, useEffect } from "react";
import { SEED_DATA } from "../data/seedData.js";

export const AppContext = createContext();//Esto crea la caja vacía

const STORAGE_KEY = "phantombids_data";
const USER_KEY = "phantombids_user";//llave aparte para la sesión, separada de los datos

export function AppProvider({ children }) {//Esta función es el envoltorio. children significa "todo lo que quede encerrado adentro".
  const [data, setData] = useState(() => {//useState crea una variable especial que, cuando cambia, hace que React vuelva a dibujar la pantalla sola. Te devuelve dos cosas:
    //data: el valor actual (tu objeto con usuarios, casas, subastas)
    //setData: la única forma permitida de cambiarlo
    const guardado = localStorage.getItem(STORAGE_KEY);//Es una cajita del navegador que sobrevive a recargas y a cerrar la pestaña. Tiene una limitación: solo guarda texto.
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

  //lo mismo pero para la sesión: así al recargar la página sigue conectado
  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(currentUserId));
  }, [currentUserId]);

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
    avatarUrl: "https://i.pravatar.cc/150?u=" + (data.users.length + 1),
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
};//value es el contenido de la caja que se comparte con los hijos

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;//AppContext.Provider es el envoltorio que le dice a React: "¡Aquí está la caja con el contenido!"
}