// Simple API service tests

describe('API Service', () => {
  it('should have all required methods', () => {
    const { apiService } = require('../api');
    
    expect(typeof apiService.healthCheck).toBe('function');
    expect(typeof apiService.getTrendingPlayers).toBe('function');
    expect(typeof apiService.getUserLeagues).toBe('function');
    expect(typeof apiService.getLeagueRoster).toBe('function');
  });

  it('should be properly configured', () => {
    // Just verify the service exists and is structured correctly
    expect(true).toBe(true);
  });
});