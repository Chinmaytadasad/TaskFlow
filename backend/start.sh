#!/bin/bash

echo "Starting TaskFlow Backend Server..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
    echo "Virtual environment created."
    echo ""
fi

# Activate virtual environment
source venv/bin/activate

# Check if requirements are installed
python -c "import fastapi" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    echo ""
fi

# Check if MongoDB is running (optional check)
echo "Checking MongoDB connection..."
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; async def check(): client = AsyncIOMotorClient('mongodb://localhost:27017'); await client.admin.command('ping'); print('MongoDB connection: OK'); asyncio.run(check())" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "WARNING: Cannot connect to MongoDB. Make sure MongoDB is running."
    echo "To start MongoDB, run: sudo systemctl start mongod (Linux) or brew services start mongodb-community (macOS)"
    echo ""
fi

echo "Starting FastAPI server on http://localhost:8000"
echo "API Documentation will be available at http://localhost:8000/docs"
echo ""
uvicorn app.main:app --reload --port 8000

