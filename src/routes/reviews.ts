import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const router = Router();

router.post('/', authenticate, async (req: AuthRequest, res) => {
    const { gameId, rating, comment } = req.body;
    if (!gameId || !rating) return res.status(400).json({ error: 'Missing fields' });
    const review = await prisma.review.create({
        data: {
            rating,
            comment,
            userId: req.user.userId,
            gameId,
        },
    });
    res.json(review);
});

router.get('/game/:gameId', async (req, res) => {
    const gameId = Number(req.params.gameId);
    const reviews = await prisma.review.findMany({
        where: { gameId },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
});

export default router;
