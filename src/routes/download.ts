import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const router = Router();

// Simula um "download" e regista estatísticas
router.post('/:gameId', authenticate, async (req: AuthRequest, res) => {
    const gameId = Number(req.params.gameId);
    // increment downloads in Game and GameStat
    await prisma.game.update({ where: { id: gameId }, data: { downloads: { increment: 1 } } });
    await prisma.gameStat.upsert({
        where: { gameId },
        create: { gameId, downloads: 1, views: 0, likes: 0 },
        update: { downloads: { increment: 1 } },
    });
    res.json({ success: true });
});

export default router;
