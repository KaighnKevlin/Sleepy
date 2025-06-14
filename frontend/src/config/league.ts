// Dynasty Warriors League Configuration
export const LEAGUE_CONFIG = {
  league_id: "1235289683278184448",
  user_id: "1235753650333155328",
  roster_id: 8,
  league_name: "Dynasty Warriors",
  season: "2025",
  roster_positions: [
    "QB",
    "RB", "RB",
    "WR", "WR", "WR",
    "TE",
    "FLEX", "FLEX",
    "SUPER_FLEX",
    "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN"
  ],
  total_rosters: 12,
  scoring_settings: {
    rec: 1.0, // PPR
    pass_yd: 0.04,
    pass_td: 4.0,
    pass_int: -1.0,
    rush_yd: 0.1,
    rush_td: 6.0,
    rec_yd: 0.1,
    rec_td: 6.0,
    fum_lost: -2.0,
    // ... more scoring settings available
  },
  league_settings: {
    num_teams: 12,
    playoff_teams: 6,
    playoff_week_start: 14,
    waiver_budget: 100,
    trade_deadline: 10,
    pick_trading: 1,
    type: 2, // Dynasty league
    max_keepers: 1,
    reserve_slots: 2,
  }
};

// League roster structure
export const STARTING_LINEUP = [
  { position: "QB", count: 1 },
  { position: "RB", count: 2 },
  { position: "WR", count: 3 },
  { position: "TE", count: 1 },
  { position: "FLEX", count: 2 },
  { position: "SUPER_FLEX", count: 1 },
];

export const BENCH_SLOTS = 16;
export const RESERVE_SLOTS = 2;

// Helper functions
export const getTotalStartingSlots = () => 
  STARTING_LINEUP.reduce((total, pos) => total + pos.count, 0);

export const getTotalRosterSlots = () => 
  getTotalStartingSlots() + BENCH_SLOTS + RESERVE_SLOTS;