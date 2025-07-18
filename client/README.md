# Client README (`/client/README.md`)

## Overview

A React-based frontend for the Feedback Collection Platform, enabling admins to create forms and view dashboards, and public users to submit feedback via shared URLs.

### Tech Stack

- **Framework:** NextJS
- **Styling:** Tailwind CSS

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup & Installation

1. **Navigate & install**

   ```bash
   cd client
   npm install
   ```

2. **Configure environment**
   Create a `.env` in `/client`:

   ```ini
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Run the app**

   ```bash
   npm start
   ```

   App will be available at `http://localhost:3000`

### Folder Structure

```bash
/client
├── public          # Static assets, index.html
├── src
│   ├── components  # Reusable UI components
│   ├── pages       # Route-based pages (Dashboard, FormBuilder)
│   ├── services    # API calls (axios instances)
│   ├── store       # Redux store and slices (if used)
│   ├── styles      # Global CSS / Tailwind config
│   └── App.jsx     # Root component & router
└── package.json
```

### Features

- **Admin Dashboard:** List, view, and export form responses.
- **Form Builder:** Create forms with text/multiple-choice questions.
- **Public Form:** Fill and submit feedback without login.
- **Bonus:** CSV export option and mobile-responsive design.

### Design Decisions

- **Component-Driven:** Break UI into small, reusable pieces.
- **Tailwind CSS:** Utility-first for rapid styling and responsiveness.
- **Axios Interceptors:** Attach JWT automatically on protected requests.
- **Routing Guards:** Protect admin routes based on auth status.

---

> Feel free to adjust environment variables and folder names as needed. Let's start building!
