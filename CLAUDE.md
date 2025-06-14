# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Sleepy is a fantasy football assistant specifically built for dynasty superflex leagues on Sleeper.io. The application is personalized for the "Dynasty Warriors" league (ID: 1235289683278184448) and user "kaighn" (roster position 8).

## Architecture

### Backend (Django + DRF)
- **Core App**: Main Django app containing all models, services, views, and API endpoints
- **Sleeper API Integration**: Two service classes handle external API calls and data processing:
  - `SleeperAPIService`: Direct API communication with Sleeper.io
  - `SleeperDataService`: Data processing and business logic layer
- **API Endpoints**: RESTful endpoints under `/api/sleeper/` namespace for frontend consumption
- **Database Models**: Django models for SleeperUser, League, Player, TeamRoster, Trade, PlayerValue

### Frontend (React + TypeScript)
- **Component Architecture**: Feature-based components with dedicated API services
- **Hardcoded Configuration**: League-specific settings in `src/config/league.ts` for Dynasty Warriors league
- **API Layer**: Centralized API service in `src/services/api.ts` with TypeScript interfaces
- **Navigation**: Tab-based interface with My League, Draft Prep, Draft Board, Trending Players, User Lookup

### Key Design Patterns
- **Service Layer Pattern**: Backend services abstract API complexity from views
- **Configuration Pattern**: Frontend uses hardcoded league config for personalized experience
- **Error Handling**: Comprehensive null checking for pre-draft scenarios where Sleeper API returns null values
- **State Management**: React hooks for component state, no external state library

## Development Commands

### Backend Setup
```bash
# Activate virtual environment and start Django server
source venv/bin/activate
python manage.py runserver 0.0.0.0:8001

# Background server (for Claude Code automation)
nohup python manage.py runserver 0.0.0.0:8001 > /dev/null 2>&1 & disown

# Database operations
python manage.py makemigrations
python manage.py migrate

# Test Sleeper API connectivity
python test_sleeper_api.py
```

### Frontend Setup
```bash
# From frontend directory
cd frontend
npm start

# Background React server (for Claude Code automation)
nohup npm start > /dev/null 2>&1 & disown

# Testing and building
npm test -- --watchAll=false
npm run build
```

### Testing Workflow
```bash
# Backend API testing
source venv/bin/activate && python test_sleeper_api.py

# Frontend testing
cd frontend && npm test -- --watchAll=false

# Build verification
cd frontend && npm run build
```

## Critical Implementation Details

### Pre-Draft Handling
The Sleeper API returns `null` for player arrays in pre-draft leagues. Always use `roster_summary.get('players') or []` pattern to handle null values properly.

### League Configuration
The application is hardcoded for the Dynasty Warriors league. The configuration in `frontend/src/config/league.ts` contains:
- League ID: 1235289683278184448
- User roster position: 8 (important for draft pick calculations)
- 26-round draft, 12 teams, superflex format

### API Service Layer
Backend views should use `SleeperAPIService` for external calls and `SleeperDataService` for data processing. Frontend components use the centralized `apiService` from `src/services/api.ts`.

### Draft Functionality
The draft tools include both preparation (strategy guide, player rankings) and live tracking (pick management, status updates). Draft position calculations assume snake draft format with the user in position 8.

## Development Workflow
1. Always run tests before committing: backend (`python test_sleeper_api.py`) and frontend (`npm test -- --watchAll=false`)
2. Verify compilation with `npm run build` before commits
3. Use `nohup + disown` pattern for background server processes in Claude Code
4. Commit and push only after successful tests and builds

## Admin Access
- Django Admin: http://localhost:8001/admin/
- Username: `admin`
- Password: `admin123`

## API Status
- Sleeper API: Connected and functional (11,370+ NFL players available)
- Season: 2025 (offseason)
- League Status: Pre-draft