# 🏏 CricZZ - Cricket Box Booking Platform

## What is This Project?

CricZZ is an **online platform** where cricket lovers in Surat can book their favorite cricket box online.

### The Real Problem:
- Surat has 100+ cricket boxes
- Players have to call each box for booking
- No single website shows all boxes
- Hard for players to find other players for a match
- Last minute bookings create confusion

### Our Solution:
- One website showing all cricket boxes
- Book online, pay online
- Find other players for your match
- Chat with players before confirming

---

## 🎯 Understanding Main Features

### 1. 🏟️ Cricket Box Listing

**What Happens:**
- Website shows all cricket boxes in Surat
- Each box shows photos, address, price, facilities
- Users can filter (by area, by price)
- Users can search by name

**Example:**
```
User opens website → Goes to "Explore" page → 
Filters by "Vesu area" → Sees all Vesu boxes →
Clicks on "Green Turf" → Sees full details
```

---

### 2. 📅 Online Booking System

**What Happens:**
- User selects date and time
- System shows if slot is available or not
- User pays online (Razorpay/UPI)
- Booking gets confirmed, notification comes

**Step by Step Flow:**
```
Step 1: User selects a cricket box
Step 2: User selects date (example: 25 January)
Step 3: User selects time slot (example: 6-7 PM)
Step 4: System checks - Is this slot empty or booked?
        - Empty → Go to booking page
        - Booked → Show "Not Available"
Step 5: User makes payment
Step 6: Payment success → Booking confirmed!
Step 7: Both user and owner get notification
```

**Important Concept - Slot Availability:**
```
One cricket box timeline for 1 day:

6 AM  |████████| Booked (Raj)
7 AM  |        | Available ✓
8 AM  |████████| Booked (Amit)
9 AM  |████████| Booked (Amit) - 2 hour booking
10 AM |        | Available ✓
11 AM |        | Available ✓
...
6 PM  |████████| Booked (Online - Vijay)
7 PM  |████████| Booked (Offline - Walk-in)
8 PM  |        | Available ✓
```

---

### 3. 🤝 Player Matching System

**Problem it Solves:**
- You have 4 friends, but need 8 players for a match
- You create a request: "Need 4 players, 25 Jan, 6 PM, Vesu"
- Other players can see this request and join

**Step by Step Flow:**
```
PLAYER A (Request Creator):
1. Clicks "Create Match Request"
2. Fills details:
   - Date: 25 January
   - Time: Evening (6-7 PM)
   - Location: Vesu area
   - Players needed: 4
   - Skill level: Intermediate
3. Request gets published

PLAYER B, C, D (Other Players):
1. Go to "Find Match" page
2. See list of open requests
3. See Player A's request
4. Click "Join"
5. Send request

PLAYER A:
1. Gets notification: "3 players interested"
2. Views players' profiles
3. Accepts the ones he likes
4. Chat starts with matched players
5. Makes final booking
```

---

### 4. 💬 Real-time Chat System

**Why Needed:**
- Matched players can coordinate with each other
- Discuss timings
- Share location

**How it Works:**
```
Normal API Call:
User sends message → Goes to server → Saves in database → 
Receiver has to refresh page to see message

Real-time (WebSocket):
User sends message → Goes to server → Saves in database → 
Message reaches receiver INSTANTLY (no refresh needed) ✓
```

**Chat Features:**
- Text messages
- Typing indicator ("Raj is typing...")
- Online status (green dot)
- Read receipts (blue ticks)

---

### 5. ⭐ Favorites System

**Simple Feature:**
- User likes a box, clicks heart icon
- That box saves in "Favorites" list
- Easy to access later

---

### 6. 📊 Owner Dashboard

**What Box Owner Needs:**
- How many bookings today?
- Which slots are empty?
- Add walk-in booking (offline)?
- Monthly revenue?

**Important Feature - Offline Booking:**
```
Problem:
- A customer comes directly to the box (walk-in)
- Or books via phone call
- These bookings don't show on website
- Online user books same slot → CONFLICT!

Solution:
- Owner has "Add Offline Booking" button in app/website
- Owner adds walk-in booking
- System updates instantly
- Online users see that slot as "Not Available"
```

---

## 👥 Types of Users (User Roles)

### 1. Player (Normal User)
- Browse cricket boxes
- Make online bookings
- Create/join match requests
- Chat with other players
- Give reviews

### 2. Box Owner
- List their cricket box
- Manage bookings
- Add offline bookings
- See revenue
- Read customer reviews

### 3. Admin (You - Platform Owner)
- Manage all users
- Approve all boxes
- Track commission
- Resolve disputes

---

## 💰 How Will You Make Money? (Revenue Model)

### 1. Online Booking Commission
```
Player makes ₹1000 booking
         ↓
Platform keeps 10% (₹100)
         ↓
Owner gets ₹900
```

### 2. Subscription (Box Owners)
```
FREE Plan:   Basic listing, 10 bookings/month limit
BASIC ₹999:  Unlimited bookings, analytics
PRO ₹1999:   Priority listing, advanced features
```

