import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => res.json({ service: "api-gateway", status: "ok" }));

// Proxy routes
app.use("/", routes);

// Error handler Generico
app.use((err, req, res, next) => {
  console.error("API GATEWAY ERROR:", err?.message || err);
  res.status(err.status || 500).json({ error: err.message || "Internal gateway error" });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
