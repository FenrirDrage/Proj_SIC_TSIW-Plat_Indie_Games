import { v4 as uuidv4 } from "uuid";
import { GameModel } from "../models/game.model.js";

export const GameService = {
  async create(data, developerId) {
    // Validações básicas
    if (!data.title) throw new Error("Title must be provided");
    const id = uuidv4();
    const payload = {
      id,
      title: data.title,
      description: data.description || null,
      genre: data.genre || null,
      developerId,
      price: data.price ?? 0
    };
    const game = await GameModel.create(payload);
    return game;
  },

  async list(query) {
    const limit = Math.min(Number(query.limit || 50), 200);
    const offset = Number(query.offset || 0);
    return GameModel.findAll({ limit, offset });
  },

  async getById(id) {
    const g = await GameModel.findById(id);
    if (!g) throw { status: 404, message: "Game not found" };
    return g;
  },

  async update(id, data, requestingUserId, requestingUserRole) {
    // Apenas o developer que criou pode atualizar (simplificação)
    const existing = await GameModel.findById(id);
    if (!existing) throw { status: 404, message: "Game not found" };
    if (requestingUserRole !== "developer" || requestingUserId !== existing.developer_id) {
      throw { status: 403, message: "Can't update this game" };
    }
    const updated = await GameModel.update(id, data);
    return updated;
  },

  async remove(id, requestingUserId, requestingUserRole) {
    const existing = await GameModel.findById(id);
    if (!existing) throw { status: 404, message: "Game not found" };
    if (requestingUserRole !== "developer" || requestingUserId !== existing.developer_id) {
      throw { status: 403, message: "Can't remove this game" };
    }
    await GameModel.remove(id);
    return true;
  }
};
