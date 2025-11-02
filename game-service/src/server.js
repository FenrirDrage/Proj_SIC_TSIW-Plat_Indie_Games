import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import gameRoutes from "./routes/game.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger/swagger.js";
import { initDb } from "./db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ service: "game-service", status: "ok" }));

// Inicializar BD 
initDb();

// Rotas
app.use("/", gameRoutes);

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Error handler
app.use((err, req, res, next) => {
  console.error("Internal server error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
