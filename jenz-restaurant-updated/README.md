# Yāzhi — யாழி — Full MERN Stack Restaurant + Table Reservation System

Modern Tamil Heritage Dining: a full-stack restaurant experience with online
ordering, an interactive table-reservation system, and a Tamil-heritage
visual identity (kolam, brass, terracotta, banana leaf) layered over the
same backend and functionality described below.

A complete restaurant website with online ordering AND an interactive visual
table-seating reservation system (the floor layout you shared was used as the
reference for the seating map: window booths along the top, round 4-seat
tables in two rows, and a bench table near the entrance).

## Yāzhi visual identity (this redesign)

- **Design tokens**: `frontend/tailwind.config.js` — the Yāzhi palette (Midnight
  Deep, Temple Brass, Brass Light, Terracotta, Kungum Red, Banana Leaf, Ivory)
  is defined once here and consumed by every existing utility class
  (`btn-gold`, `card-premium`, `text-gold`, `bg-charcoal-gradient`, …), so the
  whole app — including admin pages not individually redesigned — inherits
  the same look from a single source of truth.
- **Heritage components**: `frontend/src/components/brand/` — `Logo`,
  `TamilTag` (bilingual EN/Tamil section labels), `KolamMotif` (fixed side
  rail + corner + divider), `ElephantMotif`, `BananaLeafAccent`, `Reveal`
  (scroll-reveal, no extra runtime dependency), `Parallax` (lightweight
  scroll-based depth effect). All respect `prefers-reduced-motion`.
- **Assets**: `frontend/src/assets/images/{brand,hero,interior,about,food,
  moments/*}` — the supplied logo and restaurant photography, organized by
  section and imported locally (no remote image URLs).
- **Image optimization**: raw photos were resized/compressed in place with
  `frontend/scripts/optimize-images.mjs` (75MB → ~5MB source, ~4MB production
  build). If you add new photos later, temporarily add `sharp` and `glob` as
  dev dependencies (`npm i -D sharp glob`) and re-run
  `node scripts/optimize-images.mjs` after adjusting the file globs.

## What's included

- **backend/** — Node.js + Express + MongoDB (Mongoose) + JWT auth
- **frontend/** — React + Vite + Tailwind CSS

Highlights:
- Visual, clickable restaurant floor plan (`TableLayout.jsx` / `TableCard.jsx`)
- Backend-driven availability: table + date + time overlap checking (not a
  hardcoded frontend list) — see `tableController.getAvailableTables`
- Booking approval workflow: Pending → Approved/Rejected, with a second
  conflict check at approval time (`bookingController.approveBooking`)
- Full menu/cart/checkout/orders flow
- Admin dashboard, category/menu/order/booking/table management
- JWT auth for customers, role-protected admin routes (server-side, not just
  hidden UI)

## 1. Install prerequisites

- Node.js 18+ (https://nodejs.org)
- A MongoDB database — either:
  - Local MongoDB (`mongodb://localhost:27017`), or
  - A free MongoDB Atlas cluster (https://www.mongodb.com/atlas) — recommended

## 2. Backend setup

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:5173
RESERVATION_DURATION_MINUTES=90
```

(Cloudinary and Nodemailer variables are optional — the app runs fine without
them; menu images just fall back to placeholder URLs and no emails are sent.)

Install and run:

```bash
npm install
npm run server      # starts with nodemon on http://localhost:4000
```

### Seed an admin user, tables, and categories

```bash
node seed.js
```

This creates:
- Admin login: `admin@yazhirestaurant.com` / `Admin@123`
- 10 tables laid out like your floor plan (3 window booths, 6 round tables, 1
  entrance bench)
- 7 starter categories

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env
```

`.env` should contain:

```
VITE_BACKEND_URL=http://localhost:4000
```

Install and run:

```bash
npm install
npm run dev          # starts on http://localhost:5173
```

## 4. Try it out

1. Open http://localhost:5173 — browse the menu, sign up as a customer.
2. Go to **Book Table** → enter guests/date/time → you'll land on the visual
   seating map → click an available table → **Request Reservation**.
3. Go to http://localhost:5173/admin/login and log in with the seeded admin
   account.
4. In **Admin → Bookings**, approve or reject the reservation you just made —
   watch it update instantly in the customer's **My Bookings** page.
5. In **Admin → Table Management**, add/edit tables — they show up immediately
   on the customer seating map, since both read from the same `/api/tables`
   endpoint.
6. In **Admin → Categories / Menus**, add a few dishes so the **Menu** page
   isn't empty, then test Cart → Checkout → My Orders → Admin → Orders status
   updates.

## Key files if you want to customize the seating layout

- `backend/seed.js` — table positions (`position.x` / `position.y`, in % of
  the floor canvas) and capacities
- `frontend/src/components/TableLayout.jsx` — renders the floor plan
- `frontend/src/components/TableCard.jsx` — a single table + chairs
- `backend/controllers/tableController.js` — the availability/overlap logic
- `backend/controllers/bookingController.js` — booking creation + approval

## Notes

- Double-booking is prevented **per table**, not per time-slot — Table T01
  booked at 7 PM never blocks Table T02 at 7 PM (see `hasConflict` in
  `bookingController.js` and `getAvailableTables` in `tableController.js`).
- Admin routes are protected by real backend middleware (`protect` +
  `adminOnly`), not just hidden UI — visiting `/admin/dashboard` without an
  admin JWT is rejected by the API itself.
