import React, { useState, useEffect } from 'react';
import { liveDraftService, LiveDraftState, LiveDraftPick } from '../services/liveDraft';
import { LEAGUE_CONFIG } from '../config/league';

interface LiveDraftManagerProps {
  onDraftStateChange: (state: LiveDraftState) => void;
  onPicksUpdate: (picks: LiveDraftPick[]) => void;
}

const LiveDraftManager: React.FC<LiveDraftManagerProps> = ({ 
  onDraftStateChange, 
  onPicksUpdate 
}) => {
  const [draftState, setDraftState] = useState<LiveDraftState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const handleStateChange = (state: LiveDraftState) => {
      setDraftState(state);
      setIsConnected(true);
      setError(null);
      setLastUpdate(new Date());
      
      // Notify parent components
      onDraftStateChange(state);
      onPicksUpdate(state.picks);
    };

    // Subscribe to draft state changes
    liveDraftService.onStateChange(handleStateChange);

    // Start polling
    liveDraftService.startPolling(2000); // Poll every 2 seconds during draft

    return () => {
      liveDraftService.removeCallback(handleStateChange);
      liveDraftService.stopPolling();
    };
  }, [onDraftStateChange, onPicksUpdate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pre_draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'drafting': return 'bg-green-100 text-green-800 border-green-200';
      case 'complete': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pre_draft': return 'Pre-Draft';
      case 'drafting': return 'Live Draft';
      case 'complete': return 'Complete';
      case 'paused': return 'Paused';
      default: return status;
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <span className="text-red-600">❌</span>
          <div>
            <div className="font-medium text-red-800">Draft Connection Error</div>
            <div className="text-sm text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!draftState) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Connecting to live draft...</span>
        </div>
      </div>
    );
  }

  const yourTurnInfo = liveDraftService.getTimeToYourPick(draftState);
  const yourPicks = liveDraftService.getYourPicks(draftState);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(draftState.status)}`}>
            {formatStatus(draftState.status)}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        {lastUpdate && (
          <div className="text-xs text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Pick */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">#{draftState.currentPick}</div>
          <div className="text-sm text-gray-500">Current Pick</div>
        </div>

        {/* Your Turn Status */}
        <div className="text-center">
          {draftState.yourTurn ? (
            <div>
              <div className="text-2xl font-bold text-green-600">YOUR TURN!</div>
              <div className="text-sm text-green-600">You're on the clock</div>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold text-blue-600">{yourTurnInfo.picksAway}</div>
              <div className="text-sm text-gray-500">
                {yourTurnInfo.isNext ? 'You\'re next!' : `Picks until your turn`}
              </div>
            </div>
          )}
        </div>

        {/* Your Picks Count */}
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{yourPicks.length}</div>
          <div className="text-sm text-gray-500">Your Picks</div>
        </div>
      </div>

      {/* Draft Status Details */}
      {draftState.status === 'drafting' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700">
              🔴 LIVE: Round {Math.ceil(draftState.currentPick / 12)}
            </span>
            <span className="text-green-600">
              ⏱️ Est. {yourTurnInfo.estimatedMinutes}min to your turn
            </span>
          </div>
        </div>
      )}

      {/* Pre-draft Status */}
      {draftState.status === 'pre_draft' && draftState.nextPickTime && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="text-sm text-yellow-700">
            📅 Draft starts: {new Date(draftState.nextPickTime).toLocaleString()}
          </div>
        </div>
      )}

      {/* Recent Picks */}
      {draftState.picks.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Recent Picks</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {draftState.picks
              .slice(-5)
              .reverse()
              .map((pick, index) => (
                <div key={pick.pick_no} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">#{pick.pick_no}</span>
                    <span>{pick.player?.name || `Player ${pick.player_id}`}</span>
                    <span className="text-gray-500">({pick.player?.position})</span>
                  </div>
                  <div className="text-gray-500">
                    {pick.roster_id === LEAGUE_CONFIG.roster_id ? 'YOU' : `Team ${pick.roster_id}`}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDraftManager;