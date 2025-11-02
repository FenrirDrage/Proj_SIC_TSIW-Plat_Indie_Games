import { AnalyticsService } from "./services/analytics.service.js";

/**
 * Resolvers GraphQL que chamam o AnalyticsService para obter resultados.
 */

export const resolvers = {
  Query: {
    topGames: async (_, { limit = 10 }) => {
      return AnalyticsService.topGames(limit);
    },
    gameStats: async (_, { gameId }) => {
      return AnalyticsService.gameStats(gameId);
    },
    userActivity: async (_, { userId }) => {
      return AnalyticsService.userActivity(userId);
    }
  },

  // Mapear campos se necessário
  GameStats: {
    game: (parent) => parent.game,
    averageRating: (parent) => parent.averageRating,
    reviewsCount: (parent) => parent.reviewsCount,
    downloads: (parent) => parent.downloads
  },

  UserStats: {
    userId: (parent) => parent.userId,
    reviewsCount: (parent) => parent.reviewsCount,
    reviewedGames: (parent) => parent.reviewedGames,
    publishedGamesCount: (parent) => parent.publishedGamesCount
  }
};
