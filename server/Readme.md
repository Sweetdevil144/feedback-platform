# Feedback Collection Platform

## Overview

A simplified Feedback Collection Platform where businesses (admins) can create customizable feedback forms and view responses, and customers can access and submit feedback without authentication.

This repository contains the backend API for the platform, built with Node.js, Express, and MongoDB.

---

## Features

- **Admin**

  - Register & login (JWT-based authentication)
  - Create forms with 3–5 questions (text or multiple-choice)
  - List your forms
  - View raw responses for a specific form

- **Public**

  - Access a form via a public URL
  - Submit responses without login
  - View a basic summary (title, questions, total submissions)

(Optional/BONUS features to implement later)

- Export form responses as CSV
- Mobile-responsive UI support flags in API

---

## Tech Stack

- **Runtime & Framework**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Logging & Dev Tools**: morgan, cors

---

## Prerequisites

- Node.js (>=14)
- npm or yarn
- MongoDB instance (local or Atlas)

---

## Setup & Installation

1. **Clone the repo**

   ```bash
   git clone <your-repo-url>
   cd feedback-platform/server
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or yarn install
   ```

3. **Environment variables**
   Create a `.env` file in `server/` with the following keys:

   ```ini
   PORT=5000
   MONGODB_URI=<your-mongo-connection-string>
   JWT_SECRET=<your-secret-key>
   ```

4. **Run the server**

   ```bash
   npm start
   # or nodemon start if you have nodemon configured
   ```

The API should now be listening on `http://localhost:5000`.

---

## Folder Structure

```bash
server/
├── config/
│   ├── db.js           # MongoDB connection logic
│   └── jwt.js          # JWT generate & verify
├── controllers/        # Request handlers for each resource
│   ├── auth.js
│   └── form.js
├── middleware/         # Global & custom middleware
│   └── middleware.js
├── models/             # Mongoose schemas & models
│   ├── User.js
│   └── Form.js
├── routes/
│   ├── auth.js         # Auth endpoints
│   └── form.js         # (To be created) Form endpoints
├── .env                # Environment variables (gitignored)
└── server.js           # Application entry point
```

---

## Environment Variables

| Key         | Description                               |
| ----------- | ----------------------------------------- |
| PORT        | Port to run the server on (default: 5000) |
| MONGODB_URI | MongoDB connection string                 |
| JWT_SECRET  | Secret key for signing JWT tokens         |

---

## API Reference

### Authentication Routes

| Method | Endpoint               | Protected | Body/Params                 | Description                 |
| ------ | ---------------------- | --------- | --------------------------- | --------------------------- |
| POST   | `/api/auth/register`   | No        | `{ name, email, password }` | Register a new admin user   |
| POST   | `/api/auth/login`      | No        | `{ email, password }`       | Login and receive JWT token |
| GET    | `/api/auth/me/profile` | Yes       | (Bearer token in header)    | Get current user profile    |

### Form Routes (to implement)

| Method | Endpoint                       | Protected | Body / Params                                              | Description                                |
| ------ | ------------------------------ | --------- | ---------------------------------------------------------- | ------------------------------------------ |
| POST   | `/api/forms`                   | Yes       | `{ title, questions: [ {questionText, type, options?} ] }` | Create a new form                          |
| GET    | `/api/forms`                   | Yes       | (Bearer token)                                             | List all forms for the authenticated admin |
| GET    | `/api/forms/:formId`           | No        | `:formId` (publicId)                                       | Get form details & summary                 |
| POST   | `/api/forms/:formId/responses` | No        | `{ answers: [ {questionIndex, answer} ] }`                 | Submit a response to a form                |
| GET    | `/api/forms/:formId/responses` | Yes       | (Bearer token), `:formId`                                  | Get all raw responses (admin only)         |
| GET    | `/api/forms/:formId/summary`   | No or Yes | (Bearer token optional), `:formId`                         | Get aggregated stats per question (TBD)    |
| GET    | `/api/forms/:formId/export`    | Yes       | `:formId`, query params for format (e.g., csv)             | Download responses as CSV (bonus)          |

---

## Data Models

### User

- `_id`: ObjectId
- `name`: String, required
- `email`: String, required, unique
- `password`: String, required (currently plaintext; **TODO:** hash with bcrypt)

### Form

- `_id`: ObjectId
- `title`: String, required
- `questions`: Array of 3–5 objects:

  - `questionText`: String
  - `type`: "text" or "multiple-choice"
  - `options`: \[String] (only for multiple-choice)

- `createdBy`: ObjectId ref to User
- `publicId`: String (UUID)
- `responses`: Array of submissions:

  - `answers`: Array of `{ questionIndex, answer }`
  - `submittedAt`: Date

---

## Authentication & Security

- All protected routes expect an `Authorization: Bearer <token>` header.
- Tokens are signed with the `JWT_SECRET` and expire in 7 days.
- **TODO:** Implement password hashing and secure storage (e.g., bcrypt).
- **TODO:** Centralize JWT verification in a reusable middleware.

---

## Error Handling

- Currently each controller catches errors and responds with status 500.
- **TODO:** Add a global error-handling middleware for consistent JSON error responses.

---

## To-Do & Missing Back-End Work

1. **Routing**

   - Create `routes/form.js` and wire it up in `server.js` (e.g., `app.use('/api/forms', formRoutes)`).

2. **Security Enhancements**

   - Hash passwords on registration (bcrypt)
   - Move JWT verification into Express middleware
   - Sanitize and validate inputs (e.g., using `express-validator` or `Joi`)
   - Rate limiting / brute-force protection on auth endpoints

3. **Validation**

   - Centralize request validation schemas for auth and form endpoints

4. **Response Summary**

   - Build a `/summary` endpoint to aggregate stats (e.g., counts per option)

5. **Export CSV**

   - Implement an endpoint to stream/download responses as CSV

6. **Pagination & Filtering**

   - Add pagination for listing forms and responses

7. **Testing**

   - Unit tests for controllers & models (e.g., Jest)
   - Integration tests for API endpoints

8. **Documentation**

   - Add Swagger/OpenAPI spec for all endpoints

9. **Deployment**

   - Dockerize the application
   - Provide cloud deployment scripts (Heroku, ECS, etc.)

---
