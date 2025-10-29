import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User { id: Int!, email: String!, name: String, role: String! }
  type Game { id: Int!, title: String!, slug: String!, description: String, downloads: Int!, developer: User!, reviews: [Review!]!, stats: GameStat }
  type Review { id: Int!, rating: Int!, comment: String, user: User!, createdAt: String! }
  type GameStat { id: Int!, views: Int!, downloads: Int!, likes: Int! }

  type Query {
    me: User
    games(page: Int, pageSize: Int): [Game!]!
    game(id: Int!): Game
    developerGames(devId: Int!): [Game!]!
  }

  input CreateGameInput { title: String!, description: String, coverUrl: String }
  input UpdateGameInput { id: Int!, title: String, description: String, coverUrl: String }

  type Mutation {
    createGame(input: CreateGameInput!): Game
    updateGame(input: UpdateGameInput!): Game
    createReview(gameId: Int!, rating: Int!, comment: String): Review
  }
`;
