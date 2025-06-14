# Sleepy - Fantasy Football Assistant Design Document

## Project Overview
A comprehensive fantasy football helper tool for Sleeper.io dynasty leagues. Designed specifically for double flex dynasty format with proactive insights and recommendations.

## Tech Stack

### Backend
- **Django** - Robust web framework with excellent ORM and admin interface
- **Django REST Framework** - API development for frontend communication
- **PostgreSQL** - Production database (SQLite for local development)
- **Celery + Redis** - Background tasks for data updates and notifications
- **Pandas** - Data analysis and player statistics manipulation

### Frontend
- **React + TypeScript** - Modern, type-safe frontend development
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Chart.js/Recharts** - Data visualizations for player trends and analytics
- **React Query** - Server state management and API caching

### Deployment & Infrastructure
- **Docker** - Containerization for consistent deployment
- **Railway/Render** - Backend hosting and database
- **Vercel** - Frontend hosting with automatic deployments
- **GitHub Actions** - CI/CD pipeline for testing and deployment

### Optional Integrations
- **Discord.py** - Bot notifications for trade alerts and recommendations
- **External APIs** - KeepTradeCut, DynastyProcess for player valuations

## Core Features

### 1. Trade Analyzer
- Evaluate incoming trade offers using multiple data sources
- Calculate trade value using dynasty rankings and team context
- Consider positional needs and roster construction
- Historical trade tracking and success metrics

### 2. Waiver Wire Assistant
- Identify pickup targets based on roster gaps
- Monitor player trends and usage changes
- Prioritize adds based on league settings and scoring
- Alert on high-value drops by other managers

### 3. Lineup Optimizer
- Weekly lineup suggestions for double flex format
- Consider matchups, weather, and injury reports
- Optimize for different strategies (ceiling vs floor)
- Historical performance tracking

### 4. Dynasty Value Tracker
- Monitor player value changes over time
- Track aging curves and career trajectories
- Identify buy-low and sell-high opportunities
- Long-term roster planning recommendations

## Proactive Features

### Smart Notifications
- Trade opportunity alerts when player values shift
- Waiver wire recommendations before popular pickups
- Sell-high alerts for aging or trending players
- League activity monitoring (trades, drops, claims)

### Strategic Guidance
- Recommend when to compete vs rebuild
- Identify optimal trade windows
- Draft strategy suggestions based on roster needs
- Season-long planning and timeline recommendations

## Data Sources & APIs

### Primary
- **Sleeper API** - League data, rosters, matchups, transactions
- User authentication via Sleeper OAuth

### Secondary
- **KeepTradeCut API** - Dynasty player values and trade data
- **DynastyProcess** - Player projections and analytics
- **ESPN/Yahoo APIs** - Additional player data and news
- **Weather APIs** - Game condition factors

## Database Schema (High Level)

### Core Models
- **User** - Django user model extended with Sleeper data
- **League** - Sleeper league information and settings
- **Team** - User's teams across multiple leagues
- **Player** - NFL players with dynasty-relevant data
- **Trade** - Historical trades and analysis results
- **Transaction** - Waiver claims, drops, and roster moves

### Analytics Models
- **PlayerValue** - Time-series player valuations
- **Projection** - Weekly and season projections
- **Recommendation** - Generated suggestions and their outcomes
- **Alert** - User notifications and preferences

## Architecture Overview

```
Frontend (React)
    ↓
API Gateway (Django REST)
    ↓
Business Logic (Django Views/Services)
    ↓
Database (PostgreSQL) + Cache (Redis)
    ↓
Background Tasks (Celery)
    ↓
External APIs (Sleeper, KTC, etc.)
```

## Development Phases

### Phase 1: Foundation
- Django project setup with user authentication
- Sleeper API integration for basic data
- Simple roster and league viewing interface

### Phase 2: Core Analytics
- Trade analyzer with basic valuation
- Player value tracking and historical data
- Simple recommendation engine

### Phase 3: Advanced Features
- Waiver wire assistant with predictive modeling
- Lineup optimizer with matchup analysis
- Discord bot integration for notifications

### Phase 4: Intelligence Layer
- Machine learning for trade success prediction
- Advanced dynasty strategy recommendations
- Personalized insights based on user behavior

## Security & Privacy
- Secure handling of Sleeper OAuth tokens
- User data encryption for sensitive information
- Rate limiting for external API calls
- GDPR compliance for user data handling

## Performance Considerations
- Database indexing for fast player lookups
- Caching layer for frequently accessed data
- Background processing for heavy computations
- CDN for static assets and API responses