import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Player } from '../types/api';

interface TrendingPlayersProps {
  type?: 'add' | 'drop';
  limit?: number;
}

const TrendingPlayers: React.FC<TrendingPlayersProps> = ({ 
  type = 'add', 
  limit = 10 
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getTrendingPlayers(type, 12, limit);
        setPlayers(data.players);
      } catch (err) {
        setError('Failed to fetch trending players');
        console.error('Error fetching trending players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPlayers();
  }, [type, limit]);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-100 text-red-800';
      case 'RB': return 'bg-green-100 text-green-800';
      case 'WR': return 'bg-blue-100 text-blue-800';
      case 'TE': return 'bg-yellow-100 text-yellow-800';
      case 'K': return 'bg-purple-100 text-purple-800';
      case 'DEF': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Trending {type === 'add' ? 'Adds' : 'Drops'}</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Trending {type === 'add' ? 'Adds' : 'Drops'}</h2>
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className={`w-3 h-3 rounded-full mr-2 ${type === 'add' ? 'bg-green-500' : 'bg-red-500'}`}></span>
        Trending {type === 'add' ? 'Adds' : 'Drops'}
      </h2>
      
      <div className="space-y-3">
        {players.map((player, index) => (
          <div key={player.player_id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                {index + 1}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{player.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPositionColor(player.position)}`}>
                    {player.position}
                  </span>
                  {player.team && (
                    <span className="text-sm text-gray-500 font-medium">{player.team}</span>
                  )}
                </div>
                {player.injury_status && (
                  <span className="text-xs text-red-600">{player.injury_status}</span>
                )}
              </div>
            </div>
            
            {player.count && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{player.count}</div>
                <div className="text-xs text-gray-500">{type}s</div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {players.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No trending players found
        </div>
      )}
    </div>
  );
};

export default TrendingPlayers;