# Mobile App (Business Card OCR + Manager)

This repo contains a full-stack mobile/web app for scanning business cards and managing them.

**What is done**
- Capture card images in the Ionic/Angular app using Capacitor Camera.
- Send the image to the backend OCR endpoint.
- Store and list cards for the signed-in user.
- Edit card details.
- Toggle a public share link per card.
- View card details on a dedicated page.
- Public card view by share code.
- Backend API with auth, cards CRUD, OCR, and Swagger docs.

**What will be done (planned / nice-to-have)**
- Card search and filters.
- Bulk import/export (CSV/vCard).
- Better detail UI (company logo, tags, notes).
- Native share sheet integration.
- Improved error states and loading skeletons.
- Admin dashboard for all cards.

---

## Repo Structure
- `frontend/` Ionic + Angular app (standalone components)
- `backend/` Node.js + Express API

---

## Frontend (Ionic + Angular)

**Tech**
- Angular 20
- Ionic 8
- Capacitor 8
- Ionicons 7

**Key screens**
- Cards list (scan + actions)
- Card details page
- Login
- Public card page

**Important files**
- `frontend/src/environments/environment.ts` API base URL
- `frontend/src/app/app.routes.ts` app routes

**Scripts**
```bash
cd frontend
npm install
npm run start
```

**Build**
```bash
cd frontend
npm run build
```

---

## Backend (Node.js + Express)

**Tech**
- Express
- MongoDB + Mongoose
- Tesseract.js (OCR)
- JWT auth
- Swagger UI

**Scripts**
```bash
cd backend
npm install
npm run dev
```

**Environment**
Create `backend/.env` from `backend/.env.example`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
SWAGGER_SHOW_ADMIN=true
```

**API Base URL**
Frontend calls the backend via:
`frontend/src/environments/environment.ts`

---

## API Overview

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

**Cards**
- `POST /api/cards/ocr` (OCR + create)
- `GET /api/cards` (list mine)
- `GET /api/cards/:id`
- `PATCH /api/cards/:id`
- `PATCH /api/cards/:id/public`
- `DELETE /api/cards/:id`
- `GET /api/cards/admin/all` (admin only)

**Public**
- `GET /api/public/:code`

**Swagger**
- `/api/docs`

---

## Local Development Flow
1. Start MongoDB.
2. Run the backend (`npm run dev`).
3. Update `frontend/src/environments/environment.ts` to point to the backend.
4. Run the frontend (`npm run start`).

---

## Notes
- The OCR endpoint expects a base64 image in `imageBase64`.
- Public links use `/public/:code` and map to `/api/public/:code` on the backend.

---

## Roadmap / Next Steps
1. Add search, filters, and sorting.
2. Add vCard export and share.
3. Improve UI states (loading, empty, error).
4. Add admin UI for `/api/cards/admin/all`.
5. Add integration tests for OCR flow.
