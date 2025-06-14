// Mock implementation of API service for testing

export const apiService = {
  healthCheck: jest.fn(),
  getTrendingPlayers: jest.fn(),
  getUserLeagues: jest.fn(),
  getLeagueRoster: jest.fn(),
};

export default apiService;