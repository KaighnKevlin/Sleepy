#!/usr/bin/env python
"""
Test script to verify Sleeper API integration
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sleepy_backend.settings')
django.setup()

from core.services import SleeperAPIService

def test_sleeper_api():
    """Test basic Sleeper API functionality"""
    api = SleeperAPIService()
    
    print("=== Testing Sleeper API Integration ===\n")
    
    # Test 1: Get NFL state
    print("1. Testing get_nfl_state()...")
    nfl_state = api.get_nfl_state()
    if nfl_state:
        print(f"✅ Current NFL Season: {nfl_state.get('season')}")
        print(f"✅ Current Week: {nfl_state.get('week')}")
        print(f"✅ Season Type: {nfl_state.get('season_type')}")
    else:
        print("❌ Failed to get NFL state")
    
    print()
    
    # Test 2: Get trending players
    print("2. Testing get_trending_players()...")
    trending = api.get_trending_players(add_drop="add", limit=5)
    if trending:
        print(f"✅ Got {len(trending)} trending players (adds)")
        for i, player in enumerate(trending[:3]):
            print(f"   {i+1}. Player ID: {player.get('player_id')}")
    else:
        print("❌ Failed to get trending players")
    
    print()
    
    # Test 3: Try to get a sample user (this might fail if user doesn't exist)
    print("3. Testing get_user() with sample username...")
    sample_user = api.get_user("sleeper")  # Official sleeper account
    if sample_user:
        print(f"✅ Found user: {sample_user.get('username')}")
        print(f"✅ Display name: {sample_user.get('display_name')}")
        print(f"✅ User ID: {sample_user.get('user_id')}")
    else:
        print("❌ Failed to get sample user")
    
    print()
    
    # Test 4: Test players endpoint (this might be large, so we'll just check if it returns data)
    print("4. Testing get_players_nfl() (checking if endpoint responds)...")
    try:
        players = api.get_players_nfl()
        if players and isinstance(players, dict):
            player_count = len(players)
            print(f"✅ Got {player_count} NFL players")
            
            # Show a few sample players
            sample_players = list(players.items())[:3]
            for player_id, player_data in sample_players:
                name = f"{player_data.get('first_name', '')} {player_data.get('last_name', '')}"
                position = player_data.get('position', 'N/A')
                team = player_data.get('team', 'N/A')
                print(f"   Sample: {name} ({position} - {team})")
        else:
            print("❌ Failed to get players data")
    except Exception as e:
        print(f"❌ Error testing players endpoint: {e}")
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    test_sleeper_api()