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

export interface DraftPick {
  pick_no: number;
  round: number;
  roster_id: number;
  player_id?: string;
  picked_by?: string;
  is_keeper?: boolean;
  metadata?: Record<string, any>;
  player?: {
    name: string;
    position: string;
    team: string;
    age?: number;
    injury_status?: string;
  };
}

export interface Draft {
  draft_id: string;
  type: string;
  status: string;
  sport: string;
  season: string;
  season_type: string;
  league_id: string;
  settings: Record<string, any>;
  draft_order?: Record<string, number>;
  slot_to_roster_id?: Record<string, number>;
  created: number;
  start_time?: number;
}

export interface DraftResponse {
  draft: Draft;
  picks: DraftPick[];
  traded_picks: any[];
}

export interface LiveDraftResponse extends DraftResponse {
  status: string;
  type: string;
  settings: Record<string, any>;
}

export interface LeagueDraftsResponse {
  league_id: string;
  drafts: Draft[];
}