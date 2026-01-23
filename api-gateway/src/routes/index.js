import express from "express";
import axios from "axios";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

const AUTH_URL = process.env.AUTH_URL || "http://localhost:4001";
const GAME_URL = process.env.GAME_URL || "http://localhost:4002";
const REVIEW_URL = process.env.REVIEW_URL || "http://localhost:4003";
const ANALYTICS_URL = process.env.ANALYTICS_URL || "http://localhost:4004";

// Proxy helper
async function proxyRequest(req, res, targetBase) {
  //const targetUrl = `${targetBase}${req.originalUrl.replace(/^\/[^/]+/, "")}`; 
  const targetUrl = `${targetBase}${req.originalUrl}`;
  try {
    const axiosConfig = {
      url: targetUrl,
      method: req.method,
      //headers: { ...req.headers, host: undefined }, 
      headers: { "content-type": "application/json", authorization: req.headers.authorization },
      params: req.query,
      data: req.body,
      timeout: 15000
    };

    const resp = await axios(axiosConfig);
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

//Rotas publicas que não exigem autenticação
 
router.use("/auth", (req, res) => proxyRequest(req, res, AUTH_URL));

// Games endpoints
 
router.get("/games*", (req, res) => proxyRequest(req, res, GAME_URL));

// Proteção POST/PUT/DELETE on /games

router.post("/games*", authMiddleware, (req, res) => proxyRequest(req, res, GAME_URL));
router.put("/games/*", authMiddleware, (req, res) => proxyRequest(req, res, GAME_URL));
router.delete("/games/*", authMiddleware, (req, res) => proxyRequest(req, res, GAME_URL));

// Reviews endpoints
 
router.get("/reviews*", (req, res) => proxyRequest(req, res, REVIEW_URL));
router.post("/reviews*", authMiddleware, (req, res) => proxyRequest(req, res, REVIEW_URL));
router.put("/reviews/*", authMiddleware, (req, res) => proxyRequest(req, res, REVIEW_URL));
router.delete("/reviews/*", authMiddleware, (req, res) => proxyRequest(req, res, REVIEW_URL));

// Analytics - graphQL reve auth para algumas queries/mutations

router.use("/analytics", (req, res) => proxyRequest(req, res, ANALYTICS_URL));

//  Outro caminho -> 404

router.use((req, res) => res.status(404).json({ error: "Not found in API Gateway" }));

export default router;
