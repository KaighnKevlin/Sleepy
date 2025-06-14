import React, { useState, useEffect } from 'react';
import { LEAGUE_CONFIG } from '../config/league';
import { apiService } from '../services/api';
import { Player, LeagueRosterResponse } from '../types/api';

const MyLeague: React.FC = () => {
  const [rosterData, setRosterData] = useState<LeagueRosterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyRoster = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the hardcoded league config
        const data = await apiService.getLeagueRoster('kaighn', LEAGUE_CONFIG.league_id);
        setRosterData(data);
      } catch (err) {
        setError('Failed to load your roster');
        console.error('Error fetching roster:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRoster();
  }, []);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-100 text-red-800 border-red-200';
      case 'RB': return 'bg-green-100 text-green-800 border-green-200';
      case 'WR': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'K': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DEF': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderPlayer = (player: Player, isStarter: boolean = false) => (
    <div 
      key={player.player_id} 
      className={`p-3 rounded-lg border ${isStarter ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 text-xs font-medium rounded border ${getPositionColor(player.position)}`}>
            {player.position}
          </span>
          <div>
            <h4 className="font-medium text-gray-900">{player.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {player.team && <span className="font-medium">{player.team}</span>}
              {player.injury_status && (
                <span className="text-red-600 text-xs">{player.injury_status}</span>
              )}
            </div>
          </div>
        </div>
        {isStarter && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            STARTER
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 text-center py-4">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!rosterData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No roster data available</p>
      </div>
    );
  }

  const { user, league, roster } = rosterData;

  return (
    <div className="space-y-6">
      {/* League Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{league.name}</h1>
            <p className="text-gray-600">Season {league.season} • Dynasty League</p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>12 Teams</span>
              <span>1 PPR</span>
              <span>Superflex</span>
              <span>Double Flex</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">{user.display_name}</p>
            <p className="text-gray-600">Roster {roster.roster_id}</p>
            <p className="text-sm text-gray-500">{roster.total_players} players</p>
          </div>
        </div>
      </div>

      {/* Roster Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Starting Lineup */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Starting Lineup</h2>
          <div className="space-y-3">
            {roster.starters.length > 0 ? (
              roster.starters.map(player => renderPlayer(player, true))
            ) : (
              <p className="text-gray-500 text-center py-8">No starters set</p>
            )}
          </div>
        </div>

        {/* Bench */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            Bench ({roster.players.length - roster.starters.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {roster.players
              .filter(player => !roster.starters.find(starter => starter.player_id === player.player_id))
              .map(player => renderPlayer(player, false))
            }
          </div>
        </div>
      </div>

      {/* Roster Composition */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Roster Composition</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['QB', 'RB', 'WR', 'TE', 'K', 'DEF'].map(position => {
            const count = roster.players.filter(player => player.position === position).length;
            return (
              <div key={position} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-sm font-medium ${getPositionColor(position)}`}>
                  {count}
                </div>
                <p className="text-sm font-medium text-gray-900">{position}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyLeague;