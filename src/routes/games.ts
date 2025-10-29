import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';
import slugify from 'slugify';

const prisma = new PrismaClient();
const router = Router();

// List games / catalog
router.get('/', async (req, res) => {
    const games = await prisma.game.findMany({
        include: { developer: { select: { id: true, name: true, email: true } }, reviews: true },
        orderBy: { createdAt: 'desc' },
    });
    res.json(games);
});

// Create game (developer only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
    if (req.user.role !== 'DEVELOPER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only developers can create games' });
    }
    const { title, description, coverUrl } = req.body;
    const slug = slugify(title || '', { lower: true });
    const game = await prisma.game.create({
        data: {
            title,
            slug,
            description,
            coverUrl,
            developerId: req.user.userId,
        },
    });
    res.json(game);
});

// Get single game
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const game = await prisma.game.findUnique({
        where: { id },
        include: { reviews: true, developer: true, stats: true },
    });
    if (!game) return res.status(404).json({ error: 'Not found' });
    res.json(game);
});

// Update (developer)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    const game = await prisma.game.findUnique({ where: { id } });
    if (!game) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'ADMIN' && game.developerId !== req.user.userId) {
        return res.status(403).json({ error: 'Not allowed' });
    }
    const updated = await prisma.game.update({ where: { id }, data: req.body });
    res.json(updated);
});

export default router;
