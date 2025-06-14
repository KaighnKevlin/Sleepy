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
  draftedBy?: string;
  draftRound?: number;
  draftPick?: number;
}

interface DraftHistoryProps {
  players: Player[];
  currentPick: number;
  totalTeams: number;
  totalRounds: number;
}

const DraftHistory: React.FC<DraftHistoryProps> = ({ players, currentPick, totalTeams, totalRounds }) => {
  const [viewMode, setViewMode] = useState<'picks' | 'rosters'>('picks');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  // Team names for Dynasty Warriors league
  const teamNames = {
    1: 'Team 1', 2: 'Team 2', 3: 'Team 3', 4: 'Team 4',
    5: 'Team 5', 6: 'Team 6', 7: 'Team 7', 8: 'You (Team 8)',
    9: 'Team 9', 10: 'Team 10', 11: 'Team 11', 12: 'Team 12'
  };

  // Get all drafted players sorted by draft order
  const draftedPlayers = players
    .filter(player => player.isDrafted && player.draftPick)
    .sort((a, b) => (a.draftPick || 0) - (b.draftPick || 0));

  // Create draft grid (rounds x teams)
  const createDraftGrid = () => {
    const grid: (Player | null)[][] = [];
    
    for (let round = 1; round <= totalRounds; round++) {
      const roundPicks: (Player | null)[] = [];
      
      for (let team = 1; team <= totalTeams; team++) {
        // Snake draft logic
        const pickPosition = round % 2 === 1 ? team : (totalTeams + 1 - team);
        const overallPick = (round - 1) * totalTeams + pickPosition;
        
        const player = draftedPlayers.find(p => p.draftPick === overallPick);
        roundPicks[pickPosition - 1] = player || null;
      }
      
      grid.push(roundPicks);
    }
    
    return grid;
  };

  // Get team rosters
  const getTeamRoster = (teamNumber: number) => {
    const teamPicks = draftedPlayers.filter(player => {
      if (!player.draftPick) return false;
      
      const round = Math.ceil(player.draftPick / totalTeams);
      const pickInRound = ((player.draftPick - 1) % totalTeams) + 1;
      const teamForPick = round % 2 === 1 ? pickInRound : (totalTeams + 1 - pickInRound);
      
      return teamForPick === teamNumber;
    });
    
    return teamPicks.sort((a, b) => (a.draftPick || 0) - (b.draftPick || 0));
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

  const getTeamColor = (teamNumber: number) => {
    if (teamNumber === 8) return 'bg-green-50 border-green-200'; // Your team
    return 'bg-gray-50 border-gray-200';
  };

  const isCurrentPick = (round: number, position: number) => {
    const overallPick = (round - 1) * totalTeams + position;
    return overallPick === currentPick;
  };

  const renderPickCell = (player: Player | null, round: number, position: number) => {
    const isYourPick = isCurrentPick(round, position);
    const isEmpty = !player;
    
    return (
      <div 
        key={`${round}-${position}`}
        className={`p-2 border text-xs min-h-[60px] ${
          isYourPick 
            ? 'bg-blue-100 border-blue-300 border-2' 
            : isEmpty 
              ? 'bg-gray-50 border-gray-200' 
              : 'bg-white border-gray-200'
        }`}
      >
        {isEmpty ? (
          isYourPick ? (
            <div className="text-center text-blue-700 font-medium">
              YOUR PICK
              <div className="text-xs text-blue-600">#{currentPick}</div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              #{(round - 1) * totalTeams + position}
            </div>
          )
        ) : (
          <div>
            <div className="font-medium text-gray-900 truncate">{player.name}</div>
            <div className="flex items-center space-x-1 mt-1">
              <span className={`px-1 py-0.5 text-xs rounded ${getPositionColor(player.position)}`}>
                {player.position}
              </span>
              <span className="text-gray-500">{player.team}</span>
            </div>
            <div className="text-gray-400 mt-1">#{player.draftPick}</div>
          </div>
        )}
      </div>
    );
  };

  const renderRosterView = () => {
    if (selectedTeam === null) {
      // Team selection grid
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Select a Team to View Roster</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: totalTeams }, (_, i) => i + 1).map(teamNumber => {
              const roster = getTeamRoster(teamNumber);
              const positionCounts = roster.reduce((counts, player) => {
                counts[player.position] = (counts[player.position] || 0) + 1;
                return counts;
              }, {} as Record<string, number>);
              
              return (
                <div 
                  key={teamNumber}
                  className={`p-4 border rounded-lg cursor-pointer hover:shadow-md ${getTeamColor(teamNumber)}`}
                  onClick={() => setSelectedTeam(teamNumber)}
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {teamNames[teamNumber as keyof typeof teamNames]}
                  </h4>
                  <div className="text-sm text-gray-600">
                    <div>Players: {roster.length}</div>
                    <div className="mt-1 space-y-1">
                      {Object.entries(positionCounts).map(([pos, count]) => (
                        <div key={pos} className="flex justify-between">
                          <span>{pos}:</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Individual team roster view
    const roster = getTeamRoster(selectedTeam);
    const positionGroups = roster.reduce((groups, player) => {
      if (!groups[player.position]) groups[player.position] = [];
      groups[player.position].push(player);
      return groups;
    }, {} as Record<string, Player[]>);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {teamNames[selectedTeam as keyof typeof teamNames]} Roster
            </h3>
            <button
              onClick={() => setSelectedTeam(null)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to all teams
            </button>
          </div>
          
          <div className="mb-4 text-sm text-gray-600">
            {roster.length} players drafted
          </div>

          {['QB', 'RB', 'WR', 'TE'].map(position => {
            const positionPlayers = positionGroups[position] || [];
            if (positionPlayers.length === 0) return null;
            
            return (
              <div key={position} className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded border ${getPositionColor(position)}`}>
                    {position}
                  </span>
                  <span>({positionPlayers.length})</span>
                </h4>
                <div className="space-y-2">
                  {positionPlayers.map(player => (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                          {player.draftPick}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-500">{player.team} • Age {player.age}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Round {player.draftRound}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (viewMode === 'rosters') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Team Rosters</h2>
            <button
              onClick={() => setViewMode('picks')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Draft Grid →
            </button>
          </div>
        </div>
        {renderRosterView()}
      </div>
    );
  }

  const draftGrid = createDraftGrid();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Draft History</h2>
            <p className="text-gray-600">Complete draft grid showing all picks</p>
          </div>
          <button
            onClick={() => setViewMode('rosters')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View Team Rosters →
          </button>
        </div>
      </div>

      {/* Draft Grid */}
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header row with team numbers */}
          <div className="grid grid-cols-12 gap-1 mb-2">
            {Array.from({ length: totalTeams }, (_, i) => i + 1).map(teamNumber => (
              <div key={teamNumber} className={`p-2 text-center text-sm font-medium border ${getTeamColor(teamNumber)}`}>
                {teamNumber === 8 ? 'YOU' : `T${teamNumber}`}
              </div>
            ))}
          </div>

          {/* Draft rounds */}
          {draftGrid.slice(0, Math.min(10, totalRounds)).map((round, roundIndex) => (
            <div key={roundIndex} className="mb-1">
              <div className="flex items-center mb-1">
                <div className="w-12 text-sm font-medium text-gray-600">R{roundIndex + 1}</div>
                <div className="grid grid-cols-12 gap-1 flex-1">
                  {round.map((player, position) => renderPickCell(player, roundIndex + 1, position + 1))}
                </div>
              </div>
            </div>
          ))}

          {totalRounds > 10 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing first 10 rounds. {totalRounds - 10} more rounds in progress...
            </div>
          )}
        </div>
      </div>

      {/* Draft Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Draft Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{draftedPlayers.length}</div>
            <div className="text-sm text-gray-500">Total Picks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{Math.ceil(currentPick / totalTeams)}</div>
            <div className="text-sm text-gray-500">Current Round</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalTeams * totalRounds - currentPick + 1}</div>
            <div className="text-sm text-gray-500">Picks Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {((draftedPlayers.length / (totalTeams * totalRounds)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftHistory;