# 📱 Mobile Card Scanner App

A **full-stack mobile application** that allows users to scan business cards using the device camera, extract contact details via OCR, intelligently categorize them, and share selected cards publicly via secure links.

Built with **Node.js + Express + MongoDB** on the backend and **Ionic + Angular (Standalone APIs)** on the frontend, following **production-grade architecture and best practices**.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (USER / ADMIN)
- Secure route guards (backend & frontend)
- Centralized API response format

### 📷 Card Scanning (Core Feature)
- Camera integration (mobile & browser)
- Image → Base64 → OCR pipeline
- Extracted fields:
  - Name
  - Email
  - Phone
  - Company
- NLP-based categorization (Tech, Sales, Legal, etc.)

### 🗂 Card Management
- User-scoped CRUD operations
- Manual edit screen for OCR corrections
- Soft delete with restore support
- Full audit trail:
  - createdBy / createdAt
  - updatedBy / updatedAt
  - deletedBy / deletedAt

### 🌐 Public Sharing
- Toggle card as public/private
- Generate unique public code
- Shareable public link
- Public read-only access (no authentication)

### 📘 API Documentation
- Swagger (OpenAPI 3)
- JWT support inside Swagger UI
- Clear backend–frontend API contract

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- Swagger (swagger-ui-express)
- Tesseract.js (OCR)
- Security:
  - Helmet
  - CORS
  - Rate Limiting
  - Mongo Sanitize

### Frontend
- Ionic + Angular (Standalone APIs)
- Capacitor Camera
- JWT HTTP Interceptor
- Route Guards
- Feature-based modular structure

---

## 📂 Project Structure

```text
Mobile App/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── docs/swagger.yaml
│   └── server.js
│
├── frontend/
│   ├── src/app/
│   │   ├── core/
│   │   ├── features/
│   │   ├── shared/
│   │   └── app.config.ts
│   └── capacitor.config.ts
│
└── README.md
