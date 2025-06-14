#!/usr/bin/env python
"""
Test script for the Roster Viewer API endpoints
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8001/api"

def test_endpoint(url, description):
    """Test an API endpoint and print results"""
    print(f"\n=== {description} ===")
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS")
            print(json.dumps(data, indent=2)[:500] + "..." if len(str(data)) > 500 else json.dumps(data, indent=2))
        else:
            print("❌ ERROR")
            print(f"Response: {response.text}")
    except requests.RequestException as e:
        print(f"❌ REQUEST FAILED: {e}")

def main():
    print("=== Testing Sleepy API Endpoints ===")
    
    # Test health check
    test_endpoint(f"{BASE_URL}/health/", "Health Check")
    
    # Test trending players
    test_endpoint(f"{BASE_URL}/sleeper/trending/?limit=3", "Trending Players")
    
    # Test with a real Sleeper username (you can replace this)
    test_username = input("\nEnter a Sleeper username to test (or press Enter to skip): ").strip()
    
    if test_username:
        # Test user leagues
        test_endpoint(f"{BASE_URL}/sleeper/user/{test_username}/leagues/", f"User Leagues for '{test_username}'")
        
        # If user has leagues, we could test roster endpoint
        # For now, we'll just show how the endpoint would work
        print(f"\n=== Roster Endpoint Example ===")
        print(f"To test a user's roster, use:")
        print(f"{BASE_URL}/sleeper/user/{test_username}/league/[LEAGUE_ID]/roster/")
        print("(You need a valid league ID from the leagues response)")
    
    print("\n=== API Testing Complete ===")
    print("\nAvailable Endpoints:")
    print("- GET /api/health/")
    print("- GET /api/sleeper/user/<username>/leagues/")
    print("- GET /api/sleeper/user/<username>/league/<league_id>/roster/")
    print("- GET /api/sleeper/trending/")
    print("- GET /api/users/")
    print("- GET /api/leagues/")
    print("- GET /api/players/")
    print("- GET /api/rosters/")

if __name__ == "__main__":
    main()