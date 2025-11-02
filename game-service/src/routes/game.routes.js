import express from "express";
import { GameController } from "../controllers/game.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

/** Descrição das rotas de jogos.
 * Rotas:
 * - GET /games          => lista jogos (público)
 * - GET /games/:id      => detalhe jogo (público)
 * - POST /games         => criar jogo (requer auth - developer)
 * - PUT /games/:id      => atualizar jogo (requer auth - developer)
 * - DELETE /games/:id   => apagar jogo (requer auth - developer)
 */

// Public
router.get("/games", GameController.list);
router.get("/games/:id", GameController.getById);

router.post("/games", authMiddleware, async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Login required" });
  return GameController.create(req, res, next);
});
router.put("/games/:id", authMiddleware, async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Login required" });
  return GameController.update(req, res, next);
});
router.delete("/games/:id", authMiddleware, async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Login required" });
  return GameController.remove(req, res, next);
});

export default router;
