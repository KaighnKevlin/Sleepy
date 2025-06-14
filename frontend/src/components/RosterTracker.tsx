import React from 'react';

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  age: number;
  tier: number;
  rank: number;
  isDrafted: boolean;
  draftRound?: number;
  draftPick?: number;
}

interface RosterTrackerProps {
  draftedPlayers: Player[];
  currentRound: number;
  totalRounds: number;
}

const RosterTracker: React.FC<RosterTrackerProps> = ({ draftedPlayers, currentRound, totalRounds }) => {
  // Calculate position counts
  const positionCounts = draftedPlayers.reduce((counts, player) => {
    counts[player.position] = (counts[player.position] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Dynasty Superflex roster construction targets
  const rosterTargets = {
    QB: { early: 2, mid: 1, late: 1, total: 4, priority: 1 },
    RB: { early: 3, mid: 2, late: 2, total: 7, priority: 3 },
    WR: { early: 4, mid: 4, late: 4, total: 12, priority: 2 },
    TE: { early: 1, mid: 1, late: 1, total: 3, priority: 4 }
  };

  const getDraftPhase = (round: number) => {
    if (round <= 8) return 'early';
    if (round <= 16) return 'mid';
    return 'late';
  };

  const getPositionStatus = (position: string) => {
    const target = rosterTargets[position as keyof typeof rosterTargets];
    const current = positionCounts[position] || 0;
    const phase = getDraftPhase(currentRound);
    
    let phaseCurrent = 0;
    let phaseTarget = 0;
    
    // Calculate how many we should have by now
    if (phase === 'early') {
      phaseTarget = target.early;
    } else if (phase === 'mid') {
      phaseTarget = target.early + target.mid;
    } else {
      phaseTarget = target.total;
    }
    
    phaseCurrent = current;
    
    if (phaseCurrent >= phaseTarget) return 'on-track';
    if (phaseCurrent >= phaseTarget - 1) return 'close';
    return 'behind';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-50 border-green-200 text-green-800';
      case 'close': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'behind': return 'bg-red-50 border-red-200 text-red-800';
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

  const getNextPositionRecommendation = () => {
    const phase = getDraftPhase(currentRound);
    const recommendations = [];

    for (const [pos, target] of Object.entries(rosterTargets)) {
      const current = positionCounts[pos] || 0;
      let phaseTarget = 0;
      
      if (phase === 'early') {
        phaseTarget = target.early;
      } else if (phase === 'mid') {
        phaseTarget = target.early + target.mid;
      } else {
        phaseTarget = target.total;
      }
      
      if (current < phaseTarget) {
        recommendations.push({
          position: pos,
          priority: target.priority,
          deficit: phaseTarget - current,
          current,
          target: phaseTarget
        });
      }
    }
    
    return recommendations.sort((a, b) => {
      // Sort by deficit first (higher deficit = more urgent), then by priority
      if (a.deficit !== b.deficit) return b.deficit - a.deficit;
      return a.priority - b.priority;
    });
  };

  const recommendations = getNextPositionRecommendation();
  const totalDrafted = draftedPlayers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Roster Construction Tracker</h2>
            <p className="text-gray-600">Monitor your dynasty superflex roster building progress</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{totalDrafted}/26</div>
            <div className="text-sm text-gray-500">Players Drafted</div>
          </div>
        </div>
      </div>

      {/* Position Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Position Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(rosterTargets).map(([position, target]) => {
            const current = positionCounts[position] || 0;
            const status = getPositionStatus(position);
            const phase = getDraftPhase(currentRound);
            
            let phaseTarget = 0;
            if (phase === 'early') phaseTarget = target.early;
            else if (phase === 'mid') phaseTarget = target.early + target.mid;
            else phaseTarget = target.total;
            
            return (
              <div key={position} className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getPositionColor(position)}`}>
                    {position}
                  </span>
                  <span className="text-xs font-medium">
                    {status === 'on-track' ? '✓' : status === 'close' ? '!' : '⚠'}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{current}/{target.total}</div>
                  <div className="text-xs text-gray-600">
                    Target by Round {currentRound <= 8 ? '8' : currentRound <= 16 ? '16' : '26'}: {phaseTarget}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Next Pick Recommendations</h3>
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={rec.position} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-red-100 text-red-800' : 
                    index === 1 ? 'bg-orange-100 text-orange-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getPositionColor(rec.position)}`}>
                    {rec.position}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">
                      Need {rec.deficit} more {rec.position}{rec.deficit > 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      Currently {rec.current}/{rec.target} for this phase
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Priority #{rec.priority}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draft Strategy Guide */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Dynasty Superflex Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Early Rounds (1-8)</h4>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• Target 2 elite QBs (superflex premium)</li>
              <li>• Get 3-4 top WRs (longest careers)</li>
              <li>• Consider top-tier RBs if available</li>
              <li>• Grab elite TE if value is there</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Mid Rounds (9-16)</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Add 3rd QB for depth/bye weeks</li>
              <li>• Fill out WR corps with upside plays</li>
              <li>• Target young RBs with opportunity</li>
              <li>• Consider 2nd TE for flexibility</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Late Rounds (17-26)</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Handcuff RBs you own</li>
              <li>• Lottery ticket rookie WRs</li>
              <li>• Veteran QB as 4th option</li>
              <li>• High-upside developmental players</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Your Drafted Players */}
      {draftedPlayers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Your Draft ({totalDrafted} players)</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {draftedPlayers
              .sort((a, b) => (a.draftPick || 0) - (b.draftPick || 0))
              .map((player) => (
              <div key={player.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                    {player.draftPick}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getPositionColor(player.position)}`}>
                    {player.position}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">{player.name}</div>
                    <div className="text-xs text-gray-500">{player.team} • Age {player.age}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Round {player.draftRound}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterTracker;