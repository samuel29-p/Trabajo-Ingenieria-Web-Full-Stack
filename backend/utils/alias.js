//adjetivos para armar los alias anonimos, cada usuario recibe uno distinto en cada subasta, requisito 3
const ADJECTIVES = [
  "Withered", "Pallid", "Hollow", "Murky", "Rancid", "Somber", "Gelid", "Dismal", "Gloomy", "Wicked",
  "Dreadful", "Sinister", "Fleeting", "Opaque", "Wilted", "Grotesque", "Clumsy", "Absurd", "Giddy", "Crude",
];

//arma el alias con la forma Adjetivo_Numero sumando los codigos de las letras de los dos ids
//como la cuenta siempre da lo mismo, el mismo usuario en la misma subasta siempre tiene el mismo alias
//pero en otra subasta le sale otro, asi nadie lo puede seguir de una subasta a la otra
//intento sirve para sacar otro alias si el primero ya lo tiene alguien en esa subasta
function getAlias(auctionId, userId, intento) {
  const texto = auctionId.toString() + userId.toString();
  let suma = 0;
  for (let i = 0; i < texto.length; i++) {
    suma = suma + texto.charCodeAt(i) * (i + 1);
  }
  suma = suma + (intento || 0);
  const adjetivo = ADJECTIVES[suma % ADJECTIVES.length];
  const numero = Math.floor(suma / ADJECTIVES.length) % 100;
  //padStart deja el numero siempre con dos cifras, por ejemplo 7 queda 07
  return adjetivo + "_" + String(numero).padStart(2, "0");
}

module.exports = { getAlias };
