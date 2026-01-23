import { authService } from "../services/auth.service.js";

// Controladores de autenticação
export const authController = {
  async register(req, res) {
    try {
      const { username, email, password, role } = req.body;
      const result = await authService.register({ username, email, password, role });
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async verify(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Token not found" });
      }

      const user = await authService.verify(token);
      return res.json({ user });
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  },

  async profile(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const user = await authService.verify(token);
      return res.json(user);
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const user = await authService.verify(token);
      const updated = await authService.update(user._id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const user = await authService.verify(token);
      await authService.remove(user._id);
      return res.json({ message: "Account deleted" });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};
