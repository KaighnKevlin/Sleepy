import React from 'react';
import { getPlayerADP, getValueRating, isNearTierBreak, getTierBreaks } from '../data/adp';

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

interface AdvancedAnalyticsProps {
  players: Player[];
  currentPick: number;
  onPlayerSelect?: (playerId: string) => void;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ players, currentPick, onPlayerSelect }) => {
  // Get available players with ADP analysis
  const availablePlayers = players
    .filter(player => !player.isDrafted)
    .map(player => {
      const adpData = getPlayerADP(player.id);
      const valueRating = adpData ? getValueRating(currentPick, adpData.adp) : 'fair';
      return {
        ...player,
        adpData,
        valueRating,
        isNearTierBreak: isNearTierBreak(player.position, player.rank)
      };
    })
    .sort((a, b) => a.rank - b.rank);

  // Get value picks (steals and good values available now)
  const valuePicks = availablePlayers
    .filter(p => p.valueRating === 'steal' || p.valueRating === 'value')
    .slice(0, 5);

  // Get tier break warnings
  const tierBreakWarnings = availablePlayers
    .filter(p => p.isNearTierBreak)
    .slice(0, 3);

  // Get position rankings
  const positionRankings = ['QB', 'RB', 'WR', 'TE'].map(position => {
    const positionPlayers = availablePlayers
      .filter(p => p.position === position)
      .slice(0, 3);
    return { position, players: positionPlayers };
  });

  const getValueColor = (rating: string) => {
    switch (rating) {
      case 'steal': return 'bg-green-100 text-green-800 border-green-200';
      case 'value': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'reach': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'major-reach': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getValueLabel = (rating: string) => {
    switch (rating) {
      case 'steal': return 'STEAL';
      case 'value': return 'VALUE';
      case 'fair': return 'FAIR';
      case 'reach': return 'REACH';
      case 'major-reach': return 'MAJOR REACH';
      default: return 'FAIR';
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

  const renderPlayerRow = (player: any, showADP: boolean = true) => (
    <div 
      key={player.id} 
      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
        onPlayerSelect ? 'hover:border-blue-300' : ''
      }`}
      onClick={() => onPlayerSelect?.(player.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
            {player.rank}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded border ${getPositionColor(player.position)}`}>
            {player.position}
          </span>
          <div>
            <h4 className="font-medium text-gray-900">{player.name}</h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{player.team}</span>
              {showADP && player.adpData && (
                <>
                  <span>•</span>
                  <span>ADP: {player.adpData.adp.toFixed(1)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {player.isNearTierBreak && (
            <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
              TIER BREAK
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded border ${getValueColor(player.valueRating)}`}>
            {getValueLabel(player.valueRating)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Advanced Draft Analytics</h2>
        <p className="text-gray-600">ADP comparisons, value ratings, and tier break analysis</p>
        <div className="mt-4 text-sm text-gray-500">
          <span className="font-medium">Pick #{currentPick}</span> • Round {Math.ceil(currentPick / 12)}
        </div>
      </div>

      {/* Value Alerts */}
      {valuePicks.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900">🎯 Value Opportunities</h3>
          <div className="space-y-3">
            {valuePicks.map(player => renderPlayerRow(player))}
          </div>
        </div>
      )}

      {/* Tier Break Warnings */}
      {tierBreakWarnings.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900">⚠️ Tier Break Alerts</h3>
          <p className="text-sm text-gray-600 mb-4">
            These players are near major tier breaks. Consider drafting before the talent drop-off.
          </p>
          <div className="space-y-3">
            {tierBreakWarnings.map(player => renderPlayerRow(player))}
          </div>
        </div>
      )}

      {/* Position Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {positionRankings.map(({ position, players: posPlayers }) => {
          if (posPlayers.length === 0) return null;
          
          const tierBreaks = getTierBreaks().find(tb => tb.position === position);
          const nextTierBreak = tierBreaks?.breaks.find(breakPoint => {
            const currentPositionRank = players.filter(p => 
              p.position === position && !p.isDrafted
            ).length;
            return breakPoint > currentPositionRank;
          });
          
          return (
            <div key={position} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded border ${getPositionColor(position)}`}>
                    {position}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">Top Available</h3>
                </div>
                {nextTierBreak && (
                  <div className="text-xs text-gray-500">
                    Next tier break: {position}{nextTierBreak}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {posPlayers.map(player => renderPlayerRow(player))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADP Legend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">📊 Value Rating Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="font-medium text-green-800 text-sm">STEAL</div>
            <div className="text-xs text-green-700">1+ rounds later than ADP</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-800 text-sm">VALUE</div>
            <div className="text-xs text-blue-700">0.5+ rounds later than ADP</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="font-medium text-gray-800 text-sm">FAIR</div>
            <div className="text-xs text-gray-700">Within 0.5 rounds of ADP</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="font-medium text-orange-800 text-sm">REACH</div>
            <div className="text-xs text-orange-700">0.5-1 rounds early</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="font-medium text-red-800 text-sm">MAJOR REACH</div>
            <div className="text-xs text-red-700">1+ rounds early</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;