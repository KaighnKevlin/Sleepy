import requests
from django.conf import settings
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class SleeperAPIService:
    """Service class for interacting with the Sleeper API"""
    
    def __init__(self):
        self.base_url = settings.SLEEPER_API_BASE_URL
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Sleepy Fantasy Helper/1.0',
            'Accept': 'application/json',
        })
    
    def _make_request(self, endpoint: str) -> Optional[Dict]:
        """Make a GET request to the Sleeper API"""
        url = f"{self.base_url}{endpoint}"
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error making request to {url}: {e}")
            return None
    
    def get_user(self, username_or_user_id: str) -> Optional[Dict]:
        """Get user information by username or user ID"""
        return self._make_request(f"/user/{username_or_user_id}")
    
    def get_user_leagues(self, user_id: str, season: str = "2024") -> Optional[List[Dict]]:
        """Get all leagues for a user in a given season"""
        return self._make_request(f"/user/{user_id}/leagues/nfl/{season}")
    
    def get_league(self, league_id: str) -> Optional[Dict]:
        """Get league information"""
        return self._make_request(f"/league/{league_id}")
    
    def get_league_users(self, league_id: str) -> Optional[List[Dict]]:
        """Get all users in a league"""
        return self._make_request(f"/league/{league_id}/users")
    
    def get_league_rosters(self, league_id: str) -> Optional[List[Dict]]:
        """Get all rosters in a league"""
        return self._make_request(f"/league/{league_id}/rosters")
    
    def get_league_transactions(self, league_id: str, week: int = None) -> Optional[List[Dict]]:
        """Get transactions for a league (trades, waivers, etc.)"""
        endpoint = f"/league/{league_id}/transactions"
        if week:
            endpoint += f"/{week}"
        return self._make_request(endpoint)
    
    def get_players_nfl(self) -> Optional[Dict]:
        """Get all NFL players"""
        return self._make_request("/players/nfl")
    
    def get_nfl_state(self) -> Optional[Dict]:
        """Get current NFL state (week, season, etc.)"""
        return self._make_request("/state/nfl")
    
    def get_league_matchups(self, league_id: str, week: int) -> Optional[List[Dict]]:
        """Get matchups for a specific week"""
        return self._make_request(f"/league/{league_id}/matchups/{week}")
    
    def get_trending_players(self, sport: str = "nfl", add_drop: str = "add", 
                           hours: int = 12, limit: int = 25) -> Optional[List[Dict]]:
        """Get trending players (adds/drops)"""
        return self._make_request(
            f"/players/{sport}/trending/{add_drop}?lookback_hours={hours}&limit={limit}"
        )


class SleeperDataService:
    """Service for processing and storing Sleeper data"""
    
    def __init__(self):
        self.api = SleeperAPIService()
    
    def sync_user_leagues(self, sleeper_user_id: str, season: str = "2024") -> List[Dict]:
        """Sync all leagues for a user from Sleeper API"""
        leagues_data = self.api.get_user_leagues(sleeper_user_id, season)
        if not leagues_data:
            return []
        
        synced_leagues = []
        for league_data in leagues_data:
            # Here you would typically save to database
            # For now, just return the data
            synced_leagues.append(league_data)
        
        return synced_leagues
    
    def sync_league_rosters(self, league_id: str) -> List[Dict]:
        """Sync all rosters for a league"""
        rosters_data = self.api.get_league_rosters(league_id)
        if not rosters_data:
            return []
        
        # Here you would process and save roster data
        return rosters_data
    
    def sync_players(self) -> Dict:
        """Sync all NFL players from Sleeper"""
        players_data = self.api.get_players_nfl()
        if not players_data:
            return {}
        
        # Here you would process and save player data
        return players_data
    
    def get_user_roster_summary(self, sleeper_user_id: str, league_id: str) -> Optional[Dict]:
        """Get a summary of user's roster in a specific league"""
        rosters = self.api.get_league_rosters(league_id)
        if not rosters:
            return None
        
        # Find user's roster
        user_roster = None
        for roster in rosters:
            if roster.get('owner_id') == sleeper_user_id:
                user_roster = roster
                break
        
        if not user_roster:
            return None
        
        return {
            'roster_id': user_roster.get('roster_id'),
            'players': user_roster.get('players', []),
            'starters': user_roster.get('starters', []),
            'settings': user_roster.get('settings', {}),
            'metadata': user_roster.get('metadata', {})
        }