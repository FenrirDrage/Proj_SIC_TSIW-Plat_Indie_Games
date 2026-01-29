import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger/swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI;

console.log("🔐 AUTH MONGO_URI =", MONGO_URI);

if (!MONGO_URI) {
  console.error("❌ MONGO_URI não definido");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) =>
  res.json({ service: "auth-service", status: "ok" })
);

app.use("/", authRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((err, req, res, next) => {
  console.error("Internal server error:", err.message);
  res.status(500).json({ error: "Server error" });
});

// ⛔ NUNCA arrancar o servidor antes da BD
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB ligado (Auth Service)");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🔐 Auth Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao ligar ao MongoDB:", err.message);
    process.exit(1);
  });
