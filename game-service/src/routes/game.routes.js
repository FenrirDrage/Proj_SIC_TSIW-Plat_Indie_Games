import express from "express";
import { GameController } from "../controllers/game.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Public
router.get("/", GameController.list);
router.get("/:id", GameController.getById);

// Protected (developer)
router.post("/", authMiddleware, async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Login required" });
  }
  return GameController.create(req, res, next);
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Login required" });
  }
  return GameController.update(req, res, next);
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Login required" });
  }
  return GameController.remove(req, res, next);
});

export default router;