# Server README (`/server/README.md`)

## Overview

A simplified Feedback Collection Platform backend that allows admins to register, login, create customizable feedback forms, share public URLs, and view responses.

### Tech Stack

- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT-based
- **Validation:** Joi

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)

### Setup & Installation

1. **Clone the repo**

   ```bash
   cd server
   git clone <repo-url> .
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in `/server`:

   ```ini
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   ```

4. **Run the server**

   - Development (with auto-reload):

     ```bash
     npm run dev
     ```

   - Production:

     ```bash
     npm start
     ```

### Folder Structure

```bash
/server
├── config        # DB connection, environment setup
├── controllers   # Route handlers (auth, forms, responses)
├── middleware    # Auth checks, error handling
├── models        # Mongoose schemas
├── routes        # Express routers
├── utils         # Helpers (e.g., input validation)
├── .env
├── server.js     # App entry point
└── package.json
```

### API Endpoints

| Method | Path                           | Description                            |
| ------ | ------------------------------ | -------------------------------------- |
| POST   | `/api/auth/register`           | Register a new admin                   |
| POST   | `/api/auth/login`              | Login admin and receive JWT            |
| POST   | `/api/forms`                   | Create a new feedback form (protected) |
| GET    | `/api/forms`                   | List all forms (protected)             |
| GET    | `/api/forms/:formId`           | Get form details and responses summary |
| POST   | `/api/forms/:formId/submit`    | Submit a response (public)             |
| GET    | `/api/forms/:formId/responses` | Get all raw responses (protected)      |

### Design Decisions

- **Modular Structure:** Separates concerns (controllers, routes, models) for maintainability.
- **Flexible Form Schema:** Questions stored as array of objects (type, options).
- **Validation:** Joi schemas ensure data integrity.
- **Security:** JWT for auth, helmet & rate limiting recommended for production.
