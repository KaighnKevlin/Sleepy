from rest_framework import serializers
from .models import SleeperUser, League, Player, TeamRoster, Trade, PlayerValue


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = [
            'id', 'sleeper_player_id', 'first_name', 'last_name', 'full_name',
            'position', 'team', 'age', 'years_exp', 'height', 'weight',
            'injury_status', 'active', 'created_at', 'updated_at'
        ]


class SleeperUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = SleeperUser
        fields = [
            'id', 'username', 'email', 'sleeper_user_id', 'sleeper_username',
            'sleeper_display_name', 'avatar_url', 'created_at', 'updated_at'
        ]


class LeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = [
            'id', 'sleeper_league_id', 'name', 'season', 'league_type',
            'total_rosters', 'roster_positions', 'scoring_settings', 'settings',
            'created_at', 'updated_at'
        ]


class TeamRosterSerializer(serializers.ModelSerializer):
    sleeper_user = SleeperUserSerializer(read_only=True)
    league = LeagueSerializer(read_only=True)
    players = PlayerSerializer(many=True, read_only=True)
    player_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TeamRoster
        fields = [
            'id', 'sleeper_user', 'league', 'roster_id', 'players', 'player_count',
            'starters', 'settings', 'created_at', 'updated_at'
        ]
    
    def get_player_count(self, obj):
        return obj.players.count()


class PlayerValueSerializer(serializers.ModelSerializer):
    player = PlayerSerializer(read_only=True)
    
    class Meta:
        model = PlayerValue
        fields = [
            'id', 'player', 'value_source', 'value', 'date', 'created_at'
        ]


class TradeSerializer(serializers.ModelSerializer):
    league = LeagueSerializer(read_only=True)
    
    class Meta:
        model = Trade
        fields = [
            'id', 'sleeper_transaction_id', 'league', 'status',
            'transaction_data', 'created_at', 'updated_at'
        ]


class RosterSummarySerializer(serializers.Serializer):
    """Serializer for roster summary data from Sleeper API"""
    roster_id = serializers.IntegerField()
    owner_id = serializers.CharField()
    league_id = serializers.CharField()
    players = serializers.ListField(child=serializers.CharField())
    starters = serializers.ListField(child=serializers.CharField())
    total_players = serializers.SerializerMethodField()
    
    def get_total_players(self, obj):
        return len(obj.get('players', []))


class LeagueOverviewSerializer(serializers.Serializer):
    """Serializer for league overview data"""
    league_id = serializers.CharField()
    name = serializers.CharField()
    season = serializers.CharField()
    total_rosters = serializers.IntegerField()
    roster_positions = serializers.DictField()
    scoring_settings = serializers.DictField()
    user_roster = RosterSummarySerializer(required=False)