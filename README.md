# 🏨 Arlinjai Paradise — Hotel Booking Management System

**Comfort, Cleanliness, and Care – Your Home in Kanyakumari**

A production-ready, full-stack MERN hotel booking website for Arlinjai Paradise, a luxury hotel in Kanyakumari, Tamil Nadu, India.

---

## 🚀 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI Framework |
| Vite | 5 | Build Tool |
| Tailwind CSS | 3 | Styling |
| Framer Motion | 11 | Animations |
| React Router DOM | 6 | Routing |
| React Icons | 5 | Icons |
| Swiper.js | 11 | Carousels & Sliders |
| React Hot Toast | 2 | Notifications |
| Axios | 1.6 | HTTP Client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 4.18 | Web Framework |
| MongoDB Atlas | Latest | Database |
| Mongoose | 8 | ODM |
| JWT | 9 | Authentication |
| bcryptjs | 2.4 | Password Hashing |
| Nodemailer | 6.9 | Email Service |
| Multer | 1.4 | File Uploads |
| Helmet | 7 | Security Headers |
| express-rate-limit | 7 | Rate Limiting |

---

## 📁 Project Structure

```
ARLINJAI PARADISE/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, ScrollToTop, WhatsApp
│   │   │   └── home/           # Hero, WhyChooseUs, RoomPreview, etc.
│   │   ├── constants/          # Hotel data, room data, constants
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── RoomsPage.jsx
│   │   │   ├── RoomDetailsPage.jsx
│   │   │   ├── GalleryPage.jsx
│   │   │   ├── ExplorePage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── admin/          # Admin Dashboard Pages
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                     # Node.js Backend
    ├── config/
    │   ├── db.js               # MongoDB connection
    │   └── constants.js
    ├── controllers/            # Business logic
    ├── middleware/             # Auth, error, upload, role middleware
    ├── models/                 # Mongoose schemas
    ├── routes/                 # API route definitions
    ├── uploads/                # Local file uploads
    ├── .env.example
    ├── package.json
    └── server.js               # Entry point
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

---

### 1. Clone / Open the Project

Open the `ARLINJAI PARADISE` folder in VS Code or your preferred editor.

---

### 2. Setup the Backend (server/)

```bash
cd server
```

**Copy and fill the environment file:**
```bash
copy .env.example .env
```

Edit `.env` and fill in your values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/arlinjai_paradise
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Arlinjai Paradise <info@arlinjaiparadise.com>
CLIENT_URL=http://localhost:3000
```

**Install dependencies:**
```bash
npm install
```

**Start the server:**
```bash
npm run dev        # Development (with nodemon)
npm start          # Production
```

Server runs on: `http://localhost:5000`

---

### 3. Setup the Frontend (client/)

```bash
cd client
```

**Install dependencies:**
```bash
npm install
```

**Start the dev server:**
```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

### 4. Create Admin User

After starting the backend, create the first admin user via API:

```bash
# POST http://localhost:5000/api/auth/login
# First create admin manually via MongoDB Compass or mongosh:

