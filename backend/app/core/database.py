"""
MongoDB Database Connection
Uses Motor for async operations with MongoDB
"""

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from typing import Optional

from app.core.config import settings

# Import all document models here
from app.models.user import User
from app.models.cricket_box import CricketBox
from app.models.booking import Booking
from app.models.match_request import MatchRequest
from app.models.message import Message, Conversation
from app.models.review import Review
from app.models.favorite import Favorite
from app.models.notification import Notification
from app.models.payment import Payment


class Database:
    """
    Database connection manager
    """
    client: Optional[AsyncIOMotorClient] = None
    

db = Database()


async def connect_to_mongo():
    """
    Create MongoDB connection on application startup
    """
    print("🔌 Connecting to MongoDB...")
    
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    # Initialize Beanie with all document models
    await init_beanie(
        database=db.client[settings.DATABASE_NAME],
        document_models=[
            User,
            CricketBox,
            Booking,
            MatchRequest,
            Message,
            Conversation,
            Review,
            Favorite,
            Notification,
            Payment,
        ]
    )
    
    print("✅ Connected to MongoDB successfully!")


async def close_mongo_connection():
    """
    Close MongoDB connection on application shutdown
    """
    print("🔌 Closing MongoDB connection...")
    
    if db.client:
        db.client.close()
        
    print("✅ MongoDB connection closed!")


def get_database():
    """
    Get database instance for dependency injection
    """
    return db.client[settings.DATABASE_NAME]
