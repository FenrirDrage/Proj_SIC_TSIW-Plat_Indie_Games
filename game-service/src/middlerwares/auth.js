import axios from "axios";

const AUTH_URL = process.env.AUTH_URL || null;

export default async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }
    const token = authHeader.split(" ")[1];
    if (!AUTH_URL) {
      req.user = null;
      return next();
    }

    const resp = await axios.post(`${AUTH_URL}/auth/verify`, {}, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });

    req.user = resp.data.user || resp.data;
    return next();
  } catch (err) {
    console.warn("Auth middleware: token invalid or expired", err.message);
    req.user = null;
    return next();
  }
}
