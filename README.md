# ShowMax — Movie Ticket Booking Platform

> A full-stack movie ticket booking web application with real-time seat selection, Stripe payments, automated email notifications, and a role-protected admin dashboard.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Data Flow](#architecture--data-flow)
- [Database Models](#database-models)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Admin Access](#admin-access)
- [Background Jobs (Inngest)](#background-jobs-inngest)
- [Deployment](#deployment)

---

## Overview

**ShowMax** is a cinema ticket booking platform that integrates with [TMDB (The Movie Database)](https://www.themoviedb.org/) to dynamically pull real movie data. Users can browse currently playing movies, select showtimes, pick seats from an interactive seat layout, pay via Stripe, and receive a branded booking confirmation email. Administrators get a dedicated dashboard to manage shows, view bookings, and track revenue.

---

## ✨ Features

### 👤 User Features

- **Browse Movies** — View now-playing movies fetched live from TMDB.
- **Movie Details** — Full movie information including overview, cast, genres, runtime, and trailer.
- **Date & Showtime Selection** — Pick from available dates and times for a movie.
- **Interactive Seat Layout** — Visual seat map with real-time occupied seat indicators.
- **Stripe Checkout** — Secure online payment via Stripe. Payment sessions expire in 30 minutes.
- **Auto Seat Release** — Unpaid bookings automatically release seats after 10 minutes (via Inngest).
- **My Bookings** — View all past and upcoming booking history.
- **Favourites** — Add/remove movies from a personal favourites list.
- **Email Confirmation** — Branded HTML booking confirmation email sent after successful payment.
- **Authentication** — Sign up / Sign in powered by Clerk.

### 🛡️ Admin Features

- **Admin Dashboard** — Overview of total bookings, revenue, and active shows.
- **Add Shows** — Search now-playing movies from TMDB and schedule shows with custom dates, times, and pricing.
- **List Shows** — View and manage all scheduled shows.
- **List Bookings** — See all bookings across all users.
- **Role-Based Access** — Admin routes are protected by Clerk's `privateMetadata.role === "admin"` check.
- **New Show Notifications** — All registered users receive an email notification when a new show is added.

---

## 🛠️ Tech Stack

### Frontend (`/client`)

| Technology              | Purpose                          |
| ----------------------- | -------------------------------- |
| **React 19**            | UI framework                     |
| **Vite 8**              | Build tool & dev server          |
| **React Router DOM v7** | Client-side routing              |
| **Tailwind CSS v4**     | Utility-first styling            |
| **@clerk/clerk-react**  | Authentication & user management |
| **Axios**               | HTTP client for API calls        |
| **React Hot Toast**     | Toast notifications              |
| **React Player**        | Movie trailer playback           |
| **Lucide React**        | Icon library                     |

### Backend (`/server`)

| Technology                  | Purpose                                            |
| --------------------------- | -------------------------------------------------- |
| **Node.js + Express v5**    | REST API server                                    |
| **MongoDB + Mongoose**      | Database & ODM                                     |
| **@clerk/express**          | Server-side auth middleware                        |
| **Stripe**                  | Payment processing                                 |
| **Inngest**                 | Background job scheduling & event-driven functions |
| **Nodemailer + Brevo SMTP** | Transactional email delivery                       |
| **Cloudinary**              | (Integrated, for media storage)                    |
| **Svix**                    | Clerk webhook verification                         |
| **Axios**                   | TMDB API calls                                     |
| **CORS, dotenv**            | Standard middleware                                |
| **Nodemon**                 | Dev auto-restart                                   |

---

## 📁 Project Structure

```
ShowMax/
├── client/                         # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/                 # Static assets
│   │   ├── components/             # Reusable UI components
│   │   │   ├── admin/
│   │   │   │   ├── AdminNavbar.jsx
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   └── Title.jsx
│   │   │   ├── BlurCircle.jsx      # Decorative blur effect
│   │   │   ├── DateSelect.jsx      # Show date/time picker
│   │   │   ├── FeaturedSection.jsx # Featured movies section
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx     # Homepage hero banner
│   │   │   ├── Loading.jsx         # Loading state (used post-payment redirect)
│   │   │   ├── MovieCard.jsx       # Movie listing card
│   │   │   ├── Navbar.jsx          # Main navigation
│   │   │   └── TrailerSection.jsx  # YouTube trailer player
│   │   ├── context/
│   │   │   └── AppContext.jsx      # Global state (user, shows, favourites, admin)
│   │   ├── lib/                    # Utility helpers
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AddShows.jsx    # Admin: schedule a new show
│   │   │   │   ├── Dashboard.jsx   # Admin: stats overview
│   │   │   │   ├── Layout.jsx      # Admin layout wrapper
│   │   │   │   ├── ListBookings.jsx
│   │   │   │   └── ListShows.jsx
│   │   │   ├── Favourite.jsx       # User favourites page
│   │   │   ├── Home.jsx            # Homepage
│   │   │   ├── MovieDetails.jsx    # Single movie detail view
│   │   │   ├── Movies.jsx          # All movies listing
│   │   │   ├── MyBookings.jsx      # User's booking history
│   │   │   └── SeatLayout.jsx      # Interactive seat selection
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # React entry point
│   ├── .env                        # Client environment variables
│   ├── index.html
│   ├── package.json
│   ├── vercel.json                 # Vercel deployment config
│   └── vite.config.js
│
└── server/                         # Express backend
    ├── config/
    │   ├── db.js                   # MongoDB connection
    │   └── nodemailer.js           # SMTP email setup
    ├── controllers/
    │   ├── adminController.js      # Dashboard, show & booking listings
    │   ├── bookingController.js    # Booking creation, seat check, Stripe, verify
    │   ├── showController.js       # TMDB fetch, add show, get shows
    │   ├── stripeWebhooks.js       # Stripe webhook handler
    │   └── userController.js       # User bookings & favourites
    ├── inngest/
    │   └── index.js                # All Inngest background functions
    ├── middleware/
    │   └── auth.js                 # Admin role protection middleware
    ├── models/
    │   ├── Booking.js
    │   ├── Movie.js
    │   ├── Show.js
    │   └── User.js
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── bookingRoutes.js
    │   ├── showRoutes.js
    │   └── userRouter.js
    ├── .env                        # Server environment variables
    ├── package.json
    ├── server.js                   # Express app entry point
    └── vercel.json                 # Vercel deployment config
```

---

## 🏗️ Architecture & Data Flow

```
┌───────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                 │
│  Clerk Auth  →  AppContext  →  Pages  →  API (Axios)      │
└────────────────────────┬──────────────────────────────────┘
                         │ HTTP / REST
┌────────────────────────▼──────────────────────────────────┐
│                     Express Server                        │
│  Clerk Middleware → Routes → Controllers → MongoDB        │
│                                  ↓                        │
│                          Inngest Events                   │
│            (seat release / email / notifications)         │
└────────────────────────┬──────────────────────────────────┘
         ┌───────────────┼───────────────────┐
         ▼               ▼                   ▼
      MongoDB          Stripe             TMDB API
    (Atlas)         (Payments)        (Movie Data)
```

### Booking Flow

1. User selects a movie → date → showtime.
2. User picks seats on the interactive seat layout.
3. `POST /api/booking/create` — seats are locked, a Stripe Checkout session is created (expires in 30 min).
4. An **Inngest** `app/checkpayment` event is fired to auto-release seats if payment is not completed within 10 minutes.
5. User is redirected to Stripe. On success, they land on `/loading/my-bookings?session_id=...`.
6. `POST /api/booking/verify` — the `Loading` component calls this to confirm payment status.
7. If paid, `app/show.booked` Inngest event fires → a branded confirmation email is sent.

---

## 🗃️ Database Models

### `User`

| Field   | Type   | Notes               |
| ------- | ------ | ------------------- |
| `_id`   | String | Clerk User ID       |
| `name`  | String | Full name           |
| `email` | String | Primary email       |
| `image` | String | Profile picture URL |

### `Movie`

| Field               | Type   | Notes                  |
| ------------------- | ------ | ---------------------- |
| `_id`               | String | TMDB Movie ID          |
| `title`             | String |                        |
| `overview`          | String | Plot summary           |
| `poster_path`       | String | TMDB poster path       |
| `backdrop_path`     | String | TMDB backdrop path     |
| `release_date`      | String |                        |
| `original_language` | String |                        |
| `tagline`           | String |                        |
| `genres`            | Array  | List of genre objects  |
| `casts`             | Array  | Cast from TMDB credits |
| `vote_average`      | Number | TMDB rating            |
| `runtime`           | Number | Duration in minutes    |

### `Show`

| Field           | Type         | Notes                        |
| --------------- | ------------ | ---------------------------- |
| `movie`         | String (ref) | References `Movie._id`       |
| `showDateTime`  | Date         | Combined date & time of show |
| `showPrice`     | Number       | Price per seat (INR)         |
| `occupiedSeats` | Object       | `{ "A1": "userId", ... }`    |

### `Booking`

| Field         | Type         | Notes                 |
| ------------- | ------------ | --------------------- |
| `user`        | String (ref) | References `User._id` |
| `show`        | String (ref) | References `Show._id` |
| `amount`      | Number       | Total amount paid     |
| `bookedSeats` | Array        | e.g., `["A1", "A2"]`  |
| `isPaid`      | Boolean      | Payment status        |
| `paymentLink` | String       | Stripe Checkout URL   |

---

## 🌐 API Reference


### Show Routes — `/api/show`

| Method | Endpoint       | Auth   | Description                               |
| ------ | -------------- | ------ | ----------------------------------------- |
| `GET`  | `/now-playing` | Admin  | Fetch now-playing movies from TMDB        |
| `POST` | `/add`         | Admin  | Add a new show to the database            |
| `GET`  | `/all`         | Public | Get all upcoming shows (unique movies)    |
| `GET`  | `/:movieId`    | Public | Get show dates/times for a specific movie |

### Booking Routes — `/api/booking`

| Method | Endpoint         | Auth   | Description                          |
| ------ | ---------------- | ------ | ------------------------------------ |
| `POST` | `/create`        | User   | Create booking & Stripe session      |
| `POST` | `/verify`        | User   | Verify Stripe payment after redirect |
| `GET`  | `/seats/:showId` | Public | Get occupied seats for a show        |

### Admin Routes — `/api/admin`

| Method | Endpoint        | Auth  | Description                          |
| ------ | --------------- | ----- | ------------------------------------ |
| `GET`  | `/is-admin`     | Admin | Check if current user has admin role |
| `GET`  | `/dashboard`    | Admin | Get dashboard statistics             |
| `GET`  | `/all-shows`    | Admin | Get all shows                        |
| `GET`  | `/all-bookings` | Admin | Get all bookings                     |

### User Routes — `/api/user`

| Method | Endpoint            | Auth | Description                  |
| ------ | ------------------- | ---- | ---------------------------- |
| `GET`  | `/bookings`         | User | Get current user's bookings  |
| `POST` | `/update-favourite` | User | Toggle a movie in favourites |
| `GET`  | `/favourites`       | User | Get user's favourite movies  |


---

## 🔐 Environment Variables

### Client (`client/.env`)

```env
# Currency symbol displayed in the UI
VITE_CURRENCY='₹'

# Clerk publishable key (from https://clerk.com)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Backend API base URL
VITE_BASE_URL=http://localhost:5000

# TMDB image CDN base
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
```

### Server (`server/.env`)

```env
# Express server port
PORT=5000

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/showmax

# Clerk keys (from https://clerk.com)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Inngest keys (from https://inngest.com)
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=signkey-prod-...

# TMDB Bearer token (from https://www.themoviedb.org/settings/api)
TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9...

# Stripe keys (from https://stripe.com)
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Brevo SMTP or any SMTP provider)
SENDER_EMAIL=your@email.com
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A **MongoDB Atlas** cluster (free tier works)
- Accounts on: [Clerk](https://clerk.com), [Stripe](https://stripe.com), [TMDB](https://www.themoviedb.org/), [Inngest](https://inngest.com), [Brevo](https://brevo.com) (or any SMTP)

### 1. Clone the Repository

```bash
git clone https://github.com/JashwanthK-28/ShowMax.git
cd ShowMax
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create `server/.env` and `client/.env` files using the [Environment Variables](#environment-variables) section above as a template.

### 4. Set Up Clerk Webhooks (for user sync)

In your [Clerk Dashboard](https://dashboard.clerk.com):

1. Go to **Webhooks** → **Add Endpoint**
2. Set the URL to: `https://<your-backend-url>/api/inngest`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`

### 5. Set Up Stripe Webhooks

In your [Stripe Dashboard](https://dashboard.stripe.com/webhooks):

1. Add endpoint: `https://<your-backend-url>/api/stripe`
2. Subscribe to: `checkout.session.completed`, `checkout.session.expired`

### 6. Set Admin Role in Clerk

To grant admin access to a user:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → **Users**
2. Select the user → **Metadata** → **Private Metadata**
3. Set: `{ "role": "admin" }`

### 7. Run the Development Servers

```bash
# Terminal 1: Start the backend
cd server
npm run server     # Runs with nodemon on http://localhost:5000

# Terminal 2: Start the frontend
cd client
npm run dev        # Vite dev server on http://localhost:5173
```

### 8. Run Inngest Dev Server (for local background jobs)

```bash
npx inngest-cli@latest dev -u http://localhost:5000/api/inngest
```

Open [http://localhost:8288](http://localhost:8288) to view and trigger Inngest functions locally.

---

## 🛡️ Admin Access

The admin dashboard is protected at two levels:

1. **Frontend**: The `/admin/*` route requires the user to be signed in via Clerk. Non-authenticated users are shown the Clerk `<SignIn />` component.
2. **Backend**: Every admin API endpoint is guarded by the `protectAdmin` middleware, which checks that the authenticated Clerk user has `privateMetadata.role === "admin"`. Users without this role receive a `401 Not authorized` response.

**To access the admin dashboard:**

1. Sign in as a user who has been granted the `admin` role in Clerk.
2. Navigate to `/admin` — you will see the Dashboard, Add Shows, List Shows, and List Bookings sections in the sidebar.

---

## ⚙️ Background Jobs (Inngest)

ShowMax uses [Inngest](https://inngest.com) as its event-driven background job engine. All functions are defined in `server/inngest/index.js`.

| Function ID                        | Trigger Event        | Description                                                                       |
| ---------------------------------- | -------------------- | --------------------------------------------------------------------------------- |
| `sync-user-from-clerk`             | `clerk/user.created` | Creates a new user document in MongoDB when a user signs up via Clerk             |
| `update-user-from-clerk`           | `clerk/user.updated` | Updates user data in MongoDB when Clerk profile changes                           |
| `delete-user-from-clerk`           | `clerk/user.deleted` | Removes user document from MongoDB on Clerk account deletion                      |
| `release-seats-and-delete-booking` | `app/checkpayment`   | Waits 10 minutes after booking; if unpaid, releases seats and deletes the booking |
| `send-booking-confirmation-email`  | `app/show.booked`    | Sends a branded HTML confirmation email to the user after successful payment      |
| `send-new-show-notifications`      | `app/show.added`     | Sends a "New Show Alert" email to all registered users when a new show is added   |

---

## 🚢 Deployment

Both `client` and `server` are configured for **Vercel** deployment via their respective `vercel.json` files.

### Deploy the Server

```bash
cd server
vercel --prod
```

### Deploy the Client

```bash
cd client
vercel --prod
```

> **Important:** After deploying, update `VITE_BASE_URL` in the client's environment to point to the production server URL, and update your Stripe & Clerk webhook endpoints accordingly.

---

## 📄 License

This project is licensed under the **ISC License**.

---
