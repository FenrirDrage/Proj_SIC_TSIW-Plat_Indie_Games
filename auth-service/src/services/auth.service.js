import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Gerar token JWT
function gerarToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES || "1d" }
  );
}

// Serviços de autenticação
export const authService = {
  async register({ username, email, password, role }) {
    const existente = await User.findOne({ email });
    if (existente) throw new Error("Email already in use");

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, role });
    const token = gerarToken(user);

    return { user, token };
  },

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Login Invalid");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Login Invalid");

    const token = gerarToken(user);
    return { user, token };
  },

  async verify(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) throw new Error("User not found");
      return user;
    } catch {
      throw new Error("Token invalid");
    }
  },

  async update(userId, data) {
    const updated = await User.findByIdAndUpdate(userId, data, { new: true }).select("-password");
    return updated;
  },

  async remove(userId) {
    await User.findByIdAndDelete(userId);
    return true;
  }
};
