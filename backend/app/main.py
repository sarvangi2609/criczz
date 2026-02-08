"""
MatchBox - Cricket Box Booking Platform
Main FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1 import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events handler
    - Startup: Connect to MongoDB
    - Shutdown: Close MongoDB connection
    """
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


def create_application() -> FastAPI:
    """
    Application factory to create and configure FastAPI app
    """
    application = FastAPI(
        title=settings.APP_NAME,
        description="🏏 MatchBox - Surat's First Cricket Box Booking Platform",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # CORS Middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API Routes
    application.include_router(api_router, prefix=settings.API_PREFIX)

    return application


app = create_application()


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - Health check"""
    return {
        "message": "🏏 Welcome to MatchBox API",
        "status": "healthy",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
    }
