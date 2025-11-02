import { pool } from "../db.js";

// Funções que operam diretamente sobre a tabela 'games'

export const GameModel = {
  async create(game) {
    const { id, title, description, genre, developerId, price } = game;
    const q = `
      INSERT INTO games (id, title, description, genre, developer_id, price)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `;
    const values = [id, title, description || null, genre || null, developerId, price || 0];
    const { rows } = await pool.query(q, values);
    return rows[0];
  },

  async findAll({ limit = 50, offset = 0 } = {}) {
    const q = `SELECT * FROM games ORDER BY created_at DESC LIMIT $1 OFFSET $2;`;
    const { rows } = await pool.query(q, [limit, offset]);
    return rows;
  },

  async findById(id) {
    const q = `SELECT * FROM games WHERE id = $1;`;
    const { rows } = await pool.query(q, [id]);
    return rows[0] || null;
  },

  async update(id, data) {
    // Atualização parcial (aplica apenas campos fornecidos)
    const cols = [];
    const vals = [];
    let idx = 1;
    for (const key of ["title", "description", "genre", "price", "downloads"]) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        cols.push(`${key === "downloads" ? "downloads" : key} = $${idx}`);
        vals.push(data[key]);
        idx++;
      }
    }
    if (cols.length === 0) {
      const existing = await this.findById(id);
      return existing;
    }
    vals.push(id);
    const q = `UPDATE games SET ${cols.join(", ")}, updated_at = NOW() WHERE id = $${idx} RETURNING *;`;
    const { rows } = await pool.query(q, vals);
    return rows[0];
  },

  async remove(id) {
    const q = `DELETE FROM games WHERE id = $1;`;
    await pool.query(q, [id]);
    return true;
  }
};
