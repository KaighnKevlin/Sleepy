from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'users', views.SleeperUserViewSet)
router.register(r'leagues', views.LeagueViewSet)
router.register(r'players', views.PlayerViewSet)
router.register(r'rosters', views.TeamRosterViewSet)

# Custom API endpoints
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Health check
    path('health/', views.health_check, name='health_check'),
    
    # Sleeper API endpoints
    path('sleeper/user/<str:sleeper_username>/leagues/', 
         views.get_user_leagues, name='get_user_leagues'),
    
    path('sleeper/user/<str:sleeper_username>/league/<str:league_id>/roster/', 
         views.get_league_roster, name='get_league_roster'),
    
    path('sleeper/trending/', 
         views.get_trending_players, name='get_trending_players'),
    
    # Draft endpoints
    path('sleeper/league/<str:league_id>/drafts/', 
         views.get_league_drafts, name='get_league_drafts'),
    
    path('sleeper/draft/<str:draft_id>/', 
         views.get_draft_details, name='get_draft_details'),
    
    path('sleeper/league/<str:league_id>/live-draft/', 
         views.get_live_draft, name='get_live_draft'),
]