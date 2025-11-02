import { GameService } from "../services/game.service.js";

export const GameController = {
  async create(req, res) {
    try {
     
      const developerId = req.user?.id;
      if (!developerId) return res.status(401).json({ error: "Login required" });

      const game = await GameService.create(req.body, developerId);
      return res.status(201).json(game);
    } catch (err) {
      console.error("GameController.create:", err);
      return res.status(err.status || 400).json({ error: err.message || "Error creating game" });
    }
  },

  async list(req, res) {
    try {
      const games = await GameService.list(req.query);
      return res.json(games);
    } catch (err) {
      console.error("GameController.list:", err);
      return res.status(500).json({ error: "Error listing games" });
    }
  },

  async getById(req, res) {
    try {
      const game = await GameService.getById(req.params.id);
      return res.json(game);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message || "Error getting game" });
    }
  },

  async update(req, res) {
    try {
      const user = req.user;
      const updated = await GameService.update(req.params.id, req.body, user?.id, user?.role);
      return res.json(updated);
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message || "Error updating game" });
    }
  },

  async remove(req, res) {
    try {
      const user = req.user;
      await GameService.remove(req.params.id, user?.id, user?.role);
      return res.json({ message: "Game removed" });
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message || "Error removing game" });
    }
  }
};
