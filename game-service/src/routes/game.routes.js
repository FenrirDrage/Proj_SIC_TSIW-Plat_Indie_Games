import axios from "axios";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Login required" });
    }

    // Esperado: "Bearer <token>"
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "Invalid authorization header" });
    }

    if (!process.env.AUTH_SERVICE_URL) {
      console.error("❌ AUTH_SERVICE_URL não definido");
      return res.status(500).json({ error: "Auth service not configured" });
    }

    // Chamada ao Auth Service para validar o token
    const response = await axios.post(
      process.env.AUTH_SERVICE_URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Guardar user validado
    req.user = response.data;

    return next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err.response?.data || err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