use arlinjai_paradise
db.users.insertOne({
  name: "Admin",
  email: "admin@arlinjaiparadise.com",
  password: "$2a$12$...",  # bcrypt hash of "Admin@2024"
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

Or use MongoDB Compass to create the first admin.

---

## 🌐 Public Pages

| Route | Page |
|---|---|
| `/` | Home Page |
| `/rooms` | All Rooms |
| `/rooms/:slug` | Room Details |
| `/gallery` | Gallery |
| `/explore` | Explore Kanyakumari |
| `/about` | About Us |
| `/contact` | Contact |
| `/booking` | Book Now |
| `/login` | Admin Login |

---

## 🔐 Admin Dashboard

| Route | Page |
|---|---|
| `/admin` | Dashboard Overview |
| `/admin/bookings` | Booking Management |
| `/admin/rooms` | Room Management |
| `/admin/gallery` | Gallery Management |
| `/admin/customers` | Customer Management |
| `/admin/reviews` | Reviews |
| `/admin/messages` | Contact Messages |
| `/admin/reports` | Reports & Analytics |
| `/admin/settings` | Settings |

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login           Login
GET    /api/auth/me              Get current user
PUT    /api/auth/change-password Change password
```

### Rooms
```
GET    /api/rooms                Get all rooms (public)
GET    /api/rooms/:slug          Get room by slug (public)
POST   /api/rooms                Create room (admin)
PUT    /api/rooms/:id            Update room (admin)
DELETE /api/rooms/:id            Delete room (admin)
PATCH  /api/rooms/:id/availability Toggle availability
```

### Bookings
```
POST   /api/bookings             Create booking (public)
GET    /api/bookings             Get all bookings (admin)
GET    /api/bookings/:id         Get single booking
PATCH  /api/bookings/:id/status  Update booking status
DELETE /api/bookings/:id         Delete booking (admin)
```

### Gallery
```
GET    /api/gallery              Get gallery images (public)
POST   /api/gallery              Upload image (admin)
PUT    /api/gallery/:id          Update image (admin)
DELETE /api/gallery/:id          Delete image (admin)
```

### Reviews
```
GET    /api/reviews              Get approved reviews (public)
POST   /api/reviews              Submit review (public)
PATCH  /api/reviews/:id/approve  Approve/reject review (admin)
DELETE /api/reviews/:id          Delete review (admin)
```

### Contact
```
POST   /api/contact              Send message (public)
GET    /api/contact              Get all messages (admin)
POST   /api/contact/:id/reply    Reply to message (admin)
DELETE /api/contact/:id          Delete message (admin)
```

### Dashboard
```
GET    /api/dashboard/stats            Dashboard statistics
GET    /api/dashboard/recent-bookings  Recent bookings
GET    /api/dashboard/revenue-chart    Revenue chart data
```

---

## 🎨 Design System

### Colors
| Name | HEX | Usage |
|---|---|---|
| Luxury Gold | `#C9A227` | Primary accent, buttons, highlights |
| Dark Navy | `#08111F` | Background, footer, dark sections |
| White | `#FFFFFF` | Cards, backgrounds |
| Light BG | `#F8F9FA` | Section backgrounds |
| Gold Light | `#E5C158` | Hover states |
| Gold Dark | `#A07D10` | Active states |

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Poppins (sans-serif)

---

## 📱 Responsive Design

- ✅ Desktop (1440px+)
- ✅ Laptop (1024px–1440px)
- ✅ Tablet (768px–1024px)
- ✅ Mobile (320px–768px)

---

## 🏨 Hotel Information

- **Name**: Arlinjai Paradise
- **Location**: No. 5/69, Beach Road, Kanyakumari – 629702, Tamil Nadu, India
- **Phone**: 9486271234 | 04652 271234
- **WhatsApp**: +91 9486271234
- **Email**: info@arlinjaiparadise.com
- **Check-in**: 12:00 PM
- **Check-out**: 11:00 AM

### Room Types
| Room | Normal Price | High Season (Dec–Jan) |
|---|---|---|
| Deluxe AC Room | ₹2,500/night | ₹5,000/night |
| Normal AC Room | ₹2,000/night | ₹4,000/night |
| Non AC Room | ₹1,500/night | ₹3,000/night |

---

## 🚀 Deployment

### Frontend → Vercel
1. Push `client/` to GitHub
2. Connect to Vercel
3. Set `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy

### Backend → Render
1. Push `server/` to GitHub
2. Connect to Render (Web Service)
3. Set all environment variables
4. Deploy

### Database → MongoDB Atlas
1. Create a free cluster at mongodb.com/atlas
2. Get your connection string
3. Set as `MONGODB_URI` in environment

---

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail
2. Go to: Google Account → Security → App passwords
3. Create an App Password for "Mail"
4. Use that 16-character password as `EMAIL_PASS`

---

## 📄 License

This is a private commercial project for Arlinjai Paradise hotel.
© 2024–2025 Arlinjai Paradise. All rights reserved.

---

*Built with ❤️ for Arlinjai Paradise, Kanyakumari*
