import NavBar from "../components/NavBar.jsx";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useParams, Link } from "react-router-dom";

function Auction() {
  const { data, currentUser, placeBid } = useContext(AppContext);
  const { id } = useParams(); //el id que viene en la direccion, como texto

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

        {/* si la subasta ya cerro, muestro el resultado */}
        {auction.status === "closed" && (
          <p className="text-gold-accent mt-2">Winning bid: {auction.winningBid}</p>
        )}
        {auction.status === "cancelled" && (
          <p className="text-blood-accent mt-2">
            Cancelled: there was no unique bid.
          </p>
        )}
      </main>
    </div>
  );
}

export default Auction;