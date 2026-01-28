import express from "express";
import axios from "axios";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

const AUTH_URL = process.env.AUTH_URL || "http://auth-service:4001";
const GAME_URL = process.env.GAME_URL || "http://game-service:4002";
const REVIEW_URL = process.env.REVIEW_URL || "http://review-service:4003";
const ANALYTICS_URL = process.env.ANALYTICS_URL || "http://analytics-service:4004";

/*=============================
 * Proxy genérico (REMOVE prefixo)
 * Usado por auth, games, analytics
 * =============================*/
async function proxyRequest(req, res, targetBase) {
  const path = req.originalUrl.replace(/^\/[^/]+/, "") || "/";
  const targetUrl = `${targetBase}${path}`;

  try {
    const resp = await axios({
      url: targetUrl,
      method: req.method,
      headers: {
        Authorization: req.headers.authorization,
        "Content-Type": "application/json"
      },
      params: req.query,
      data: req.body,
      timeout: 15000
    });

    res.status(resp.status).json(resp.data);
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      console.error("Proxy error:", err.message);
      res.status(502).json({ error: "Bad Gateway", message: err.message });
    }
  }
}

/*=============================
 * Proxy ESPECÍFICO para reviews
 * NÃO remove prefixo (/reviews)
 * ============================*/
async function proxyReview(req, res) {
  const targetUrl = `${REVIEW_URL}${req.originalUrl}`;

  try {
    const resp = await axios({
      url: targetUrl,
      method: req.method,
      headers: {
        Authorization: req.headers.authorization,
        "Content-Type": "application/json"
      },
      params: req.query,
      data: req.body,
      timeout: 15000
    });

    res.status(resp.status).json(resp.data);
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      console.error("Review proxy error:", err.message);
      res.status(502).json({ error: "Bad Gateway", message: err.message });
    }
  }
}

/*=============================
 * AUTH (public)
 * =============================*/
router.use("/auth", (req, res) =>
  proxyRequest(req, res, AUTH_URL)
);

/*=============================
 * GAMES
 * Prefixo removido → game-service usa /
 * =============================*/
// Public
router.get("/games*", (req, res) =>
  proxyRequest(req, res, GAME_URL)
);

// Protected
router.post("/games*", authMiddleware, (req, res) =>
  proxyRequest(req, res, GAME_URL)
);

router.put("/games*", authMiddleware, (req, res) =>
  proxyRequest(req, res, GAME_URL)
);

router.delete("/games*", authMiddleware, (req, res) =>
  proxyRequest(req, res, GAME_URL)
);

/*=============================
 * REVIEWS
 * Prefixo MANTIDO → FastAPI usa /reviews
 * =============================*/
router.post("/reviews", authMiddleware, proxyReview);
router.get("/reviews/game/:id", proxyReview);
router.get("/reviews/user/:id", proxyReview);
router.put("/reviews/:id", authMiddleware, proxyReview);
router.delete("/reviews/:id", authMiddleware, proxyReview);

/* =============================
 * ANALYTICS (GraphQL)
 * ============================= */
router.use("/analytics", (req, res) =>
  proxyRequest(req, res, ANALYTICS_URL)
);

/*=============================
 * FALLBACK
 * =============================*/
router.use((req, res) =>
  res.status(404).json({ error: "Not found in API Gateway" })
);

export default router;