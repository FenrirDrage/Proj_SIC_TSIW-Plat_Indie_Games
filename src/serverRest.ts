import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import gamesRoutes from './routes/games';
import reviewsRoutes from './routes/reviews';
import downloadsRoutes from './routes/downloads';
import { errorHandler } from './middleware/errorHandler';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/downloads', downloadsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`REST server running on http://localhost:${PORT}`);
});
