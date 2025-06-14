import React, { useState } from 'react';
import { evaluateTrade, getPickValue, getTradeEquivalents, formatPickName, pickValues } from '../data/pickValues';

const TradeCalculator: React.FC = () => {
  const [givenPicks, setGivenPicks] = useState<number[]>([]);
  const [receivedPicks, setReceivedPicks] = useState<number[]>([]);
  const [selectedPick, setSelectedPick] = useState<number>(8); // Your first pick
  const [showEquivalents, setShowEquivalents] = useState<boolean>(false);

  const addPick = (picks: number[], setPicks: (picks: number[]) => void, pick: number) => {
    if (!picks.includes(pick)) {
      setPicks([...picks, pick].sort((a, b) => a - b));
    }
  };

  const removePick = (picks: number[], setPicks: (picks: number[]) => void, pick: number) => {
    setPicks(picks.filter(p => p !== pick));
  };

  const clearAll = () => {
    setGivenPicks([]);
    setReceivedPicks([]);
  };

  const trade = evaluateTrade(givenPicks, receivedPicks);
  const equivalents = getTradeEquivalents(selectedPick);

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'accept': return 'bg-green-100 text-green-800 border-green-200';
      case 'reject': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderPickList = (picks: number[], setPicks: (picks: number[]) => void, title: string, bgColor: string) => (
    <div className={`p-4 ${bgColor} rounded-lg border`}>
      <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
      <div className="space-y-2 mb-3">
        {picks.length === 0 ? (
          <div className="text-gray-500 text-sm italic">No picks selected</div>
        ) : (
          picks.map(pick => (
            <div key={pick} className="flex items-center justify-between p-2 bg-white rounded border">
              <div>
                <span className="font-medium">{formatPickName(pick)}</span>
                <span className="text-sm text-gray-500 ml-2">(Overall #{pick})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{getPickValue(pick).toLocaleString()}</span>
                <button
                  onClick={() => removePick(picks, setPicks, pick)}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Quick add buttons for common picks */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700">Quick Add:</div>
        <div className="flex flex-wrap gap-1">
          {[8, 20, 32, 44, 56, 68, 80].map(pick => (
            <button
              key={pick}
              onClick={() => addPick(picks, setPicks, pick)}
              disabled={picks.includes(pick)}
              className={`px-2 py-1 text-xs rounded border ${
                picks.includes(pick) 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {formatPickName(pick)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Draft Pick Trade Calculator</h2>
        <p className="text-gray-600">Evaluate draft pick trades using dynasty superflex values</p>
      </div>

      {/* Trade Input */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderPickList(givenPicks, setGivenPicks, "Picks You Give Up", "bg-red-50 border-red-200")}
          {renderPickList(receivedPicks, setReceivedPicks, "Picks You Receive", "bg-green-50 border-green-200")}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <select
              value=""
              onChange={(e) => {
                const pick = parseInt(e.target.value);
                if (pick) {
                  // Default to "given" - user can move it
                  addPick(givenPicks, setGivenPicks, pick);
                }
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Add a pick...</option>
              {pickValues.slice(0, 60).map(pick => (
                <option key={pick.pick} value={pick.pick}>
                  {formatPickName(pick.pick)} (#{pick.pick}) - {pick.superflexValue.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={clearAll}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Trade Analysis */}
      {(givenPicks.length > 0 || receivedPicks.length > 0) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Trade Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-800">{trade.givenValue.toLocaleString()}</div>
              <div className="text-sm text-red-600">Value Given Up</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{trade.receivedValue.toLocaleString()}</div>
              <div className="text-sm text-green-600">Value Received</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${trade.difference >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                {trade.difference >= 0 ? '+' : ''}{trade.difference.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Net Value</div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${getRecommendationColor(trade.recommendation)}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg capitalize">{trade.recommendation}</div>
                <div className="text-sm">{trade.analysis}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">Value Change:</div>
                <div className={`font-bold ${trade.difference >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {((trade.difference / Math.max(trade.givenValue, 1)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pick Equivalents */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Pick Trade Equivalents</h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Show equivalents for:</label>
            <select
              value={selectedPick}
              onChange={(e) => setSelectedPick(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {[8, 20, 32, 44, 56, 68, 80, 92].map(pick => (
                <option key={pick} value={pick}>
                  {formatPickName(pick)} (#{pick})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-900">
              {formatPickName(selectedPick)} (#{selectedPick}) = {getPickValue(selectedPick).toLocaleString()} points
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equivalents.slice(0, 8).map((equiv, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {equiv.picks.map(p => formatPickName(p)).join(' + ')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {equiv.picks.map(p => `#${p}`).join(' + ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{equiv.value.toLocaleString()}</div>
                  <div className={`text-xs ${
                    equiv.value > getPickValue(selectedPick) ? 'text-green-600' : 
                    equiv.value < getPickValue(selectedPick) ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {equiv.value > getPickValue(selectedPick) ? '+' : ''}
                    {(equiv.value - getPickValue(selectedPick)).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Pick Value Reference</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Round</th>
                <th className="text-left py-2">Early (1-4)</th>
                <th className="text-left py-2">Middle (5-8)</th>
                <th className="text-left py-2">Late (9-12)</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(round => (
                <tr key={round} className="border-b">
                  <td className="py-2 font-medium">Round {round}</td>
                  {[1, 5, 9].map(startPick => {
                    const pick = (round - 1) * 12 + startPick;
                    const endPick = Math.min(pick + 3, (round - 1) * 12 + 12);
                    const pickRange = `${formatPickName(pick)}-${formatPickName(endPick)}`;
                    const value = getPickValue(pick);
                    return (
                      <td key={startPick} className="py-2">
                        <div>{pickRange}</div>
                        <div className="text-gray-500">{value.toLocaleString()}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeCalculator;