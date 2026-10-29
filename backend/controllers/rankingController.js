const asyncHandler = require("../utils/asyncHandler");
const rankingService = require("../services/rankingService");

//GET /api/houses/:id/rankings
const obtenerRankings = asyncHandler(async (req, res) => {
  const rankings = await rankingService.rankingsDeCasa(req.params.id, req.usuario);
  res.status(200).json({ rankings });
});

module.exports = { obtenerRankings };
