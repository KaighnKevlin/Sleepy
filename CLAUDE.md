# CLAUDE.md - Development Notes

## Project Setup
- **Django Backend**: Port 8001 (use `python manage.py runserver 0.0.0.0:8001`)
- **Admin Access**: 
  - Username: `admin`
  - Password: `admin123`
  - URL: http://localhost:8001/admin/

## Development Commands
```bash
# Activate virtual environment
source venv/bin/activate

# Start development server
python manage.py runserver 0.0.0.0:8001

# Start development server in background (for Claude Code)
nohup python manage.py runserver 0.0.0.0:8001 > /dev/null 2>&1 & disown

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Test Sleeper API
python test_sleeper_api.py

# Frontend Commands (run from /frontend directory)
cd frontend

# Start React development server
npm start

# Start React server in background (for Claude Code)
nohup npm start > /dev/null 2>&1 & disown

# Run React tests
npm test -- --watchAll=false

# Build React app for production
npm run build
```

## Testing Commands
```bash
# Backend tests (from root directory)
source venv/bin/activate && python test_sleeper_api.py

# Frontend tests (from frontend directory)
cd frontend && npm test -- --watchAll=false

# Test compilation
cd frontend && npm run build
```

## Important Notes for Claude Code
- **Server Management**: When starting the server programmatically, use the `nohup + disown` command to prevent the Bash tool from hanging indefinitely. Standard background operations with `&` still cause the tool to wait for process output.
- **Development Workflow**: 
  1. Whenever you finish a feature, run tests first to ensure nothing is broken
  2. Run build/compilation checks to verify code compiles correctly
  3. Only commit and push after tests pass and code compiles successfully
- **Testing Requirements**: Always run tests before committing any code changes

## Project Structure
- `core/` - Main Django app with models, services, and admin
- `core/services.py` - Sleeper API integration
- `core/models.py` - Database models for fantasy data
- `test_sleeper_api.py` - API testing script

## Sleeper API Status
✅ **Connected and Working**
- 11,370+ NFL players available
- Real-time trending data
- User and league lookup functional
- Season: 2025 (offseason)