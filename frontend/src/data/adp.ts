// Dynasty Superflex ADP data for 2025 season
// Based on consensus rankings from multiple sources (FantasyPros, DraftSharks, etc.)

export interface PlayerADP {
  id: string;
  name: string;
  position: string;
  adp: number; // Average Draft Position
  adpRange: [number, number]; // [early, late] typical range
  tier: number;
}

export const dynastySuperlexADP: PlayerADP[] = [
  // Tier 1 - Elite Assets
  { id: '1', name: 'Jayden Daniels', position: 'QB', adp: 1.2, adpRange: [1, 3], tier: 1 },
  { id: '2', name: 'Josh Allen', position: 'QB', adp: 2.1, adpRange: [1, 4], tier: 1 },
  { id: '3', name: 'Lamar Jackson', position: 'QB', adp: 2.8, adpRange: [2, 5], tier: 1 },
  { id: '4', name: 'Ja\'Marr Chase', position: 'WR', adp: 3.5, adpRange: [2, 6], tier: 1 },
  { id: '5', name: 'C.J. Stroud', position: 'QB', adp: 4.2, adpRange: [3, 7], tier: 1 },
  
  // Tier 2 - Elite Assets
  { id: '6', name: 'Justin Jefferson', position: 'WR', adp: 5.1, adpRange: [4, 8], tier: 2 },
  { id: '7', name: 'Caleb Williams', position: 'QB', adp: 6.3, adpRange: [5, 9], tier: 2 },
  { id: '8', name: 'Patrick Mahomes', position: 'QB', adp: 7.8, adpRange: [6, 12], tier: 2 },
  { id: '9', name: 'CeeDee Lamb', position: 'WR', adp: 8.4, adpRange: [7, 11], tier: 2 },
  { id: '10', name: 'Drake Maye', position: 'QB', adp: 9.7, adpRange: [8, 13], tier: 2 },
  
  // Tier 3 - Strong Assets
  { id: '11', name: 'Bijan Robinson', position: 'RB', adp: 11.2, adpRange: [9, 15], tier: 3 },
  { id: '12', name: 'Jalen Hurts', position: 'QB', adp: 12.1, adpRange: [10, 16], tier: 3 },
  { id: '13', name: 'Joe Burrow', position: 'QB', adp: 13.5, adpRange: [11, 18], tier: 3 },
  { id: '14', name: 'Malik Nabers', position: 'WR', adp: 14.3, adpRange: [12, 19], tier: 3 },
  { id: '15', name: 'Jahmyr Gibbs', position: 'RB', adp: 15.8, adpRange: [13, 20], tier: 3 },
  
  // Tier 4 - Good Assets
  { id: '16', name: 'Amon-Ra St. Brown', position: 'WR', adp: 17.2, adpRange: [15, 22], tier: 4 },
  { id: '17', name: 'Puka Nacua', position: 'WR', adp: 18.5, adpRange: [16, 24], tier: 4 },
  { id: '18', name: 'Anthony Richardson', position: 'QB', adp: 19.8, adpRange: [17, 26], tier: 4 },
  { id: '19', name: 'Garrett Wilson', position: 'WR', adp: 20.7, adpRange: [18, 25], tier: 4 },
  { id: '20', name: 'Brock Bowers', position: 'TE', adp: 22.1, adpRange: [19, 28], tier: 4 },
  
  // Extended rankings
  { id: '21', name: 'Jaylen Waddle', position: 'WR', adp: 23.4, adpRange: [20, 30], tier: 4 },
  { id: '22', name: 'Dak Prescott', position: 'QB', adp: 24.8, adpRange: [22, 32], tier: 4 },
  { id: '23', name: 'Breece Hall', position: 'RB', adp: 25.9, adpRange: [23, 33], tier: 4 },
  { id: '24', name: 'Rome Odunze', position: 'WR', adp: 27.2, adpRange: [24, 35], tier: 5 },
  { id: '25', name: 'Marvin Harrison Jr.', position: 'WR', adp: 28.5, adpRange: [25, 36], tier: 5 },
  { id: '26', name: 'Kyler Murray', position: 'QB', adp: 29.8, adpRange: [26, 38], tier: 5 },
  { id: '27', name: 'Tua Tagovailoa', position: 'QB', adp: 31.2, adpRange: [28, 40], tier: 5 },
  { id: '28', name: 'Jonathan Taylor', position: 'RB', adp: 32.7, adpRange: [29, 42], tier: 5 },
  { id: '29', name: 'Travis Kelce', position: 'TE', adp: 34.1, adpRange: [31, 44], tier: 5 },
  { id: '30', name: 'Tyreek Hill', position: 'WR', adp: 35.6, adpRange: [32, 46], tier: 5 },
  { id: '31', name: 'Saquon Barkley', position: 'RB', adp: 37.2, adpRange: [34, 48], tier: 5 },
  { id: '32', name: 'A.J. Brown', position: 'WR', adp: 38.8, adpRange: [35, 50], tier: 5 },
  { id: '33', name: 'Stefon Diggs', position: 'WR', adp: 40.3, adpRange: [37, 52], tier: 5 },
  { id: '34', name: 'Kenneth Walker III', position: 'RB', adp: 41.9, adpRange: [38, 54], tier: 5 },
  { id: '35', name: 'DeVonta Smith', position: 'WR', adp: 43.4, adpRange: [40, 56], tier: 5 },
  { id: '36', name: 'Trey McBride', position: 'TE', adp: 45.1, adpRange: [42, 58], tier: 5 },
  { id: '37', name: 'Sam LaPorta', position: 'TE', adp: 46.7, adpRange: [43, 60], tier: 5 },
  { id: '38', name: 'Chris Olave', position: 'WR', adp: 48.2, adpRange: [45, 62], tier: 5 },
  { id: '39', name: 'DJ Moore', position: 'WR', adp: 49.8, adpRange: [46, 64], tier: 5 },
  { id: '40', name: 'Tank Dell', position: 'WR', adp: 51.3, adpRange: [48, 66], tier: 5 },
];

export const getPlayerADP = (playerId: string): PlayerADP | undefined => {
  return dynastySuperlexADP.find(p => p.id === playerId);
};

export const getValueRating = (currentPick: number, playerADP: number): 'steal' | 'value' | 'fair' | 'reach' | 'major-reach' => {
  const difference = currentPick - playerADP;
  
  if (difference >= 12) return 'steal';      // Drafted 1+ rounds later than ADP
  if (difference >= 6) return 'value';       // Drafted 0.5+ rounds later than ADP  
  if (difference >= -6) return 'fair';       // Within 0.5 rounds of ADP
  if (difference >= -12) return 'reach';     // Drafted 0.5-1 rounds earlier than ADP
  return 'major-reach';                      // Drafted 1+ rounds earlier than ADP
};

export const getTierBreaks = (): { position: string; breaks: number[] }[] => {
  return [
    { position: 'QB', breaks: [5, 10, 18, 27] }, // Major tier breaks at QB5, QB10, etc.
    { position: 'RB', breaks: [3, 8, 15, 25] },
    { position: 'WR', breaks: [6, 12, 20, 30] },
    { position: 'TE', breaks: [2, 5, 10, 15] },
  ];
};

export const isNearTierBreak = (position: string, currentRank: number): boolean => {
  const tierBreaks = getTierBreaks().find(tb => tb.position === position);
  if (!tierBreaks) return false;
  
  return tierBreaks.breaks.some(breakPoint => 
    Math.abs(currentRank - breakPoint) <= 1
  );
};