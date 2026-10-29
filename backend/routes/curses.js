const express = require("express");
const { CURSE_LIST } = require("../utils/curses");
const autenticar = require("../middlewares/autenticar");
const curseLogController = require("../controllers/curseLogController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Curses
 *   description: Catalogo publico de maldiciones
 */

/**
 * @swagger
 * /api/curses:
 *   get:
 *     summary: Devuelve el catalogo de las 8 maldiciones (ruta publica)
 *     tags: [Curses]
 *     security: []
 *     responses:
 *       "200": { description: Lista de las 8 maldiciones }
 */
//es publico y no pasa por servicio porque es una lista fija que no vive en la base de datos
router.get("/", (req, res) => {
  res.status(200).json({ maldiciones: CURSE_LIST });
});

/**
 * @swagger
 * /api/curses/me:
 *   get:
 *     summary: El registro de maldiciones del usuario con sesion, con su nombre, descripcion y si sigue activa
 *     tags: [Curses]
 *     responses:
 *       "200": { description: Lista de maldiciones del usuario }
 *       "401": { description: Falta el token o no es valido }
 */
router.get("/me", autenticar, curseLogController.misMaldiciones);

module.exports = router;
