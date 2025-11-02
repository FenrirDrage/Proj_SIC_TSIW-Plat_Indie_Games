// Inicializa pool de conexão com PostgreSQL e exporta helper para queries.

import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "postgres",
  database: process.env.PG_DB || "games",
  max: 10
});

// Função utilitária para inicializar BD a partir do ficheiro init-db.sql
async function initDb() {
  try {
    const sqlPath = path.resolve(process.cwd(), "init-db.sql");
    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, "utf8");
      await pool.query(sql);
      console.log("✅ Tabela 'games' assegurada (init-db.sql executado).");
    } else {
      console.warn("⚠️ init-db.sql não encontrado — cria a tabela manualmente se necessário.");
    }
  } catch (err) {
    console.error("Erro ao inicializar BD:", err.message);
  }
}

export { pool, initDb };
