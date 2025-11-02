import axios from "axios";


const AUTH_URL = process.env.AUTH_URL || "http://localhost:4001";

export default async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    // Serviço Auth verifica o endpoint
    
    const verifyUrl = `${AUTH_URL}/auth/verify`;
    const resp = await axios.post(verifyUrl, {}, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });

    // Experado res.data conter informações do user

    req.user = resp.data.user || resp.data;
    return next();
  } catch (err) {
    console.error("Auth middleware error:", err?.response?.data || err.message);
    if (err.response && err.response.status) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
