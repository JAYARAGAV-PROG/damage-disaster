#!/bin/bash

# Post-Disaster Damage Assessment Platform - Startup Script

echo "🚀 Starting Post-Disaster Damage Assessment Platform..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm."
    exit 1
fi

# Check if backend dependencies are installed
if [ ! -d "backend/__pycache__" ] && [ ! -f "backend/disaster_reports.db" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    pip install -r requirements.txt
    cd ..
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found!"
    echo "   Please create backend/.env with your Cloudinary credentials."
    echo "   You can copy backend/.env.example and fill in your credentials."
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    pnpm install
fi

echo ""
echo "✅ All dependencies are ready!"
echo ""
echo "🔧 Starting Backend Server (Python FastAPI)..."
echo "   Backend will run on: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""

# Start backend in background
cd backend
python3 main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

echo ""
echo "🎨 Starting Frontend Development Server (React + Vite)..."
echo "   Frontend will run on: http://localhost:5173"
echo ""
echo "📝 Default Admin Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🛑 Press Ctrl+C to stop both servers"
echo ""

# Start frontend
pnpm run dev

# Cleanup: Kill backend when frontend stops
kill $BACKEND_PID 2>/dev/null
echo ""
echo "👋 Servers stopped. Goodbye!"
