@echo off
echo Starting TaskFlow Backend Server...
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo Virtual environment not found. Creating one...
    python -m venv venv
    echo Virtual environment created.
    echo.
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Check if requirements are installed
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
)

REM Check if MongoDB is running (optional check)
echo Checking MongoDB connection...
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; async def check(): client = AsyncIOMotorClient('mongodb://localhost:27017'); await client.admin.command('ping'); print('MongoDB connection: OK'); asyncio.run(check())" 2>nul
if errorlevel 1 (
    echo WARNING: Cannot connect to MongoDB. Make sure MongoDB is running.
    echo To start MongoDB on Windows, run: net start MongoDB
    echo.
)

echo Starting FastAPI server on http://localhost:8000
echo API Documentation will be available at http://localhost:8000/docs
echo.
uvicorn app.main:app --reload --port 8000

