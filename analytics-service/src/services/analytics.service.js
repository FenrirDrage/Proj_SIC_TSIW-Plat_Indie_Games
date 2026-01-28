import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GAME_URL = process.env.GAME_URL || "http://localhost:4002";
const REVIEW_URL = process.env.REVIEW_URL || "http://localhost:4003";

async function safeGet(url) {
  try {
    const resp = await axios.get(url, { timeout: 10000 });
    return resp.data;
  } catch (err) {
    console.error("Analytics fetch error:", err.message);
    throw new Error("Failed to fetch analytics data");
  }
}

async function fetchAllGames() {
  const url = `${GAME_URL}/`;
  //const resp = await axios.get(url, { timeout: 10000 });
  return await safeGet(`${GAME_URL}/`) || [];
}

async function fetchGameById(gameId) {
  const url = `${GAME_URL}/${gameId}`;
  //const resp = await axios.get(url, { timeout: 10000 });
  return await safeGet(`${GAME_URL}/${gameId}`);
}

async function fetchReviewsByGame(gameId) {
  const url = `${REVIEW_URL}/reviews/game/${gameId}`;
  //const resp = await axios.get(url, { timeout: 10000 });
  return await safeGet(`${REVIEW_URL}/reviews/game/${gameId}`) || [];
}

async function fetchReviewsByUser(userId) {
  const url = `${REVIEW_URL}/reviews/user/${userId}`;
  //const resp = await axios.get(url, { timeout: 10000 });
  return await safeGet(`${REVIEW_URL}/reviews/user/${userId}`) || [];
}

async function fetchGamesByDeveloper(developerId) {
  const games = await fetchAllGames();
  return games.filter(g => String(g.developer_id || g.developerId) === String(developerId));
}

// Calcula a média de ratings e o número de reviews
function aggregateReviews(reviews) {
  if (!reviews || reviews.length === 0) return { averageRating: 0, reviewsCount: 0 };
  const total = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
  const count = reviews.length;
  return { averageRating: total / count, reviewsCount: count };
}

export const AnalyticsService = {
  // Retorna os top jogos por rating médio e downloads
  async topGames(limit = 10) {
    const games = await fetchAllGames();
    const results = await Promise.all(games.map(async (g) => {
      const gameId = g.id || g.id;
      const reviews = await fetchReviewsByGame(gameId);
      const { averageRating, reviewsCount } = aggregateReviews(reviews);
      return {
        game: g,
        averageRating,
        reviewsCount,
        downloads: Number(g.downloads || 0)
      };
    }));

    // Ordena por rating médio * downloads
    results.sort((a, b) => (b.averageRating * (b.downloads || 1)) - (a.averageRating * (a.downloads || 1)));
    return results.slice(0, limit);
  },

  async gameStats(gameId) {
    const game = await fetchGameById(gameId);
    const reviews = await fetchReviewsByGame(gameId);
    const { averageRating, reviewsCount } = aggregateReviews(reviews);
    return {
      game,
      averageRating,
      reviewsCount,
      downloads: Number(game.downloads || 0)
    };
  },

  async userActivity(userId) {
    // reviews por user
    const reviews = await fetchReviewsByUser(userId);
    // jogos publicados por este developer
    const published = await fetchGamesByDeveloper(userId);

    // lista de jogos revistos
    const reviewedGameIds = Array.from(new Set(reviews.map(r => r.game_id || r.gameId || r.gameId)));
    const reviewedGames = await Promise.all(reviewedGameIds.map(async (gid) => {
      try {
        return await fetchGameById(gid);
      } catch {
        return null;
      }
    }));

    return {
      userId,
      reviewsCount: reviews.length,
      reviewedGames: reviewedGames.filter(Boolean),
      publishedGamesCount: published.length
    };
  }
};
