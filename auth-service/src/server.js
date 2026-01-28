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

app.use(cors());
app.use(express.json());
//app.use(express.raw({ type: '*/*' }));

// Ligação à base de dados MongoDB
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/auth-service")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

app.get("/health", (req, res) => res.json({ service: "auth-service", status: "ok" }));

//app.use("/auth", authRoutes);
app.use("/", authRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((err, req, res, next) => {
  console.error("Internal server error:", err.message);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
