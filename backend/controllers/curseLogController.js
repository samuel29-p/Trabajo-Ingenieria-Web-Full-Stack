const asyncHandler = require("../utils/asyncHandler");
const curseLogService = require("../services/curseLogService");

//GET /api/curses/me
const misMaldiciones = asyncHandler(async (req, res) => {
  const maldiciones = await curseLogService.misMaldiciones(req.usuario._id);
  res.status(200).json({ maldiciones });
});

module.exports = { misMaldiciones };
