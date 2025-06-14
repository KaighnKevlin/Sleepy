import React, { useState } from 'react';
import { apiService } from '../services/api';
import { League, User } from '../types/api';

const UserLookup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUserLeagues(username.trim());
      setUser(data.user);
      setLeagues(data.leagues);
    } catch (err) {
      setError('User not found or has no leagues');
      setUser(null);
      setLeagues([]);
      console.error('Error fetching user leagues:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">User Lookup</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Sleeper username..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {user && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-medium text-lg">
                {user.display_name?.[0] || user.username[0]}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {user.display_name || user.username}
              </h3>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>
        </div>
      )}

      {leagues.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">
            Leagues ({leagues.length})
          </h3>
          <div className="space-y-3">
            {leagues.map((league) => (
              <div key={league.league_id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{league.name}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>Season: {league.season}</span>
                      <span>Teams: {league.total_rosters}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // TODO: Navigate to roster view
                      alert(`View roster for ${league.name} (League ID: ${league.league_id})`);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    View Roster
                  </button>
                </div>
                
                {/* Show roster positions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(league.roster_positions).map(([position, count]) => (
                    <span
                      key={position}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {count}x {position}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user && leagues.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No leagues found for this user
        </div>
      )}
    </div>
  );
};

export default UserLookup;