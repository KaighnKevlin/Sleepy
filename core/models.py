from django.db import models
from django.contrib.auth.models import User


class SleeperUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    sleeper_user_id = models.CharField(max_length=50, unique=True)
    sleeper_username = models.CharField(max_length=100)
    sleeper_display_name = models.CharField(max_length=100, blank=True)
    avatar_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.sleeper_username} ({self.user.username})"

    class Meta:
        db_table = 'sleeper_users'


class League(models.Model):
    SEASON_CHOICES = [
        ('2024', '2024'),
        ('2023', '2023'),
        ('2022', '2022'),
    ]
    
    LEAGUE_TYPE_CHOICES = [
        ('dynasty', 'Dynasty'),
        ('redraft', 'Redraft'),
        ('keeper', 'Keeper'),
    ]

    sleeper_league_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    season = models.CharField(max_length=4, choices=SEASON_CHOICES)
    league_type = models.CharField(max_length=20, choices=LEAGUE_TYPE_CHOICES, default='dynasty')
    total_rosters = models.IntegerField()
    roster_positions = models.JSONField()
    scoring_settings = models.JSONField()
    settings = models.JSONField()
    users = models.ManyToManyField(SleeperUser, through='TeamRoster')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.season})"

    class Meta:
        db_table = 'leagues'
        unique_together = ['sleeper_league_id', 'season']


class Player(models.Model):
    POSITION_CHOICES = [
        ('QB', 'Quarterback'),
        ('RB', 'Running Back'),
        ('WR', 'Wide Receiver'),
        ('TE', 'Tight End'),
        ('K', 'Kicker'),
        ('DEF', 'Defense'),
    ]

    sleeper_player_id = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200)
    position = models.CharField(max_length=5, choices=POSITION_CHOICES)
    team = models.CharField(max_length=5, blank=True)
    age = models.IntegerField(null=True, blank=True)
    years_exp = models.IntegerField(null=True, blank=True)
    height = models.CharField(max_length=10, blank=True)
    weight = models.CharField(max_length=10, blank=True)
    injury_status = models.CharField(max_length=50, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.position} - {self.team})"

    class Meta:
        db_table = 'players'


class TeamRoster(models.Model):
    sleeper_user = models.ForeignKey(SleeperUser, on_delete=models.CASCADE)
    league = models.ForeignKey(League, on_delete=models.CASCADE)
    roster_id = models.IntegerField()
    players = models.ManyToManyField(Player, blank=True)
    starters = models.JSONField(default=list)
    settings = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.sleeper_user.sleeper_username} - {self.league.name}"

    class Meta:
        db_table = 'team_rosters'
        unique_together = ['sleeper_user', 'league']


class Trade(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('complete', 'Complete'),
        ('failed', 'Failed'),
    ]

    sleeper_transaction_id = models.CharField(max_length=50, unique=True)
    league = models.ForeignKey(League, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Trade {self.sleeper_transaction_id} - {self.status}"

    class Meta:
        db_table = 'trades'


class PlayerValue(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    value_source = models.CharField(max_length=50)  # 'ktc', 'dynastyprocess', etc.
    value = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player.full_name} - {self.value} ({self.value_source})"

    class Meta:
        db_table = 'player_values'
        unique_together = ['player', 'value_source', 'date']
