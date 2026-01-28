import { gql } from "apollo-server";

/** 
 * Schema GraphQL para Analytics Service
 * - Game: representação resumida de um jogo
 * - GameStats: métricas agregadas de um jogo
 * - UserStats: atividade de um utilizador
 *
 * Queries:
 * - topGames(limit): lista de jogos ordenada por rating média e downloads
 * - gameStats(gameId): estatísticas de um jogo
 * - userActivity(userId): estatísticas/atividades de um utilizador
 */

export const typeDefs = gql`
  type Game {
    id: ID!
    title: String
    description: String
    genre: String
    developerId: ID
    price: Float
    downloads: Int
    createdAt: String
  }

  type GameStats {
    game: Game
    averageRating: Float
    reviewsCount: Int
    downloads: Int
  }

  type UserStats {
    userId: ID!
    reviewsCount: Int
    reviewedGames: [Game]
    publishedGamesCount: Int
  }

  type Query {
    topGames(limit: Int = 10): [GameStats]
    gameStats(gameId: ID!): GameStats
    userActivity(userId: ID!): UserStats
  }
`;
