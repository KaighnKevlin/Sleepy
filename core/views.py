from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import SleeperUser, League, Player, TeamRoster, Trade, PlayerValue
from .serializers import (
    SleeperUserSerializer, LeagueSerializer, PlayerSerializer,
    TeamRosterSerializer, TradeSerializer, PlayerValueSerializer,
    RosterSummarySerializer, LeagueOverviewSerializer
)
from .services import SleeperAPIService, SleeperDataService


class SleeperUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SleeperUser.objects.all()
    serializer_class = SleeperUserSerializer


class LeagueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer


class PlayerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class TeamRosterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamRoster.objects.all()
    serializer_class = TeamRosterSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_leagues(request, sleeper_username):
    """Get all leagues for a Sleeper user"""
    api_service = SleeperAPIService()
    
    # First get the user
    user_data = api_service.get_user(sleeper_username)
    if not user_data:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    user_id = user_data.get('user_id')
    season = request.GET.get('season', '2024')
    
    # Get user's leagues
    leagues_data = api_service.get_user_leagues(user_id, season)
    if not leagues_data:
        return Response(
            {'error': 'No leagues found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Format the response
    leagues_overview = []
    for league_data in leagues_data:
        overview = {
            'league_id': league_data.get('league_id'),
            'name': league_data.get('name'),
            'season': league_data.get('season'),
            'total_rosters': league_data.get('total_rosters'),
            'roster_positions': league_data.get('roster_positions'),
            'scoring_settings': league_data.get('scoring_settings')
        }
        leagues_overview.append(overview)
    
    return Response({
        'user': {
            'user_id': user_data.get('user_id'),
            'username': user_data.get('username'),
            'display_name': user_data.get('display_name'),
            'avatar': user_data.get('avatar')
        },
        'leagues': leagues_overview
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_league_roster(request, sleeper_username, league_id):
    """Get user's roster in a specific league"""
    api_service = SleeperAPIService()
    data_service = SleeperDataService()
    
    # Get user info
    user_data = api_service.get_user(sleeper_username)
    if not user_data:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    user_id = user_data.get('user_id')
    
    # Get league info
    league_data = api_service.get_league(league_id)
    if not league_data:
        return Response(
            {'error': 'League not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get user's roster summary
    roster_summary = data_service.get_user_roster_summary(user_id, league_id)
    if not roster_summary:
        return Response(
            {'error': 'User roster not found in this league'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get player details for the roster
    players_data = api_service.get_players_nfl()
    roster_players = []
    starter_players = []
    
    if players_data:
        # Get details for all roster players
        for player_id in roster_summary.get('players', []):
            if player_id in players_data:
                player_info = players_data[player_id]
                player_detail = {
                    'player_id': player_id,
                    'name': f"{player_info.get('first_name', '')} {player_info.get('last_name', '')}".strip(),
                    'position': player_info.get('position'),
                    'team': player_info.get('team'),
                    'injury_status': player_info.get('injury_status')
                }
                roster_players.append(player_detail)
        
        # Get details for starter players
        for player_id in roster_summary.get('starters', []):
            if player_id and player_id in players_data:
                player_info = players_data[player_id]
                starter_detail = {
                    'player_id': player_id,
                    'name': f"{player_info.get('first_name', '')} {player_info.get('last_name', '')}".strip(),
                    'position': player_info.get('position'),
                    'team': player_info.get('team'),
                    'injury_status': player_info.get('injury_status')
                }
                starter_players.append(starter_detail)
    
    return Response({
        'user': {
            'user_id': user_data.get('user_id'),
            'username': user_data.get('username'),
            'display_name': user_data.get('display_name')
        },
        'league': {
            'league_id': league_data.get('league_id'),
            'name': league_data.get('name'),
            'season': league_data.get('season'),
            'roster_positions': league_data.get('roster_positions')
        },
        'roster': {
            'roster_id': roster_summary.get('roster_id'),
            'total_players': len(roster_players),
            'players': roster_players,
            'starters': starter_players,
            'settings': roster_summary.get('settings', {}),
            'metadata': roster_summary.get('metadata', {})
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_trending_players(request):
    """Get trending players from Sleeper API"""
    api_service = SleeperAPIService()
    
    add_drop = request.GET.get('type', 'add')  # 'add' or 'drop'
    hours = int(request.GET.get('hours', 12))
    limit = int(request.GET.get('limit', 25))
    
    trending_data = api_service.get_trending_players(
        add_drop=add_drop, hours=hours, limit=limit
    )
    
    if not trending_data:
        return Response(
            {'error': 'Unable to fetch trending players'}, 
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    # Get player details
    players_data = api_service.get_players_nfl()
    trending_players = []
    
    if players_data:
        for trending_item in trending_data:
            player_id = trending_item.get('player_id')
            if player_id in players_data:
                player_info = players_data[player_id]
                trending_detail = {
                    'player_id': player_id,
                    'name': f"{player_info.get('first_name', '')} {player_info.get('last_name', '')}".strip(),
                    'position': player_info.get('position'),
                    'team': player_info.get('team'),
                    'count': trending_item.get('count')
                }
                trending_players.append(trending_detail)
    
    return Response({
        'type': add_drop,
        'hours': hours,
        'players': trending_players
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Simple health check endpoint"""
    return Response({
        'status': 'healthy',
        'message': 'Sleepy API is running'
    })
