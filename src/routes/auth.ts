import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt';
import { hashPassword, comparePassword } from '../utils/hash';

const prisma = new PrismaClient();
const router = Router();

// Register
router.post('/register', async (req, res) => {
    const { email, password, name, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'User already exists' });
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
        data: { email, passwordHash, name, role: role || 'USER' },
    });
    res.json({ id: user.id, email: user.email, name: user.name });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
    });

    res.json({ token });
});

export default router;
