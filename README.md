# 📅 ExpertBook — Real-Time Expert Session Booking System

A full-stack MERN web application to book 1-on-1 sessions with verified professionals. Features real-time slot updates, double booking prevention, and a clean calm UI.

<br />

🌐 **Live Demo:** [https://mern-booking-system-swart.vercel.app](https://mern-booking-system-swart.vercel.app)  
🔗 **Backend API:** [https://mern-booking-system-wv2o.onrender.com](https://mern-booking-system-wv2o.onrender.com)  
📦 **Video walkthrough:** [https://drive.google.com/file/d/1MwyPO2vSMMJJ_5-2B3-JFjqC97UEUQds/view?usp=sharing](https://drive.google.com/file/d/1MwyPO2vSMMJJ_5-2B3-JFjqC97UEUQds/view?usp=sharing)
📦 **GitHub:** [https://github.com/Sufalthakre18/mern-booking-system](https://github.com/Sufalthakre18/mern-booking-system)

---

## ✨ Features

- 🔍 Expert listing with search, category filter, and pagination
- 👤 Expert profile page with available time slots grouped by date
- ⚡ Real-time slot updates across all users via Socket.io
- 📋 Booking form with full validation and success confirmation
- 📂 My Bookings — lookup all sessions by email with live status
- 🔒 Double booking prevention using MongoDB compound unique index

---


## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Real-time (client) | Socket.io Client |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Real-time (server) | Socket.io |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Database Host | MongoDB Atlas |

---

## 📁 Project Structure

```
mern-booking-system/
├── server/
│   ├── models/
│   │   ├── Expert.js
│   │   └── Booking.js
│   ├── controllers/
│   │   ├── expertController.js
│   │   └── bookingController.js
│   ├── routes/
│   │   ├── experts.js
│   │   └── bookings.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── index.js
    │   ├── context/
    │   │   └── SocketContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ExpertCard.jsx
    │   ├── pages/
    │   │   ├── ExpertList.jsx
    │   │   ├── ExpertDetail.jsx
    │   │   ├── BookingPage.jsx
    │   │   └── MyBookings.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Run Locally

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repo

```bash
git clone https://github.com/Sufalthakre18/mern-booking-system.git
cd mern-booking-system
```

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expert-booking
CLIENT_URL=http://localhost:5173
```

```bash
npm run seed    # loads 8 sample experts into MongoDB
npm run dev     # starts server on http://localhost:5000
```

### 3. Setup Frontend

```bash
cd client
npm install
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev     # starts app on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 API Reference

Base URL (production): `https://mern-booking-system-wv2o.onrender.com`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/experts` | List all experts (pagination, search, filter) |
| `GET` | `/experts/:id` | Get single expert with available slots |
| `POST` | `/bookings` | Create a new booking |
| `PATCH` | `/bookings/:id/status` | Update booking status |
| `GET` | `/bookings?email=` | Get all bookings by email |

### Query Params for `GET /experts`

| Param | Type | Example |
|-------|------|---------|
| `page` | number | `?page=1` |
| `limit` | number | `?limit=6` |
| `search` | string | `?search=priya` |
| `category` | string | `?category=Finance` |

### Sample POST /bookings body

```json
{
  "expertId": "664abc123...",
  "name": "Aryan Sharma",
  "email": "aryan@gmail.com",
  "phone": "+91 98001 23456",
  "date": "2025-05-10",
  "timeSlot": "10:00",
  "notes": "Want to discuss career guidance"
}
```

---

## ⚡ Real-Time Flow

```
User books a slot
      ↓
POST /bookings → MongoDB saves
      ↓
io.emit('slotBooked', { expertId, date, timeSlot })
      ↓
All connected browsers receive the event instantly
      ↓
Slot button becomes disabled for everyone — no refresh needed
```

---

## 🔒 Double Booking Prevention

The `Booking` model has a **unique compound index**:

```js
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });
```

Even if two users click at the exact same millisecond, MongoDB's atomic write ensures only one succeeds. The second request gets an `E11000 duplicate key error` which the server catches and returns as a clean `409 Conflict` response.

---

## 🚢 Deployment

### Backend — Render

| Setting | Value |
|---------|-------|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `node server.js` |

**Environment Variables on Render:**

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expert-booking
CLIENT_URL=https://mern-booking-system-swart.vercel.app
```

**Live Backend:** https://mern-booking-system-wv2o.onrender.com

---

### Frontend — Vercel

| Setting | Value |
|---------|-------|
| Root Directory | `client` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**Environment Variables on Vercel:**

```env
VITE_API_URL=https://mern-booking-system-wv2o.onrender.com
```

**Live Frontend:** https://mern-booking-system-swart.vercel.app

---

## 🗂️ Environment Variables Summary

### server/.env

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
CLIENT_URL=https://mern-booking-system-swart.vercel.app
```

### client/.env

```env
VITE_API_URL=https://mern-booking-system-wv2o.onrender.com
```

---

## 👤 Author

**Sufal Thakre**  
GitHub: [@Sufalthakre18](https://github.com/Sufalthakre18)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).