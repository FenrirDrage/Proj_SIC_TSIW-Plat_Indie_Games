import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt';

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        me: async (_: any, __: any, ctx: any) => {
            if (!ctx.user) return null;
            return prisma.user.findUnique({ where: { id: ctx.user.userId } });
        },
        games: async (_: any, { page = 1, pageSize = 10 }: any) => {
            return prisma.game.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: { developer: true, reviews: true, stats: true },
                orderBy: { createdAt: 'desc' },
            });
        },
        game: async (_: any, { id }: any) => {
            return prisma.game.findUnique({ where: { id }, include: { developer: true, reviews: true, stats: true } });
        },
        developerGames: async (_: any, { devId }: any) => {
            return prisma.game.findMany({ where: { developerId: devId } });
        }
    },
    Mutation: {
        createGame: async (_: any, { input }: any, ctx: any) => {
            if (!ctx.user) throw new Error('Not authenticated');
            if (ctx.user.role !== 'DEVELOPER' && ctx.user.role !== 'ADMIN') throw new Error('Not a developer');
            const slug = slugify(input.title, { lower: true });
            return prisma.game.create({
                data: {
                    title: input.title,
                    description: input.description,
                    slug,
                    coverUrl: input.coverUrl,
                    developerId: ctx.user.userId,
                },
            });
        },
        updateGame: async (_: any, { input }: any, ctx: any) => {
            if (!ctx.user) throw new Error('Not authenticated');
            const game = await prisma.game.findUnique({ where: { id: input.id } });
            if (!game) throw new Error('Game not found');
            if (ctx.user.role !== 'ADMIN' && game.developerId !== ctx.user.userId) throw new Error('Not allowed');
            return prisma.game.update({ where: { id: input.id }, data: input });
        },
        createReview: async (_: any, { gameId, rating, comment }: any, ctx: any) => {
            if (!ctx.user) throw new Error('Not authenticated');
            return prisma.review.create({
                data: {
                    rating,
                    comment,
                    userId: ctx.user.userId,
                    gameId,
                },
            });
        }
    }
};
