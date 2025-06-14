import React, { useState } from 'react';

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  age: number;
  tier: number;
  rank: number;
  notes?: string;
}

const DraftPrep: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  // Dynasty Superflex Rankings - Top 50 based on research
  const dynastyRankings: Player[] = [
    // Tier 1 - Elite QBs and Top Assets
    { id: '1', name: 'Jayden Daniels', position: 'QB', team: 'WAS', age: 24, tier: 1, rank: 1, notes: 'Young elite QB with rushing upside' },
    { id: '2', name: 'Josh Allen', position: 'QB', team: 'BUF', age: 29, tier: 1, rank: 2, notes: 'Proven elite fantasy QB' },
    { id: '3', name: 'Lamar Jackson', position: 'QB', team: 'BAL', age: 28, tier: 1, rank: 3, notes: 'Dual-threat elite production' },
    { id: '4', name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', age: 25, tier: 1, rank: 4, notes: 'Elite WR in prime' },
    { id: '5', name: 'C.J. Stroud', position: 'QB', team: 'HOU', age: 23, tier: 1, rank: 5, notes: 'Young franchise QB' },
    
    // Tier 2 - Elite Assets
    { id: '6', name: 'Justin Jefferson', position: 'WR', team: 'MIN', age: 25, tier: 2, rank: 6, notes: 'Elite WR1' },
    { id: '7', name: 'Caleb Williams', position: 'QB', team: 'CHI', age: 23, tier: 2, rank: 7, notes: 'High ceiling rookie QB' },
    { id: '8', name: 'Patrick Mahomes', position: 'QB', team: 'KC', age: 30, tier: 2, rank: 8, notes: 'Longevity but lower fantasy ceiling' },
    { id: '9', name: 'CeeDee Lamb', position: 'WR', team: 'DAL', age: 25, tier: 2, rank: 9, notes: 'Elite WR with target share' },
    { id: '10', name: 'Drake Maye', position: 'QB', team: 'NE', age: 22, tier: 2, rank: 10, notes: 'Young QB with upside' },
    
    // Tier 3 - Strong Assets
    { id: '11', name: 'Bijan Robinson', position: 'RB', team: 'ATL', age: 22, tier: 3, rank: 11, notes: 'Young elite RB talent' },
    { id: '12', name: 'Jalen Hurts', position: 'QB', team: 'PHI', age: 26, tier: 3, rank: 12, notes: 'Rushing QB with concerns' },
    { id: '13', name: 'Joe Burrow', position: 'QB', team: 'CIN', age: 28, tier: 3, rank: 13, notes: 'Elite pocket passer' },
    { id: '14', name: 'Malik Nabers', position: 'WR', team: 'NYG', age: 22, tier: 3, rank: 14, notes: 'Young elite WR talent' },
    { id: '15', name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', age: 22, tier: 3, rank: 15, notes: 'Explosive young RB' },
    
    // Tier 4 - Good Assets
    { id: '16', name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', age: 25, tier: 4, rank: 16, notes: 'Consistent WR1' },
    { id: '17', name: 'Puka Nacua', position: 'WR', team: 'LAR', age: 23, tier: 4, rank: 17, notes: 'Young breakout WR' },
    { id: '18', name: 'Anthony Richardson', position: 'QB', team: 'IND', age: 22, tier: 4, rank: 18, notes: 'High ceiling, injury concerns' },
    { id: '19', name: 'Garrett Wilson', position: 'WR', team: 'NYJ', age: 24, tier: 4, rank: 19, notes: 'Young WR1 with QB issues' },
    { id: '20', name: 'Brock Bowers', position: 'TE', team: 'LV', age: 22, tier: 4, rank: 20, notes: 'Elite young TE' },
    
    // Additional top players to round out top 30
    { id: '21', name: 'Jaylen Waddle', position: 'WR', team: 'MIA', age: 25, tier: 4, rank: 21, notes: 'Explosive WR with Tua' },
    { id: '22', name: 'Dak Prescott', position: 'QB', team: 'DAL', age: 31, tier: 4, rank: 22, notes: 'Aging but reliable QB' },
    { id: '23', name: 'Breece Hall', position: 'RB', team: 'NYJ', age: 23, tier: 4, rank: 23, notes: 'Injury recovery, high upside' },
    { id: '24', name: 'Rome Odunze', position: 'WR', team: 'CHI', age: 22, tier: 5, rank: 24, notes: 'Rookie WR with Williams' },
    { id: '25', name: 'Marvin Harrison Jr.', position: 'WR', team: 'ARI', age: 22, tier: 5, rank: 25, notes: 'Elite rookie WR' },
    { id: '26', name: 'Kyler Murray', position: 'QB', team: 'ARI', age: 27, tier: 5, rank: 26, notes: 'Dual-threat with inconsistency' },
    { id: '27', name: 'Tua Tagovailoa', position: 'QB', team: 'MIA', age: 27, tier: 5, rank: 27, notes: 'Injury concerns but productive' },
    { id: '28', name: 'Jonathan Taylor', position: 'RB', team: 'IND', age: 25, tier: 5, rank: 28, notes: 'Aging RB with talent' },
    { id: '29', name: 'Travis Kelce', position: 'TE', team: 'KC', age: 35, tier: 5, rank: 29, notes: 'Elite but aging TE' },
    { id: '30', name: 'Tyreek Hill', position: 'WR', team: 'MIA', age: 30, tier: 5, rank: 30, notes: 'Elite but aging WR' },
  ];

  const filteredPlayers = dynastyRankings.filter(player => {
    const positionMatch = selectedPosition === 'ALL' || player.position === selectedPosition;
    const tierMatch = selectedTier === null || player.tier === selectedTier;
    return positionMatch && tierMatch;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dynasty Superflex Draft Prep</h1>
        <p className="text-gray-600">
          Prepare for your dynasty superflex draft with tiered player rankings and strategy guidance.
        </p>
      </div>

      {/* Strategy Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Key Superflex Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Draft Priorities</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2"></span>
                <span><strong>Rounds 1-2:</strong> Target elite QBs first</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2"></span>
                <span><strong>QB Scarcity:</strong> Only 32 NFL starters for 24+ roster spots</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                <span><strong>Youth Premium:</strong> Target young players for dynasty value</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2"></span>
                <span><strong>Don't Punt QB:</strong> Avoid ending up with only backup QBs</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Position Strategy</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2"></span>
                <span><strong>QB:</strong> Draft 3-4 total, 2 solid starters minimum</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2"></span>
                <span><strong>WR:</strong> Most stable position, target young talent</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2"></span>
                <span><strong>RB:</strong> Shorter careers, focus on immediate impact</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                <span><strong>TE:</strong> Target elite youth (Bowers) or proven producers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Player Rankings</h2>
        <div className="flex flex-wrap gap-4 mb-6">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
            <select
              value={selectedTier || ''}
              onChange={(e) => setSelectedTier(e.target.value ? parseInt(e.target.value) : null)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Tiers</option>
              <option value="1">Tier 1 - Elite</option>
              <option value="2">Tier 2 - Great</option>
              <option value="3">Tier 3 - Good</option>
              <option value="4">Tier 4 - Solid</option>
              <option value="5">Tier 5 - Depth</option>
            </select>
          </div>
        </div>

        {/* Player List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredPlayers.map((player) => (
            <div key={player.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
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
                  <h4 className="font-medium text-gray-900">{player.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{player.team}</span>
                    <span>•</span>
                    <span>Age {player.age}</span>
                  </div>
                </div>
              </div>
              {player.notes && (
                <div className="text-xs text-gray-500 max-w-xs text-right">
                  {player.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DraftPrep;