### 3. Featured Listing
```
Owner pays money → Their box shows on top
₹500/week - Homepage featured
₹300/week - Top in search results
```

---

## 🗄️ What Will Be Stored in Database?

### Tables (Categories of Data):

#### 1. Users Table
```
What it stores:
- ID (unique number)
- Name
- Email
- Phone
- Password (encrypted)
- Profile photo
- Role (Player/Owner/Admin)
- Skill level
- Area in Surat
- Account creation date
```

#### 2. Cricket Boxes Table
```
What it stores:
- ID
- Name (Green Turf Cricket Box)
- Address
- Area (Vesu, Adajan, etc.)
- Price per hour
- Weekend price
- Opening time, Closing time
- Facilities (Parking, Lights, Washroom, etc.)
- Photos
- Owner ID (who owns it)
- Rating (4.5 stars)
- Total bookings count
```

#### 3. Bookings Table
```
What it stores:
- Booking ID
- Booking number (CBK-2024-001234)
- User ID (who booked)
- Cricket Box ID (where booked)
- Date
- Start time, End time
- Amount paid
- Payment status (Paid/Pending)
- Booking status (Confirmed/Cancelled)
- Booking type (Online/Offline)
```

#### 4. Match Requests Table
```
What it stores:
- Request ID
- Creator User ID
- Title ("Looking for 4 players")
- Date, Time
- Players needed
- Players joined
- Skill level required
- Area preference
- Status (Open/Closed)
```

#### 5. Messages Table
```
What it stores:
- Message ID
- Conversation ID
- Sender ID
- Message content
- Time sent
- Read status
```

---

## 🔄 Important Flows Explained

### Flow 1: User Registration
```
1. User clicks "Register"
2. Enters phone number, name, email, password
3. System checks - Is phone already registered?
   - Yes → Error: "Already registered"
   - No → Continue
4. OTP is sent to phone
5. User enters OTP
6. OTP matches → Account created!
7. User can now login
```

### Flow 2: Complete Booking Flow
```
1. User logs in
2. Selects a cricket box
3. Selects a date
4. Available slots are shown
5. Selects a slot
6. Clicks "Book Now"
7. Booking summary shown (Amount, Tax, Total)
8. Clicks "Pay Now"
9. Razorpay payment page opens
10. User pays (UPI/Card/NetBanking)
11. Payment success:
    - Booking confirmed
    - Email/SMS sent to user
    - Owner gets notification
    - Slot blocked in system
12. Payment fail:
    - Booking cancelled
    - Slot remains available
    - User can retry
```

### Flow 3: Player Matching Flow
```
1. Player A creates request:
   - "Need 4 players"
   - "26 Jan, 6-8 PM"
   - "Vesu area"
   - "Intermediate level"

2. Request is published

3. Notification sent to matching players:
   - Players in Vesu area
   - Intermediate/Advanced level players
   - Those who prefer evening time

4. Player B, C, D see the request
   - Click "Join"
   - Write message: "I'm in!"

5. Player A gets notification:
   - "3 players interested"

6. Player A views profiles:
   - Player B: 4.5 rating, 50 matches played
   - Player C: 4.0 rating, 30 matches played
   - Player D: 3.5 rating, 10 matches played

7. Player A accepts B and C

8. Chat room created (A, B, C)

9. Players coordinate:
   - Confirm final timing
   - Decide meeting point
   - Discuss payment split

10. Player A makes final booking

11. Match happens! 🏏
```

---

## 📱 Website Pages

### Public Pages (Without Login):
1. **Home** - Landing page, featured boxes
2. **Explore** - All boxes list with filters
3. **Box Details** - Full details of one box
4. **Login** - Login form
5. **Register** - Registration form

### Protected Pages (After Login):
1. **My Bookings** - User's bookings
2. **Player Matching** - Match requests
3. **Chat** - Messages
4. **Favorites** - Saved boxes
5. **Profile** - Edit user details

### Owner Pages:
1. **Dashboard** - Overview
2. **My Box** - Edit box details
3. **Bookings** - Manage all bookings
4. **Add Offline Booking** - Add walk-in booking
5. **Analytics** - Revenue, stats

---

## 🔐 Understanding Security

### 1. Password Security
```
User's password: "mypassword123"
         ↓ (Hashing process)
Stored in database: "a7f8b2c9e4d1..." (unreadable)

Even if someone hacks database, they can't read passwords
```

### 2. Authentication (Who are you?)
```
User logs in → Server gives "Token" (like temporary ID card)
         ↓
User sends token with every request
         ↓
Server checks if token is valid → Gives access
Server checks if token is invalid → Shows "Please login" error
```

### 3. Authorization (What are you allowed to do?)
```
Player logs in → Can make bookings ✓
               → Cannot see owner dashboard ✗

Owner logs in → Can edit own box ✓
              → Cannot edit someone else's box ✗
```

---

## 🔗 How Frontend and Backend Connect?

### Concept: API (Application Programming Interface)
```
Frontend (React - What user sees)     Backend (Python - Logic)
        ↓                                    ↓
   User clicks                        Database interaction
   "Book Now"                         Payment processing
        ↓                                    ↓
        └──────── API Request ──────────────→
                  (HTTP/REST)
        ←──────── API Response ─────────────┘
             (Success/Error data)
```

