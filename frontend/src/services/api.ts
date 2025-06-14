import axios from 'axios';
import {
  TrendingPlayersResponse,
  UserLeaguesResponse,
  LeagueRosterResponse,
  HealthResponse,
  LeagueDraftsResponse,
  DraftResponse,
  LiveDraftResponse
} from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health check
  async healthCheck(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health/');
    return response.data;
  },

  // Get trending players
  async getTrendingPlayers(
    type: 'add' | 'drop' = 'add',
    hours: number = 12,
    limit: number = 25
  ): Promise<TrendingPlayersResponse> {
    const response = await apiClient.get<TrendingPlayersResponse>(
      `/sleeper/trending/?type=${type}&hours=${hours}&limit=${limit}`
    );
    return response.data;
  },

  // Get user leagues
  async getUserLeagues(
    username: string,
    season: string = '2024'
  ): Promise<UserLeaguesResponse> {
    const response = await apiClient.get<UserLeaguesResponse>(
      `/sleeper/user/${username}/leagues/?season=${season}`
    );
    return response.data;
  },

  // Get user roster in a specific league
  async getLeagueRoster(
    username: string,
    leagueId: string
  ): Promise<LeagueRosterResponse> {
    const response = await apiClient.get<LeagueRosterResponse>(
      `/sleeper/user/${username}/league/${leagueId}/roster/`
    );
    return response.data;
  },

  // Get all drafts for a league
  async getLeagueDrafts(leagueId: string): Promise<LeagueDraftsResponse> {
    const response = await apiClient.get<LeagueDraftsResponse>(
      `/sleeper/league/${leagueId}/drafts/`
    );
    return response.data;
  },

  // Get specific draft details and picks
  async getDraftDetails(draftId: string): Promise<DraftResponse> {
    const response = await apiClient.get<DraftResponse>(
      `/sleeper/draft/${draftId}/`
    );
    return response.data;
  },

  // Get live draft information for a league
  async getLiveDraft(leagueId: string): Promise<LiveDraftResponse> {
    const response = await apiClient.get<LiveDraftResponse>(
      `/sleeper/league/${leagueId}/live-draft/`
    );
    return response.data;
  },
};

export default apiService;