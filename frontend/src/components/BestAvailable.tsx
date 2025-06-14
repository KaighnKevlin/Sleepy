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
  isDrafted: boolean;
  draftRound?: number;
  draftPick?: number;
}

interface BestAvailableProps {
  players: Player[];
  onDraftPlayer: (playerId: string) => void;
  currentPickInfo?: {
    round: number;
    pickInRound: number;
    isYourPick: boolean;
  } | null;
}

const BestAvailable: React.FC<BestAvailableProps> = ({ players, onDraftPlayer, currentPickInfo }) => {
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');

  // Get best available players by position
  const getBestAvailable = (position: string, limit: number = 5) => {
    return players
      .filter(player => !player.isDrafted && (position === 'ALL' || player.position === position))
      .sort((a, b) => a.rank - b.rank)
      .slice(0, limit);
  };

  const allPositions = ['QB', 'RB', 'WR', 'TE'];
  
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-100 text-red-800 border-red-200';
      case 'RB': return 'bg-green-100 text-green-800 border-green-200';
      case 'WR': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  const renderPlayerCard = (player: Player, showQuickDraft: boolean = false) => (
    <div key={player.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
            {player.rank}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded border ${getPositionColor(player.position)}`}>
            {player.position}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded border ${getTierColor(player.tier)}`}>
            T{player.tier}
          </span>
          <div>
            <h4 className="font-medium text-gray-900">{player.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{player.team}</span>
              <span>•</span>
              <span>Age {player.age}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {player.notes && (
            <div className="text-xs text-gray-500 max-w-xs text-right mr-2">
              {player.notes}
            </div>
          )}
          {showQuickDraft && (
            <button
              onClick={() => onDraftPlayer(player.id)}
              className={`px-3 py-1 text-xs rounded font-medium ${
                currentPickInfo?.isYourPick
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentPickInfo?.isYourPick ? 'Draft!' : 'Draft'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (selectedPosition !== 'ALL') {
    const positionPlayers = getBestAvailable(selectedPosition, 10);
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Best Available {selectedPosition}s</h2>
              <p className="text-gray-600">Top available players at {selectedPosition} position</p>
            </div>
            <div>
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
          </div>
        </div>

        {/* Position Players */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-3">
            {positionPlayers.length > 0 ? (
              positionPlayers.map(player => renderPlayerCard(player, true))
            ) : (
              <p className="text-center text-gray-500 py-8">No available {selectedPosition}s remaining</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Best Available Players</h2>
            <p className="text-gray-600">Top available players by position for quick reference</p>
          </div>
          <div>
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
        </div>
      </div>

      {/* Overall Best Available */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Top 10 Overall</h3>
        <div className="space-y-3">
          {getBestAvailable('ALL', 10).map(player => renderPlayerCard(player, true))}
        </div>
      </div>

      {/* Best by Position */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allPositions.map(position => {
          const bestAtPosition = getBestAvailable(position, 5);
          if (bestAtPosition.length === 0) return null;
          
          return (
            <div key={position} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded border ${getPositionColor(position)}`}>
                  {position}
                </span>
                <h3 className="text-lg font-bold text-gray-900">Best Available</h3>
              </div>
              <div className="space-y-3">
                {bestAtPosition.map(player => renderPlayerCard(player))}
              </div>
              {bestAtPosition.length >= 5 && (
                <button
                  onClick={() => setSelectedPosition(position)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all {position}s →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Draft Strategy Tips */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Quick Strategy Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">🏈 Superflex Priority</h4>
            <p className="text-sm text-red-700">
              QBs are premium in superflex. Target elite QBs early even if other positions seem like better value.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📈 Dynasty Value</h4>
            <p className="text-sm text-blue-700">
              Prioritize youth over production. A 23-year-old WR2 is often better than a 28-year-old WR1.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">🎯 Positional Strategy</h4>
            <p className="text-sm text-green-700">
              Build depth at WR (longest careers), be selective with RBs (shortest careers), secure 3+ QBs.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">⚡ Tier Breaks</h4>
            <p className="text-sm text-yellow-700">
              Don't reach for need. If there's a big tier break, consider trading back or pivoting positions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestAvailable;