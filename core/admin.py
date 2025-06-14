from django.contrib import admin
from .models import SleeperUser, League, Player, TeamRoster, Trade, PlayerValue


@admin.register(SleeperUser)
class SleeperUserAdmin(admin.ModelAdmin):
    list_display = ('sleeper_username', 'sleeper_display_name', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('sleeper_username', 'sleeper_display_name', 'sleeper_user_id')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(League)
class LeagueAdmin(admin.ModelAdmin):
    list_display = ('name', 'season', 'league_type', 'total_rosters', 'created_at')
    list_filter = ('season', 'league_type', 'created_at')
    search_fields = ('name', 'sleeper_league_id')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'position', 'team', 'age', 'active', 'updated_at')
    list_filter = ('position', 'team', 'active', 'injury_status')
    search_fields = ('full_name', 'first_name', 'last_name', 'sleeper_player_id')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(TeamRoster)
class TeamRosterAdmin(admin.ModelAdmin):
    list_display = ('sleeper_user', 'league', 'roster_id', 'updated_at')
    list_filter = ('league', 'updated_at')
    search_fields = ('sleeper_user__sleeper_username', 'league__name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ('sleeper_transaction_id', 'league', 'status', 'created_at')
    list_filter = ('status', 'league', 'created_at')
    search_fields = ('sleeper_transaction_id', 'league__name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PlayerValue)
class PlayerValueAdmin(admin.ModelAdmin):
    list_display = ('player', 'value', 'value_source', 'date', 'created_at')
    list_filter = ('value_source', 'date', 'created_at')
    search_fields = ('player__full_name', 'value_source')
    readonly_fields = ('created_at',)
