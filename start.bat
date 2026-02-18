@echo off
REM Post-Disaster Damage Assessment Platform - Startup Script for Windows

echo Starting Post-Disaster Damage Assessment Platform...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python 3 is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo pnpm is not installed. Please install pnpm.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo Warning: backend\.env file not found!
    echo Please create backend\.env with your Cloudinary credentials.
    echo You can copy backend\.env.example and fill in your credentials.
    echo.
    pause
)

REM Install backend dependencies if needed
if not exist "backend\__pycache__" (
    echo Installing backend dependencies...
    cd backend
    pip install -r requirements.txt
    cd ..
)

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call pnpm install
)

echo.
echo All dependencies are ready!
echo.
echo Starting Backend Server (Python FastAPI)...
echo Backend will run on: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.

REM Start backend in new window
start "Backend Server" cmd /k "cd backend && python main.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Development Server (React + Vite)...
echo Frontend will run on: http://localhost:5173
echo.
echo Default Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo Press Ctrl+C in each window to stop the servers
echo.

REM Start frontend
call pnpm run dev
