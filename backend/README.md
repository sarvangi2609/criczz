# 🏏 MatchBox Backend

## Overview
This is the Python FastAPI backend for the MatchBox Cricket Box Booking Platform.

## Tech Stack
- **Framework**: FastAPI
- **Database**: MongoDB (async with Motor + Beanie ODM)
- **Authentication**: JWT (access + refresh tokens)
- **Payment**: Razorpay
- **Real-time**: WebSocket
- **Storage**: AWS S3
- **OTP**: Twilio

## Project Structure

```
backend/
├── app/
│   ├── api/                    # API Layer
│   │   ├── deps.py             # Dependencies (auth, etc.)
│   │   └── v1/
│   │       ├── __init__.py     # API Router
│   │       └── endpoints/
│   │           ├── auth.py         # 🔐 Authentication
│   │           ├── users.py        # 👤 User Profile
│   │           ├── cricket_boxes.py # 🏟️ Box Listing
│   │           ├── bookings.py     # 📅 Bookings
│   │           ├── match_requests.py # 🤝 Player Matching
│   │           ├── chat.py         # 💬 Real-time Chat
│   │           ├── reviews.py      # ⭐ Reviews
│   │           ├── favorites.py    # ❤️ Favorites
│   │           ├── payments.py     # 💳 Payments
│   │           ├── notifications.py # 🔔 Notifications
│   │           ├── upload.py       # 📤 File Upload
│   │           ├── owner.py        # 📊 Owner Dashboard
│   │           └── admin.py        # ⚙️ Admin Panel
│   │
│   ├── core/                   # Core Configuration
│   │   ├── config.py           # Settings from .env
│   │   ├── database.py         # MongoDB connection
│   │   └── security.py         # JWT, password hashing
│   │
│   ├── models/                 # MongoDB Document Models
│   │   ├── user.py             # User (Player/Owner/Admin)
│   │   ├── cricket_box.py      # Cricket Box
│   │   ├── booking.py          # Bookings
│   │   ├── match_request.py    # Match Requests
│   │   ├── message.py          # Chat Messages
│   │   ├── review.py           # Reviews
│   │   ├── favorite.py         # Favorites
│   │   ├── notification.py     # Notifications
│   │   └── payment.py          # Payments
│   │
│   ├── schemas/                # Pydantic Schemas (Request/Response)
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── cricket_box.py
│   │   ├── booking.py
│   │   ├── match_request.py
│   │   ├── message.py
│   │   ├── payment.py
│   │   ├── review.py
│   │   └── common.py
│   │
│   ├── services/               # Business Logic
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── cricket_box_service.py
│   │   ├── booking_service.py
│   │   ├── match_request_service.py
│   │   ├── chat_service.py
│   │   ├── payment_service.py
│   │   ├── review_service.py
│   │   ├── favorite_service.py
│   │   ├── notification_service.py
│   │   ├── upload_service.py
│   │   ├── owner_service.py
│   │   ├── admin_service.py
│   │   └── websocket_manager.py
│   │
│   └── main.py                 # FastAPI App Entry Point
│
├── requirements.txt            # Python Dependencies
├── .env.example                # Environment Variables Template
└── README.md
```

## Setup

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
copy .env.example .env
# Edit .env with your credentials
```

### 4. Run Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/send-otp` | Send OTP |
| POST | `/api/v1/auth/verify-otp` | Verify OTP |
| POST | `/api/v1/auth/refresh-token` | Refresh token |
| GET | `/api/v1/auth/me` | Get current user |

### 👤 Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/profile` | Get my profile |
| PUT | `/api/v1/users/profile` | Update profile |
| GET | `/api/v1/users/{id}` | Get user public profile |

### 🏟️ Cricket Boxes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/cricket-boxes` | List boxes (with filters) |
| GET | `/api/v1/cricket-boxes/featured` | Featured boxes |
| GET | `/api/v1/cricket-boxes/{id}` | Box details |
| POST | `/api/v1/cricket-boxes` | Create box (Owner) |
| PUT | `/api/v1/cricket-boxes/{id}` | Update box (Owner) |

### 📅 Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/bookings/slots/{box_id}` | Check availability |
| POST | `/api/v1/bookings` | Create booking |
| GET | `/api/v1/bookings/my-bookings` | My bookings |
| POST | `/api/v1/bookings/{id}/cancel` | Cancel booking |
| POST | `/api/v1/bookings/offline` | Offline booking (Owner) |

### 🤝 Player Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/match-requests` | List open requests |
| POST | `/api/v1/match-requests` | Create request |
| POST | `/api/v1/match-requests/{id}/join` | Join request |
| POST | `/api/v1/match-requests/{id}/accept/{user_id}` | Accept player |

### 💬 Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/chat/conversations` | My conversations |
| GET | `/api/v1/chat/conversations/{id}/messages` | Get messages |
| POST | `/api/v1/chat/conversations/{id}/messages` | Send message |
| WS | `/api/v1/chat/ws/{token}` | WebSocket connection |

### 💳 Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payments/create-order` | Create Razorpay order |
| POST | `/api/v1/payments/verify` | Verify payment |
| POST | `/api/v1/payments/webhook` | Razorpay webhook |

## Database Collections
1. **users** - Player/Owner/Admin accounts
2. **cricket_boxes** - Box listings
3. **bookings** - Booking records
4. **match_requests** - Player matching requests
5. **conversations** - Chat threads
6. **messages** - Chat messages
7. **reviews** - Box reviews
8. **favorites** - Saved boxes
9. **notifications** - User notifications
10. **payments** - Payment records

## Environment Variables
See `.env.example` for all required variables.

## Development Notes
- All API routes are prefixed with `/api/v1`
- JWT tokens expire after 30 minutes (access) and 7 days (refresh)
- WebSocket is used for real-time chat
- Razorpay handles all payments
- S3 stores all uploaded images
