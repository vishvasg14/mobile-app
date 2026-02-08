📱 Mobile Card Scanner App

A full-stack mobile application that allows users to scan business cards using the device camera, extract contact details via OCR, categorize them intelligently, and share selected cards publicly through secure links.

Built with Node.js + Express + MongoDB on the backend and Ionic + Angular (Standalone) on the frontend, following production-grade architecture and best practices.

🚀 Features
🔐 Authentication & Authorization

JWT-based authentication

Role-Based Access Control (USER / ADMIN)

Secure route guards (backend & frontend)

Centralized response structure

📷 Card Scanning (Core Feature)

Camera integration (mobile & browser)

Image → Base64 → OCR pipeline

Extracts:

Name

Email

Phone

Company

NLP-based categorization (Tech, Sales, Legal, etc.)

🗂 Card Management

User-scoped CRUD operations

Manual edit screen for OCR corrections

Soft delete with restore support

Full audit trail:

createdBy / createdAt

updatedBy / updatedAt

deletedBy / deletedAt

🌐 Public Sharing

Toggle card as public/private

Generate unique public code

Shareable public link

Public read-only access (no authentication)

📘 API Documentation

Swagger (OpenAPI 3)

JWT support in Swagger UI

Clear API contracts for frontend/mobile use

🧱 Tech Stack
Backend

Node.js

Express.js

MongoDB (Atlas)

Mongoose

JWT Authentication

Swagger (swagger-ui-express)

Tesseract.js (OCR)

Security

Helmet

CORS

Rate Limiting

Mongo Sanitize

Frontend

Ionic + Angular (Standalone APIs)

Capacitor Camera

JWT Interceptor

Route Guards

Modular feature-based structure

📂 Project Structure
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

⚙️ Environment Setup
Backend .env

Create a .env file in backend/:

NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
LOG_LEVEL=info

▶️ Running the Application
Backend
cd backend
npm install
npm run dev


API Base URL: http://localhost:5000/api

Swagger Docs: http://localhost:5000/api/docs

Frontend
cd frontend
npm install
ionic serve


App URL: http://localhost:8100

🔄 API Response Format (Centralized)

All APIs return responses in the following structure:

{
  "responseCode": 200,
  "responseMessage": "Success",
  "responseObject": {},
  "pageSize": null
}


This ensures consistency across web & mobile clients.

🛡 Security Highlights

JWT-based authorization

Role-based endpoint access

Rate limiting for auth & APIs

MongoDB query sanitization

Request size limits (OCR safe)

Secure headers via Helmet

Soft delete instead of hard delete

📌 Future Enhancements

Search & pagination

Admin dashboard (RBAC UI)

Cloud OCR (Google Vision / AWS Textract)

Push notifications

APK / iOS build & deployment

👨‍💻 Author

Vishvas Gohil
Java & Full-Stack Developer

GitHub: https://github.com/vishvasg14

LinkedIn: https://www.linkedin.com/in/vishvasg14
