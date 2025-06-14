import React, { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  age: number;
  tier: number;
  rank: number;
  notes?: string;
  isDrafted: boolean;
  draftedBy?: string;
  draftRound?: number;
  draftPick?: number;
}

interface DraftPick {
  round: number;
  pick: number;
  overallPick: number;
  isYourPick: boolean;
  playerId?: string;
}

const DraftBoard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);
  const [currentPick, setCurrentPick] = useState<number>(1);
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(true);
  const [yourPickPosition, setYourPickPosition] = useState<number>(8); // Dynasty Warriors roster 8

  // Initialize draft picks for 12-team league, 26 rounds
  useEffect(() => {
    const picks: DraftPick[] = [];
    for (let round = 1; round <= 26; round++) {
      for (let pick = 1; pick <= 12; pick++) {
        const overallPick = (round - 1) * 12 + pick;
        const isYourPick = pick === yourPickPosition;
        picks.push({
          round,
          pick,
          overallPick,
          isYourPick,
        });
      }
    }
    setDraftPicks(picks);
  }, [yourPickPosition]);

  // Initialize players with dynasty rankings
  useEffect(() => {
    const initialPlayers: Player[] = [
      // Tier 1 - Elite QBs and Top Assets
      { id: '1', name: 'Jayden Daniels', position: 'QB', team: 'WAS', age: 24, tier: 1, rank: 1, notes: 'Young elite QB with rushing upside', isDrafted: false },
      { id: '2', name: 'Josh Allen', position: 'QB', team: 'BUF', age: 29, tier: 1, rank: 2, notes: 'Proven elite fantasy QB', isDrafted: false },
      { id: '3', name: 'Lamar Jackson', position: 'QB', team: 'BAL', age: 28, tier: 1, rank: 3, notes: 'Dual-threat elite production', isDrafted: false },
      { id: '4', name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', age: 25, tier: 1, rank: 4, notes: 'Elite WR in prime', isDrafted: false },
      { id: '5', name: 'C.J. Stroud', position: 'QB', team: 'HOU', age: 23, tier: 1, rank: 5, notes: 'Young franchise QB', isDrafted: false },
      
      // Tier 2 - Elite Assets
      { id: '6', name: 'Justin Jefferson', position: 'WR', team: 'MIN', age: 25, tier: 2, rank: 6, notes: 'Elite WR1', isDrafted: false },
      { id: '7', name: 'Caleb Williams', position: 'QB', team: 'CHI', age: 23, tier: 2, rank: 7, notes: 'High ceiling rookie QB', isDrafted: false },
      { id: '8', name: 'Patrick Mahomes', position: 'QB', team: 'KC', age: 30, tier: 2, rank: 8, notes: 'Longevity but lower fantasy ceiling', isDrafted: false },
      { id: '9', name: 'CeeDee Lamb', position: 'WR', team: 'DAL', age: 25, tier: 2, rank: 9, notes: 'Elite WR with target share', isDrafted: false },
      { id: '10', name: 'Drake Maye', position: 'QB', team: 'NE', age: 22, tier: 2, rank: 10, notes: 'Young QB with upside', isDrafted: false },
      
      // Tier 3 - Strong Assets
      { id: '11', name: 'Bijan Robinson', position: 'RB', team: 'ATL', age: 22, tier: 3, rank: 11, notes: 'Young elite RB talent', isDrafted: false },
      { id: '12', name: 'Jalen Hurts', position: 'QB', team: 'PHI', age: 26, tier: 3, rank: 12, notes: 'Rushing QB with concerns', isDrafted: false },
      { id: '13', name: 'Joe Burrow', position: 'QB', team: 'CIN', age: 28, tier: 3, rank: 13, notes: 'Elite pocket passer', isDrafted: false },
      { id: '14', name: 'Malik Nabers', position: 'WR', team: 'NYG', age: 22, tier: 3, rank: 14, notes: 'Young elite WR talent', isDrafted: false },
      { id: '15', name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', age: 22, tier: 3, rank: 15, notes: 'Explosive young RB', isDrafted: false },
      
      // Tier 4 - Good Assets  
      { id: '16', name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', age: 25, tier: 4, rank: 16, notes: 'Consistent WR1', isDrafted: false },
      { id: '17', name: 'Puka Nacua', position: 'WR', team: 'LAR', age: 23, tier: 4, rank: 17, notes: 'Young breakout WR', isDrafted: false },
      { id: '18', name: 'Anthony Richardson', position: 'QB', team: 'IND', age: 22, tier: 4, rank: 18, notes: 'High ceiling, injury concerns', isDrafted: false },
      { id: '19', name: 'Garrett Wilson', position: 'WR', team: 'NYJ', age: 24, tier: 4, rank: 19, notes: 'Young WR1 with QB issues', isDrafted: false },
      { id: '20', name: 'Brock Bowers', position: 'TE', team: 'LV', age: 22, tier: 4, rank: 20, notes: 'Elite young TE', isDrafted: false },
      
      // Additional players to round out top 40
      { id: '21', name: 'Jaylen Waddle', position: 'WR', team: 'MIA', age: 25, tier: 4, rank: 21, notes: 'Explosive WR with Tua', isDrafted: false },
      { id: '22', name: 'Dak Prescott', position: 'QB', team: 'DAL', age: 31, tier: 4, rank: 22, notes: 'Aging but reliable QB', isDrafted: false },
      { id: '23', name: 'Breece Hall', position: 'RB', team: 'NYJ', age: 23, tier: 4, rank: 23, notes: 'Injury recovery, high upside', isDrafted: false },
      { id: '24', name: 'Rome Odunze', position: 'WR', team: 'CHI', age: 22, tier: 5, rank: 24, notes: 'Rookie WR with Williams', isDrafted: false },
      { id: '25', name: 'Marvin Harrison Jr.', position: 'WR', team: 'ARI', age: 22, tier: 5, rank: 25, notes: 'Elite rookie WR', isDrafted: false },
      { id: '26', name: 'Kyler Murray', position: 'QB', team: 'ARI', age: 27, tier: 5, rank: 26, notes: 'Dual-threat with inconsistency', isDrafted: false },
      { id: '27', name: 'Tua Tagovailoa', position: 'QB', team: 'MIA', age: 27, tier: 5, rank: 27, notes: 'Injury concerns but productive', isDrafted: false },
      { id: '28', name: 'Jonathan Taylor', position: 'RB', team: 'IND', age: 25, tier: 5, rank: 28, notes: 'Aging RB with talent', isDrafted: false },
      { id: '29', name: 'Travis Kelce', position: 'TE', team: 'KC', age: 35, tier: 5, rank: 29, notes: 'Elite but aging TE', isDrafted: false },
      { id: '30', name: 'Tyreek Hill', position: 'WR', team: 'MIA', age: 30, tier: 5, rank: 30, notes: 'Elite but aging WR', isDrafted: false },
      { id: '31', name: 'Saquon Barkley', position: 'RB', team: 'PHI', age: 27, tier: 5, rank: 31, notes: 'Talented but aging RB', isDrafted: false },
      { id: '32', name: 'A.J. Brown', position: 'WR', team: 'PHI', age: 27, tier: 5, rank: 32, notes: 'Elite WR entering prime', isDrafted: false },
      { id: '33', name: 'Stefon Diggs', position: 'WR', team: 'HOU', age: 31, tier: 5, rank: 33, notes: 'Elite but aging WR', isDrafted: false },
      { id: '34', name: 'Kenneth Walker III', position: 'RB', team: 'SEA', age: 24, tier: 5, rank: 34, notes: 'Young RB with upside', isDrafted: false },
      { id: '35', name: 'DeVonta Smith', position: 'WR', team: 'PHI', age: 26, tier: 5, rank: 35, notes: 'Consistent WR2/3', isDrafted: false },
      { id: '36', name: 'Trey McBride', position: 'TE', team: 'ARI', age: 25, tier: 5, rank: 36, notes: 'Emerging young TE', isDrafted: false },
      { id: '37', name: 'Sam LaPorta', position: 'TE', team: 'DET', age: 25, tier: 5, rank: 37, notes: 'Young reliable TE', isDrafted: false },
      { id: '38', name: 'Chris Olave', position: 'WR', team: 'NO', age: 24, tier: 5, rank: 38, notes: 'Young WR with talent', isDrafted: false },
      { id: '39', name: 'DJ Moore', position: 'WR', team: 'CHI', age: 27, tier: 5, rank: 39, notes: 'Consistent veteran WR', isDrafted: false },
      { id: '40', name: 'Tank Dell', position: 'WR', team: 'HOU', age: 25, tier: 5, rank: 40, notes: 'Emerging slot WR', isDrafted: false },
    ];
    setPlayers(initialPlayers);
  }, []);

  const draftPlayer = (playerId: string, draftedBy: string = 'Unknown') => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId 
        ? { 
            ...p, 
            isDrafted: true, 
            draftedBy,
            draftRound: Math.ceil(currentPick / 12),
            draftPick: currentPick 
          }
        : p
    ));
    setCurrentPick(prev => prev + 1);
  };

  const undraftPlayer = (playerId: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId 
        ? { 
            ...p, 
            isDrafted: false, 
            draftedBy: undefined,
            draftRound: undefined,
            draftPick: undefined 
          }
        : p
    ));
  };

  const filteredPlayers = players.filter(player => {
    const positionMatch = selectedPosition === 'ALL' || player.position === selectedPosition;
    const availableMatch = !showOnlyAvailable || !player.isDrafted;
    return positionMatch && availableMatch;
  });

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-red-50 border-red-200 text-red-800';
      case 2: return 'bg-orange-50 border-orange-200 text-orange-800';
      case 3: return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 4: return 'bg-green-50 border-green-200 text-green-800';
      case 5: return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-100 text-red-800 border-red-200';
      case 'RB': return 'bg-green-100 text-green-800 border-green-200';
      case 'WR': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCurrentPickInfo = () => {
    if (currentPick > 312) return null; // 12 teams × 26 rounds = 312 total picks
    const round = Math.ceil(currentPick / 12);
    const pickInRound = ((currentPick - 1) % 12) + 1;
    const isYourPick = pickInRound === yourPickPosition;
    return { round, pickInRound, isYourPick };
  };

  const getNextYourPick = () => {
    const pickInfo = getCurrentPickInfo();
    if (!pickInfo) return null;
    
    if (pickInfo.isYourPick) {
      return currentPick;
    }
    
    // Calculate next pick for your position
    const currentRound = pickInfo.round;
    const nextRoundPick = currentRound * 12 + yourPickPosition;
    return nextRoundPick;
  };

  const currentPickInfo = getCurrentPickInfo();
  const nextYourPick = getNextYourPick();

  return (
    <div className="space-y-6">
      {/* Header with Draft Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Live Draft Board</h1>
            <p className="text-gray-600">Track picks in real-time during your dynasty draft</p>
          </div>
          <div className="text-right">
            {currentPickInfo && (
              <div className="space-y-1">
                <div className={`px-4 py-2 rounded-lg ${currentPickInfo.isYourPick ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800'}`}>
                  <div className="text-sm font-medium">
                    {currentPickInfo.isYourPick ? 'YOUR PICK!' : 'Current Pick'}
                  </div>
                  <div className="text-lg font-bold">
                    Round {currentPickInfo.round}, Pick {currentPickInfo.pickInRound} (#{currentPick})
                  </div>
                </div>
                {nextYourPick && nextYourPick !== currentPick && (
                  <div className="text-sm text-gray-600">
                    Your next pick: #{nextYourPick}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="ALL">All Positions</option>
                <option value="QB">Quarterbacks</option>
                <option value="RB">Running Backs</option>
                <option value="WR">Wide Receivers</option>
                <option value="TE">Tight Ends</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="available-only"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="available-only" className="text-sm text-gray-700">
                Show only available players
              </label>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{players.filter(p => !p.isDrafted).length}</span> players available
          </div>
        </div>
      </div>

      {/* Player List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Players</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredPlayers.map((player) => (
            <div 
              key={player.id} 
              className={`flex items-center justify-between p-3 border rounded-lg ${
                player.isDrafted 
                  ? 'border-gray-300 bg-gray-50 opacity-60' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    player.isDrafted ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-900'
                  }`}>
                    {player.rank}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getPositionColor(player.position)}`}>
                    {player.position}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getTierColor(player.tier)}`}>
                    T{player.tier}
                  </span>
                </div>
                <div>
                  <h4 className={`font-medium ${player.isDrafted ? 'text-gray-500' : 'text-gray-900'}`}>
                    {player.name}
                    {player.isDrafted && (
                      <span className="ml-2 text-xs text-gray-500">
                        (Pick #{player.draftPick})
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{player.team}</span>
                    <span>•</span>
                    <span>Age {player.age}</span>
                    {player.draftedBy && (
                      <>
                        <span>•</span>
                        <span>Drafted by {player.draftedBy}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {player.notes && (
                  <div className="text-xs text-gray-500 max-w-xs text-right mr-4">
                    {player.notes}
                  </div>
                )}
                {!player.isDrafted ? (
                  <button
                    onClick={() => draftPlayer(player.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Draft
                  </button>
                ) : (
                  <button
                    onClick={() => undraftPlayer(player.id)}
                    className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                  >
                    Undo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DraftBoard;