### Example:
```
Frontend wants: List of cricket boxes in Vesu

1. Frontend sends request:
   GET /api/v1/cricket-boxes?area=Vesu

2. Backend:
   - Receives request
   - Gets Vesu boxes from database
   - Creates response

3. Backend sends response:
   {
     "boxes": [
       {"name": "Green Turf", "price": 800},
       {"name": "Sports Arena", "price": 1000}
     ]
   }

4. Frontend displays this data
```

---

## 📊 Real-time Features (WebSocket)

### Normal HTTP vs WebSocket:
```
HTTP (Normal):
- User sends request → Server responds → Connection closes
- Need new data? Send another request

WebSocket (Real-time):
- Connection stays open
- Server can send data anytime
- Perfect for chat, live updates
```

### Where We Use It:
1. **Chat messages** - Instant delivery
2. **Booking updates** - When slot gets booked, instant update
3. **Online status** - Is user online or offline
4. **Typing indicator** - "Raj is typing..."

---

## 💳 Payment Flow (Razorpay)

### Step by Step:
```
1. User clicks "Pay Now"

2. Frontend → Backend:
   "Create payment order for ₹1000"

3. Backend → Razorpay:
   "Create an order"

4. Razorpay → Backend:
   "Order ID: order_abc123"

5. Backend → Frontend:
   "Here's Order ID, open payment page"

6. Frontend opens Razorpay popup:
   - User enters card/UPI details
   - Makes payment

7. Razorpay → Frontend:
   "Payment successful, payment_id: pay_xyz"

8. Frontend → Backend:
   "Verify this payment"

9. Backend → Razorpay:
   "Is this payment valid?"

10. Razorpay → Backend:
    "Yes, it is valid"

11. Backend:
    - Confirms booking
    - Updates database
    - Sends notification

12. Backend → Frontend:
    "Booking confirmed! 🎉"
```

---

## 🚀 Development Approach

### Phase 1: Foundation (Understanding)
- [ ] Understand project structure
- [ ] Understand database design
- [ ] Understand API concepts
- [ ] Understand flow diagrams

### Phase 2: Setup
- [ ] Install tools
- [ ] Create project folders
- [ ] Run basic apps

### Phase 3: Backend First
- [ ] Create database tables
- [ ] Build Auth (Login/Register)
- [ ] Build basic APIs
- [ ] Test using Postman/Thunder Client

### Phase 4: Frontend
- [ ] Build pages
- [ ] Connect with backend
- [ ] Design UI

### Phase 5: Advanced
- [ ] Payment integration
- [ ] Real-time chat
- [ ] Owner dashboard

### Phase 6: Launch
- [ ] Testing
- [ ] Bug fixes
- [ ] Deployment

---

## ❓ Common Questions

### Q: What are database relationships?
```
User ←──────→ Booking (One user can have many bookings)
              ↓
CricketBox ←─ Booking (One box can have many bookings)

User ←──────→ MatchRequest (One user creates many requests)
              ↓
User ←──────→ MatchResponse (Many users can respond)
```

### Q: What are API request types?
```
GET    → Get data (Read)
POST   → Create data (Create)
PUT    → Update data (Update)
DELETE → Remove data (Delete)
```

### Q: What happens when token expires?
```
Access Token: 30 minutes (short life)
Refresh Token: 7 days (long life)

Access expires → Use refresh token to get new access token
Refresh expires → User must login again
```

---

## 📌 Key Terms Dictionary

| Term | Simple Meaning |
|------|----------------|
| Frontend | What user sees (Website UI) |
| Backend | Logic running on server |
| Database | Where data is stored |
| API | Communication between Frontend and Backend |
| Authentication | Verifying who you are |
| Authorization | What you are allowed to do |
| Token | Digital temporary ID card |
| WebSocket | Real-time connection |
| CRUD | Create, Read, Update, Delete operations |
| ORM | Easy way to talk to database |
| Environment Variables | Secret settings stored separately |
| Deployment | Making website live on internet |
| Hashing | Converting password to unreadable format |
| Encryption | Protecting data so only intended person can read |
| Middleware | Code that runs between request and response |
| Session | Temporary storage for logged-in user |
| Cache | Temporary storage for faster access |
| Query | Question asked to database |
| Schema | Structure/blueprint of database |
| Migration | Changes made to database structure |

---

## 🎯 Success Criteria

Your project is complete when:

1. ✅ User can register and login
2. ✅ User can browse cricket boxes
3. ✅ User can make online booking
4. ✅ Payment works successfully
5. ✅ User can create/join match requests
6. ✅ User can chat with other players
7. ✅ Owner dashboard works
8. ✅ Offline booking can be added
9. ✅ Real-time updates work
10. ✅ Website is live on internet

---

**Read and understand all this first, then we will start coding together! Ask if you have any questions! 💪**

---

*CricZZ - Surat's First Cricket Box Booking Platform* 🏏
