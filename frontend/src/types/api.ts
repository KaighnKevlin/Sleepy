// API Types for Sleepy Fantasy Assistant

export interface Player {
  player_id: string;
  name: string;
  position: string;
  team: string;
  injury_status?: string;
  count?: number; // For trending players
}

export interface TrendingPlayersResponse {
  type: 'add' | 'drop';
  hours: number;
  players: Player[];
}

export interface User {
  user_id: string;
  username: string;
  display_name: string;
  avatar?: string;
}

export interface League {
  league_id: string;
  name: string;
  season: string;
  total_rosters: number;
  roster_positions: Record<string, number>;
  scoring_settings: Record<string, any>;
}

export interface UserLeaguesResponse {
  user: User;
  leagues: League[];
}

export interface Roster {
  roster_id: number;
  total_players: number;
  players: Player[];
  starters: Player[];
  settings: Record<string, any>;
  metadata: Record<string, any>;
}

export interface LeagueRosterResponse {
  user: User;
  league: League;
  roster: Roster;
}

export interface HealthResponse {
  status: string;
  message: string;
}