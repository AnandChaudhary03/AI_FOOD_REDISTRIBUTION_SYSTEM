@echo off
echo Starting AnnaSetu Platform...

start "AnnaSetu Backend API" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --port 8000"

start "AnnaSetu Frontend PWA" cmd /k "cd /d %~dp0frontend && npm run dev"

echo AnnaSetu Backend running on http://localhost:8000
echo AnnaSetu Frontend running on http://localhost:5173
pause
