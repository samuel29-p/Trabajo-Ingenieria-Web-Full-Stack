const asyncHandler = require("../utils/asyncHandler");
const bidService = require("../services/bidService");

//POST /api/auctions/:id/bids
const pujar = asyncHandler(async (req, res) => {
  const puja = await bidService.pujar(req.params.id, req.body.amount, req.usuario);
  res.status(201).json({ puja });
});

//GET /api/auctions/:id/bids
const listar = asyncHandler(async (req, res) => {
  const pujas = await bidService.listar(req.params.id);
  res.status(200).json({ pujas });
});

//GET /api/auctions/:id/bids/me
const miPuja = asyncHandler(async (req, res) => {
  const puja = await bidService.miPuja(req.params.id, req.usuario);
  res.status(200).json({ puja });
});

module.exports = { pujar, listar, miPuja };
