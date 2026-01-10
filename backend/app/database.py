from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

# MongoDB client
client = AsyncIOMotorClient(settings.MONGODB_URL)
database = client[settings.DATABASE_NAME]

# Collections
users_collection = database.get_collection("users")
tasks_collection = database.get_collection("tasks")


async def get_database():
    """Database dependency for FastAPI routes."""
    return database
