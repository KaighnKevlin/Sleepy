import React, { useState } from 'react';
import TrendingPlayers from './components/TrendingPlayers';
import UserLookup from './components/UserLookup';
import MyLeague from './components/MyLeague';
import DraftPrep from './components/DraftPrep';
import DraftBoard from './components/DraftBoard';
import { LEAGUE_CONFIG } from './config/league';

function App() {
  const [activeTab, setActiveTab] = useState<'my-league' | 'draft-prep' | 'draft-board' | 'trending' | 'lookup'>('my-league');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Sleepy</h1>
              <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Fantasy Assistant
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {LEAGUE_CONFIG.league_name} • {LEAGUE_CONFIG.season}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-league')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-league'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My League
            </button>
            <button
              onClick={() => setActiveTab('draft-prep')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'draft-prep'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Draft Prep
            </button>
            <button
              onClick={() => setActiveTab('draft-board')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'draft-board'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Draft Board
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Trending Players
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lookup'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Lookup
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'my-league' && <MyLeague />}
        
        {activeTab === 'draft-prep' && <DraftPrep />}
        
        {activeTab === 'draft-board' && <DraftBoard />}
        
        {activeTab === 'trending' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TrendingPlayers type="add" limit={10} />
            <TrendingPlayers type="drop" limit={10} />
          </div>
        )}
        
        {activeTab === 'lookup' && (
          <div className="max-w-4xl mx-auto">
            <UserLookup />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>
              Built for dynasty fantasy football managers using{' '}
              <a href="https://sleeper.app" className="text-blue-600 hover:text-blue-800">
                Sleeper.io
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
