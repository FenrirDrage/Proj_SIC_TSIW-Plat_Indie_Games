import express from "express";
import { authController } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * Rotas principais do Auth Service
 */
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify", authController.verify);

router.get("/profile", authController.profile);
router.put("/profile", authController.update);
router.delete("/profile", authController.remove);

export default router;
