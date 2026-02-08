"""
API v1 Router
Combines all API route modules
"""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    cricket_boxes,
    bookings,
    match_requests,
    chat,
    reviews,
    favorites,
    payments,
    notifications,
    upload,
    owner,
    admin,
)

api_router = APIRouter()

# Authentication
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["🔐 Authentication"]
)

# Users
api_router.include_router(
    users.router,
    prefix="/users",
    tags=["👤 Users"]
)

# Cricket Boxes
api_router.include_router(
    cricket_boxes.router,
    prefix="/cricket-boxes",
    tags=["🏟️ Cricket Boxes"]
)

# Bookings
api_router.include_router(
    bookings.router,
    prefix="/bookings",
    tags=["📅 Bookings"]
)

# Match Requests (Player Matching)
api_router.include_router(
    match_requests.router,
    prefix="/match-requests",
    tags=["🤝 Player Matching"]
)

# Chat
api_router.include_router(
    chat.router,
    prefix="/chat",
    tags=["💬 Chat"]
)

# Reviews
api_router.include_router(
    reviews.router,
    prefix="/reviews",
    tags=["⭐ Reviews"]
)

# Favorites
api_router.include_router(
    favorites.router,
    prefix="/favorites",
    tags=["❤️ Favorites"]
)

# Payments
api_router.include_router(
    payments.router,
    prefix="/payments",
    tags=["💳 Payments"]
)

# Notifications
api_router.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["🔔 Notifications"]
)

# File Upload
api_router.include_router(
    upload.router,
    prefix="/upload",
    tags=["📤 Upload"]
)

# Owner Dashboard
api_router.include_router(
    owner.router,
    prefix="/owner",
    tags=["📊 Owner Dashboard"]
)

# Admin
api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["⚙️ Admin"]
)
