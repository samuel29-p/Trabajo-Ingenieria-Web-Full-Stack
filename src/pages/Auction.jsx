import NavBar from "../components/NavBar.jsx";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useParams, Link } from "react-router-dom";

function Auction() {
  const { data, currentUser, placeBid, closeAuction } = useContext(AppContext);
  const { id } = useParams(); //el id que viene en la direccion, como texto

  const [amount, setAmount] = useState("");
  const [bidError, setBidError] = useState("");

  //Number(id) porque useParams devuelve texto y los ids son numeros
  const auction = data.auctions.find((a) => a.id === Number(id));

  //salida temprana: si no existe, muestro un mensaje y no sigo
  if (!auction) {
    return <p className="p-8 text-app-text">That auction does not exist.</p>;
  }

  //la subasta solo guarda el id del objeto, busco el objeto completo
  const auctionObject = data.objects.find((o) => o.id === auction.cursedObjectId);
  //y lo mismo con la casa donde se hace la subasta
  const auctionHouse = data.houses.find((h) => h.id === auction.hauntHouseId);


  //las pujas de esta subasta (requisito 14: solo se muestran si ya cerro)
  const bids = data.bids.filter((b) => b.auctionId === auction.id);

  //si el usuario conectado ya pujo, le muestro su puja en vez del formulario
  const myBid = bids.find((b) => b.userId === currentUser?.id);

  function handleBid() {
  const mensaje = placeBid(auction.id, amount);
  setBidError(mensaje || ""); //si devolvio null, limpio el error
  if (!mensaje) setAmount("");
  }

  return (
    <div className="min-h-screen bg-app-bg transition-colors duration-300">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        {/* link de vuelta a la casa, para no tener que usar el boton atras */}
        <Link to={"/house/" + auction.hauntHouseId} className="text-ember-accent">
          {auctionHouse?.name}
        </Link>

        <h1 className="text-3xl font-bold text-app-text mt-2">{auctionObject?.name}</h1>
        <p className="text-app-muted mb-4">{auctionObject?.description}</p>

        <img
          src={auctionObject?.imageUrl}
          alt={auctionObject?.name}
          className="w-64 rounded-card mb-4"
        />

        <p className="text-app-text">
          Bid between {auctionObject?.minBid} and {auctionObject?.maxBid}
        </p>
        <p className="text-app-muted">Status: {auction.status}</p>
        <p className="text-app-muted">Ends on {auction.endsAt}</p>

        {/* requisito 14: las pujas son secretas hasta que la subasta cierra */}
        {auction.status === "open" && (
        <div className="mt-6">
        <h2 className="text-2xl font-bold text-app-text mb-3">Place your bid</h2>

        {!currentUser && (
        <p className="text-app-muted">Log in to bid.</p>
        )}

        {currentUser && myBid && (
        <p className="text-app-text">
        You already bid as <span className="text-ember-accent">{myBid.alias}</span>.
        Your bid stays secret until the auction closes.
        </p>
        )}

        {currentUser && !myBid && (
        <div>
        <input
          type="number"
          placeholder={"Between " + auctionObject.minBid + " and " + auctionObject.maxBid}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-app-border rounded-button px-3 py-2 mr-2 bg-app-bg text-app-text"
        />
        <button
          onClick={handleBid}
          className="bg-ember-accent hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-button"
        >
          Bid
        </button>
        {bidError && <p className="text-blood-accent mt-2">{bidError}</p>}
        </div>
        )}

        <p className="text-app-muted mt-3">{bids.length} secret bids so far</p>
        </div>
        )}

        {/* si ya cerro, se revelan todas las pujas con sus alias */}
        {auction.status !== "open" && (
        <div className="mt-6">
        <h2 className="text-2xl font-bold text-app-text mb-3">Revealed bids</h2>
        {bids.map((bid) => (
        <div
        key={bid.id}
        className="bg-app-surface border border-app-border rounded-card p-3 mb-2 flex justify-between"
        >
        <span className="text-app-text">{bid.alias}</span>
        <span className="text-gold-accent font-bold">{bid.amount}</span>
        </div>
        ))}
        </div>
        )}

        {/* si la subasta ya cerro, muestro el resultado */}
        {auction.status === "closed" && (
          <p className="text-gold-accent mt-2">Winning bid: {auction.winningBid}</p>
        )}
        {auction.status === "cancelled" && (
          <p className="text-blood-accent mt-2">
            Cancelled: there was no unique bid.
          </p>
        )}
        {/* cerrar la subasta, solo el creador o el head haunter de la casa */}
        {auction.status === "open" && currentUser && (auction.createdBy === currentUser.id ||auctionHouse.members.find(
          (m) => m.userId === currentUser.id && m.role === "HeadHaunter")) && (<div className="mt-8 pt-6 border-t border-app-border">
      <button
        onClick={() => {
          const mensaje = closeAuction(auction.id);
          if (mensaje) setBidError(mensaje);
        }}
        className="bg-blood-accent hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-button">
        Close auction
      </button>
      <p className="text-app-muted text-sm mt-2">
        Reveals all bids, applies the curse and resolves the bets.
      </p>
      </div>
      )}
      </main>
    </div>
  );
}

export default Auction;